import {
  Controller,
  Post,
  Body,
  Query,
  ParseIntPipe,
  Get,
  Param,
} from '@nestjs/common';
import { PaginationResult, ProductService } from './product.service';
import { CreateProductDto } from './dto/product.dto';
import { Product } from './models/product.entity';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ProductTranslationDto } from './dto/product-translation.dto';
import { ProductTranslation } from './models/product-translation.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  @Get('search')
  @ApiQuery({ name: 'query', required: true, description: 'Search query' })
  @ApiQuery({
    name: 'language',
    required: false,
    description: 'Language of the product',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiOperation({ summary: 'Search products by name and language' })
  @ApiQuery({ name: 'query', description: 'Search query', required: true })
  @ApiQuery({
    name: 'language',
    description: 'Language of the product (optional)',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of products per page for pagination',
    required: false,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'A list of products matching the search query',
    type: [Product],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input for query parameters.',
  })
  @ApiResponse({
    status: 404,
    description: 'No products found for the given query.',
  })
  async searchProducts(
    @Query('query') query: string,
    @Query('language') language?: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ): Promise<PaginationResult<Product>> {
    return this.productsService.search(query, language, page, limit);
  }

  @ApiOperation({ summary: 'getProductWithTranslations' })
  @Get(':id')
  async getProductWithTranslations(@Param('id') id: number): Promise<Product> {
    return this.productsService.getProductWithTranslations(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input, object invalid.' })
  @ApiResponse({
    status: 409,
    description: 'Duplicate key value violates unique constraint.',
    schema: {
      example: {
        message:
          'Duplicate key value violates unique constraint "UQ_34f6ca1cd897cc926bdcca1ca39"',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Post(':productId/translations')
  @ApiOperation({ summary: 'Add a new translation to a product' })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: 'The ID of the product to add a translation to',
    example: 1,
  })
  @ApiBody({
    description: 'Translation data',
    type: ProductTranslationDto,
  })
  @ApiCreatedResponse({
    description: 'The translation has been successfully added.',
    type: ProductTranslation,
  })
  async addTranslation(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() translationDto: ProductTranslationDto,
  ): Promise<ProductTranslation> {
    return this.productsService.addTranslation(productId, translationDto);
  }
}
