import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './models/product.entity';
import { ProductTranslation } from './models/product-translation.entity';
import { CreateProductDto } from './dto/product.dto';
import { ProductTranslationDto } from './dto/product-translation.dto';

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductTranslation)
    private productTranslationRepository: Repository<ProductTranslation>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['translations'],
    });
  }

  async getProductWithTranslations(productId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['translations'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    try {
      return await this.productRepository.save(product);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `Duplicate key value violates unique constraint "${error.constraint}"`,
        );
      } else {
        throw error;
      }
    }
  }

  async search(
    query: string,
    language: string,
    page: number,
    limit: number,
  ): Promise<PaginationResult<Product>> {
    const [items, total] = await this.productTranslationRepository
      .createQueryBuilder('translation')
      .leftJoinAndSelect('translation.product', 'product')
      .where('translation.name ILIKE :query', { query: `%${query}%` })
      .andWhere(language ? 'translation.language = :language' : '1=1', {
        language,
      })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items: items.map((t) => t.product),
      total,
      page,
      limit,
    };
  }

  async addTranslation(
    productId: number,
    translationDto: ProductTranslationDto,
  ): Promise<ProductTranslation> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['translations'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const existingTranslation = product.translations.find(
      (t) => t.language === translationDto.language,
    );
    if (existingTranslation) {
      throw new ConflictException(
        `Translation for language '${translationDto.language}' already exists`,
      );
    }

    const translation = this.productTranslationRepository.create({
      ...translationDto,
      product,
    });

    return this.productTranslationRepository.save(translation);
  }
}
