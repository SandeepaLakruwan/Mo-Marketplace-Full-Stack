import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateVariantDto {
  @ApiProperty({ example: 'uuid-of-product' })
  @IsUUID()
  productId!: string;

  @ApiProperty({ example: 'red' })
  @IsString()
  @IsNotEmpty()
  color!: string;

  @ApiProperty({ example: 'M' })
  @IsString()
  @IsNotEmpty()
  size!: string;

  @ApiProperty({ example: 'cotton' })
  @IsString()
  @IsNotEmpty()
  material!: string;

  @ApiPropertyOptional({
    example: 5.0,
    description: 'Extra price on top of base',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceModifier?: number;

  @ApiProperty({
    example: 100,
    description: 'Stock quantity (0 = out of stock)',
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stockQuantity!: number;
}
