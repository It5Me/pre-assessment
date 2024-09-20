import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsPositive,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductTranslationDto } from './product-translation.dto';

export class CreateProductDto {
  @ApiProperty({
    description: 'Stock Keeping Unit identifier',
    example: 'SKU123456',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'SKU must not be empty.' })
  @MaxLength(50, { message: 'SKU must be at most 50 characters long.' })
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message: 'SKU can only contain letters, numbers, underscores, and hyphens.',
  })
  sku: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 99.99,
    type: Number,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a number with up to two decimal places.' },
  )
  @IsPositive({ message: 'Price must be a positive number.' })
  price: number;

  @ApiProperty({
    description: 'List of product translations',
    type: [ProductTranslationDto],
  })
  @IsArray({ message: 'Translations must be an array.' })
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  translations: ProductTranslationDto[];
}
