import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService, PaginationResult } from './product.service';
import { CreateProductDto } from './dto/product.dto';
import { Product } from './models/product.entity';
import { ProductTranslationDto } from './dto/product-translation.dto';
import { ProductTranslation } from './models/product-translation.entity';
import { ValidationPipe, ConflictException } from '@nestjs/common';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  const mockProductService = {
    getAllProducts: jest.fn(),
    create: jest.fn(),
    search: jest.fn(),
    addTranslation: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    productController = moduleRef.get<ProductController>(ProductController);
    productService = moduleRef.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      const result: Product[] = [
        {
          id: 1,
          sku: 'SKU001',
          price: 10.99,
          translations: [],
        },
      ];
      jest.spyOn(productService, 'getAllProducts').mockResolvedValue(result);

      expect(await productController.getAllProducts()).toBe(result);
      expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe('createProduct', () => {
    it('should create a new product successfully', async () => {
      const createProductDto: CreateProductDto = {
        sku: 'SKU002',
        price: 15.99,
        translations: [
          {
            language: 'en',
            name: 'Test Product',
            description: 'Test Description',
          },
        ],
      };

      const createdProduct: Product = {
        id: 2,
        sku: 'SKU002',
        price: 15.99,
        translations: [
          {
            id: 1,
            language: 'en',
            name: 'Test Product',
            description: 'Test Description',
            product: {
              id: 2,
              sku: 'SKU002',
              price: 15.99,
              translations: [],
            },
          },
        ],
      };

      jest.spyOn(productService, 'create').mockResolvedValue(createdProduct);

      const result = await productController.createProduct(createProductDto);

      expect(result).toEqual(createdProduct);
      expect(productService.create).toHaveBeenCalledWith(createProductDto);
    });

    it('should throw a ConflictException if product already exists', async () => {
      const createProductDto: CreateProductDto = {
        sku: 'SKU001',
        price: 10.99,
        translations: [{ language: 'en', name: 'test', description: 'test' }],
      };
      jest
        .spyOn(productService, 'create')
        .mockRejectedValue(new ConflictException('Duplicate SKU'));

      await expect(
        productController.createProduct(createProductDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw an error if invalid data is provided', async () => {
      const createProductDto = {} as CreateProductDto;

      const validationPipe = new ValidationPipe({ whitelist: true });

      await expect(
        validationPipe.transform(createProductDto, {
          type: 'body',
          metatype: CreateProductDto,
        }),
      ).rejects.toThrow();
    });
  });

  describe('searchProducts', () => {
    it('should return paginated products matching the search query', async () => {
      const query = 'Test';
      const language = 'en';
      const page = 1;
      const limit = 10;

      const result: PaginationResult<Product> = {
        items: [
          {
            id: 1,
            sku: 'SKU001',
            price: 10.99,
            translations: [],
          },
        ],
        total: 1,
        page,
        limit,
      };

      jest.spyOn(productService, 'search').mockResolvedValue(result);

      expect(
        await productController.searchProducts(query, language, page, limit),
      ).toBe(result);

      expect(productService.search).toHaveBeenCalledWith(
        query,
        language,
        page,
        limit,
      );
    });

    it('should use default pagination parameters if none are provided', async () => {
      const query = 'Test';
      const result: PaginationResult<Product> = {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
      };
      jest.spyOn(productService, 'search').mockResolvedValue(result);

      expect(await productController.searchProducts(query)).toBe(result);
      expect(productService.search).toHaveBeenCalledWith(
        query,
        undefined,
        1,
        10,
      );
    });

    it('should throw NotFoundException if no products are found', async () => {
      const query = 'NonExistentProduct';

      jest.spyOn(productService, 'search').mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      const result = await productController.searchProducts(query);

      expect(result.items.length).toBe(0);
    });
  });

  describe('addTranslation', () => {
    it('should add a new translation to the product', async () => {
      const productId = 1;
      const translationDto: ProductTranslationDto = {
        language: 'en',
        name: 'Test Product',
        description: 'Test Description',
      };

      const result: ProductTranslation = {
        id: 15,
        language: 'en',
        name: 'Test Product',
        description: 'Test Description',
        product: {
          id: productId,
          sku: '12345-ABC',
          price: 19.99,
          translations: [],
        },
      };

      jest.spyOn(productService, 'addTranslation').mockResolvedValue(result);

      const response = await productController.addTranslation(
        productId,
        translationDto,
      );

      expect(response).toEqual(result);

      expect(response.id).toBe(15);
      expect(response.language).toBe(translationDto.language);
      expect(response.name).toBe(translationDto.name);
      expect(response.description).toBe(translationDto.description);
      expect(response.product.id).toBe(productId);
      expect(response.product.sku).toBe('12345-ABC');
      expect(response.product.price).toBe(19.99);

      expect(productService.addTranslation).toHaveBeenCalledWith(
        productId,
        translationDto,
      );
    });

    it('should throw an error if service throws an error', async () => {
      const productId = 1;
      const translationDto: ProductTranslationDto = {
        language: 'en',
        name: 'Test Product',
        description: 'Test Description',
      };
      jest
        .spyOn(productService, 'addTranslation')
        .mockRejectedValue(new Error('Service Error'));

      await expect(
        productController.addTranslation(productId, translationDto),
      ).rejects.toThrow('Service Error');
    });
  });
});
