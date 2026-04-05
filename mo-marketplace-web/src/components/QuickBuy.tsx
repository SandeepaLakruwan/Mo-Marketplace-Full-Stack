import { useState } from 'react';
import { VariantSelector } from './VariantSelector';
import type { Product, Variant } from '../types';

interface Props {
  product: Product;
  onClose: () => void;
}

export const QuickBuy = ({ product, onClose }: Props) => {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [purchased, setPurchased] = useState(false);

  const totalPrice = selectedVariant
    ? (Number(product.basePrice) + Number(selectedVariant.priceModifier || 0)) * quantity
    : Number(product.basePrice) * quantity;

  const handleBuy = () => {
    setPurchased(true);
    setTimeout(onClose, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product.name}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {purchased ? (
          <div className="alert alert-success">
            ✅ Order placed successfully! Redirecting...
          </div>
        ) : (
          <>
            <VariantSelector
              variants={product.variants}
              onSelect={setSelectedVariant}
            />

            {/* Quantity Selector */}
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button className="btn btn-secondary"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span style={{ padding: '0 1rem', fontSize: '1.1rem' }}>{quantity}</span>
                <button className="btn btn-secondary"
                  onClick={() => setQuantity(q => Math.min(
                    selectedVariant?.stockQuantity || 99, q + 1
                  ))}>+</button>
              </div>
            </div>

            {/* Total Price */}
            <div style={{ margin: '1rem 0', fontSize: '1.5rem', fontWeight: 700 }}>
              Total: <span style={{ color: 'var(--accent)' }}>
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              className="btn btn-primary btn-full"
              disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
              onClick={handleBuy}
            >
              {!selectedVariant
                ? 'Select a variant to buy'
                : selectedVariant.stockQuantity === 0
                ? 'Out of Stock'
                : `Buy Now — $${totalPrice.toFixed(2)}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
};