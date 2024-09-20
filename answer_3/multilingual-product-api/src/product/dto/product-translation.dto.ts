import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty, MaxLength } from 'class-validator';

export class ProductTranslationDto {
  @ApiProperty({
    description: 'ISO 639-1 language code (e.g., "en" for English)',
    example: 'en',
    type: String,
  })
  @IsString()
  @Length(2, 2, { message: 'Language code must be exactly 2 characters long.' })
  language: string;

  @ApiProperty({
    description: 'Name of the product in the specified language',
    example: 'Sample Product',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Product name must not be empty.' })
  @MaxLength(100, {
    message: 'Product name must be at most 100 characters long.',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the product in the specified language',
    example: 'This is a sample product description.',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Product description must not be empty.' })
  @MaxLength(500, {
    message: 'Product description must be at most 500 characters long.',
  })
  description: string;
}
