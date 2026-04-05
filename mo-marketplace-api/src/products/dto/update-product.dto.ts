import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

// PartialType makes all fields
export class UpdateProductDto extends PartialType(CreateProductDto) {}
