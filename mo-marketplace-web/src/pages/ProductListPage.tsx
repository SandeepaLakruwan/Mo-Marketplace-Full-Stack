import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/client';
import { QuickBuy } from '../components/QuickBuy';
import type { Product } from '../types';

export const ProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [quickBuyProduct, setQuickBuyProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const LIMIT = 12;

  const fetchProducts = async (p: number) => {
    setLoading(true);
    try {
      const res = await productsAPI.getAll(p, LIMIT);
      setProducts(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(page); }, [page]);

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Products</h1>
            <p>{total} products available</p>
          </div>
          <Link to="/products/create" className="btn btn-primary">+ Add Product</Link>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No products yet</h3>
            <p>Add your first product to get started</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="card product-card"
                onClick={() => navigate(`/products/${product.id}`)}>
                {product.imageUrl
                  ? <img src={product.imageUrl} alt={product.name} className="product-card-image" />
                  : <div className="product-card-placeholder">👕</div>
                }
                <h3 style={{ marginBottom: '0.5rem' }}>{product.name}</h3>
                {product.category && (
                  <span className="badge badge-warning" style={{ marginBottom: '0.75rem' }}>
                    {product.category}
                  </span>
                )}
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {product.description?.slice(0, 80)}...
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="product-price">${product.basePrice}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {product.variants?.length || 0} variants
                    </span>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={e => { e.stopPropagation(); setQuickBuyProduct(product); }}
                    >
                      Quick Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > LIMIT && (
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-secondary"
              disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span style={{ padding: '0.6rem 1rem', color: 'var(--text-secondary)' }}>
              Page {page} of {Math.ceil(total / LIMIT)}
            </span>
            <button className="btn btn-secondary"
              disabled={page >= Math.ceil(total / LIMIT)}
              onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>

      {quickBuyProduct && (
        <QuickBuy product={quickBuyProduct} onClose={() => setQuickBuyProduct(null)} />
      )}
    </div>
  );
};