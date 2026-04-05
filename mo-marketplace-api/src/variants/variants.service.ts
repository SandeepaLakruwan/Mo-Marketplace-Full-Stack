import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from './entities/variant.entity';
import { CreateVariantDto } from './dto/create-variant.dto';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(Variant)
    private variantsRepository: Repository<Variant>,
  ) {}

  /**
   * Generates a deterministic combination key.
   * Values are lowercased and sorted to prevent "red-M-cotton" vs "cotton-M-red" duplicates.
   * Example: generateCombinationKey("Red", "M", "Cotton") => "cotton-M-red"
   */
  private generateCombinationKey(
    color: string,
    size: string,
    material: string,
  ): string {
    // Normalize and sort attributes
    const attributes = [
      color.toLowerCase().trim(),
      size.trim(), // Keep size case as-is (XS, S, M, L, XL)
      material.toLowerCase().trim(),
    ];
    return attributes.join('-');
  }

  async create(createVariantDto: CreateVariantDto): Promise<Variant> {
    const { color, size, material, productId } = createVariantDto;

    // Generate the combination key
    const combination_key = this.generateCombinationKey(color, size, material);

    // Check if this combination already exists for this product
    const existingVariant = await this.variantsRepository.findOne({
      where: { productId, combination_key },
    });

    if (existingVariant) {
      throw new ConflictException(
        `Variant with combination "${combination_key}" already exists for this product. ` +
          `Duplicate variant combinations are not allowed.`,
      );
    }

    // Create and save variant
    const variant = this.variantsRepository.create({
      ...createVariantDto,
      combination_key,
    });

    return this.variantsRepository.save(variant);
  }

  async findByProduct(productId: string): Promise<Variant[]> {
    return this.variantsRepository.find({
      where: { productId, isActive: true },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Variant> {
    const variant = await this.variantsRepository.findOne({ where: { id } });
    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }
    return variant;
  }

  async updateStock(id: string, quantity: number): Promise<Variant> {
    const variant = await this.findOne(id);
    variant.stockQuantity = quantity;
    return this.variantsRepository.save(variant);
  }

  async remove(id: string): Promise<void> {
    const variant = await this.findOne(id);
    await this.variantsRepository.remove(variant);
  }
}
