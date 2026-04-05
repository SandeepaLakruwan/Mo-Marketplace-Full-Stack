import { useState } from 'react';
import type { Variant } from '../types';

interface Props {
  variants: Variant[];
  onSelect: (variant: Variant | null) => void;
}

export const VariantSelector = ({ variants, onSelect }: Props) => {
  const [selected, setSelected] = useState<Variant | null>(null);

  // Get unique values for each attribute
  const colors = [...new Set(variants.map(v => v.color))];
  const sizes = [...new Set(variants.map(v => v.size))];
  const materials = [...new Set(variants.map(v => v.material))];

  const [selColor, setSelColor] = useState('');
  const [selSize, setSelSize] = useState('');
  const [selMaterial, setSelMaterial] = useState('');

  const findVariant = (color: string, size: string, material: string) => {
    return variants.find(
      v => v.color === color && v.size === size && v.material === material
    ) || null;
  };

  const handleSelect = (color = selColor, size = selSize, material = selMaterial) => {
    if (color && size && material) {
      const variant = findVariant(color, size, material);
      setSelected(variant);
      onSelect(variant);
    }
  };

  return (
    <div>
      {/* Color Selection */}
      <div style={{ marginBottom: '1rem' }}>
        <p className="form-label">Color</p>
        <div className="variant-options">
          {colors.map(color => (
            <button
              key={color}
              className={`variant-option ${selColor === color ? 'selected' : ''}`}
              onClick={() => { setSelColor(color); handleSelect(color, selSize, selMaterial); }}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div style={{ marginBottom: '1rem' }}>
        <p className="form-label">Size</p>
        <div className="variant-options">
          {sizes.map(size => (
            <button
              key={size}
              className={`variant-option ${selSize === size ? 'selected' : ''}`}
              onClick={() => { setSelSize(size); handleSelect(selColor, size, selMaterial); }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Material Selection */}
      <div style={{ marginBottom: '1rem' }}>
        <p className="form-label">Material</p>
        <div className="variant-options">
          {materials.map(mat => {
            // Check if this material combo is out of stock
            const variant = selColor && selSize
              ? findVariant(selColor, selSize, mat)
              : null;
            const outOfStock = variant !== null && variant.stockQuantity === 0;

            return (
              <button
                key={mat}
                className={`variant-option ${selMaterial === mat ? 'selected' : ''}`}
                disabled={outOfStock}
                title={outOfStock ? 'Out of stock' : ''}
                onClick={() => { setSelMaterial(mat); handleSelect(selColor, selSize, mat); }}
              >
                {mat}
                {outOfStock && ' (OOS)'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected variant info */}
      {selected && (
        <div className="alert alert-success" style={{ marginTop: '1rem' }}>
          <strong>Selected:</strong> {selected.combination_key} — 
          Stock: {selected.stockQuantity} units
          {selected.priceModifier > 0 && ` (+$${selected.priceModifier})`}
        </div>
      )}
      {selColor && selSize && selMaterial && !selected && (
        <div className="alert alert-error" style={{ marginTop: '1rem' }}>
          This combination is not available
        </div>
      )}
    </div>
  );
};