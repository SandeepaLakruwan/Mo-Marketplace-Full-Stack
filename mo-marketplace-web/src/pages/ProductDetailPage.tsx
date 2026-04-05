import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, variantsAPI } from '../api/client';
import { VariantSelector } from '../components/VariantSelector';
import { QuickBuy } from '../components/QuickBuy';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import type { AxiosError } from 'axios';
import type { Product, Variant } from '../types';

interface VariantFormData {
  color: string;
  size: string;
  material: string;
  stockQuantity: string | number;
  priceModifier: string | number;
}

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [showQuickBuy, setShowQuickBuy] = useState(false);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [addError, setAddError] = useState('');

  const { register, handleSubmit, reset } = useForm<VariantFormData>();

  // Wrapped in useCallback to fix the useEffect dependency error
  const fetchProduct = useCallback(async () => {
    if (!id) return;
    try {
      const res = await productsAPI.getOne(id);
      setProduct(res.data);
    } catch {
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddVariant = async (data: VariantFormData) => {
    setAddError('');
    try {
      await variantsAPI.create({
        ...data,
        productId: id!,
        priceModifier: Number(data.priceModifier) || 0,
        stockQuantity: Number(data.stockQuantity)
      });
      reset();
      setShowAddVariant(false);
      fetchProduct();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setAddError(error.response?.data?.message || 'Failed to add variant');
    }
  };

  if (loading) return <div className="spinner" />;
  if (!product) return null;

  const totalPrice = selectedVariant
    ? Number(product.basePrice) + Number(selectedVariant.priceModifier || 0)
    : Number(product.basePrice);

  return (
    <div className="page">
      <div className="container">
        <button className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}
          onClick={() => navigate(-1)}>← Back</button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            {product.imageUrl
              ? <img src={product.imageUrl} alt={product.name}
                style={{ width: '100%', borderRadius: 'var(--radius-lg)' }} />
              : <div className="product-card-placeholder" style={{ height: '400px' }}>👕</div>
            }
          </div>

          <div>
            {product.category && (
              <span className="badge badge-warning" style={{ marginBottom: '0.75rem' }}>
                {product.category}
              </span>
            )}
            <h1 style={{ marginBottom: '0.5rem' }}>{product.name}</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '1.5rem' }}>
              ${totalPrice.toFixed(2)}
              {(selectedVariant?.priceModifier ?? 0) > 0 && (
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                  (base ${product.basePrice} + ${selectedVariant?.priceModifier})
                </span>
              )}
            </div>

            {product.variants && product.variants.length > 0 ? (
              <VariantSelector variants={product.variants} onSelect={setSelectedVariant} />
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No variants available</p>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                className="btn btn-primary"
                disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
                onClick={() => setShowQuickBuy(true)}
                style={{ flex: 1 }}
              >
                {!selectedVariant ? 'Select a variant' : 'Buy Now'}
              </button>
            </div>

            {isAuthenticated && (
              <div style={{ marginTop: '2rem' }}>
                <button className="btn btn-secondary btn-full"
                  onClick={() => setShowAddVariant(v => !v)}>
                  {showAddVariant ? '− Cancel' : '+ Add Variant'}
                </button>
                {showAddVariant && (
                  <form onSubmit={handleSubmit(handleAddVariant)}
                    className="card" style={{ marginTop: '1rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Add New Variant</h3>
                    {addError && <div className="alert alert-error">{addError}</div>}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Color</label>
                        <input className="form-input" placeholder="red"
                          {...register('color', { required: true })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Size</label>
                        <input className="form-input" placeholder="M"
                          {...register('size', { required: true })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Material</label>
                        <input className="form-input" placeholder="cotton"
                          {...register('material', { required: true })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Stock</label>
                        <input className="form-input" type="number" defaultValue={100}
                          {...register('stockQuantity', { required: true })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Price Modifier ($)</label>
                        <input className="form-input" type="number" step="0.01" defaultValue={0}
                          {...register('priceModifier')} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-full">
                      Create Variant
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showQuickBuy && selectedVariant && (
        <QuickBuy product={product} onClose={() => setShowQuickBuy(false)} />
      )}
    </div>
  );
};
