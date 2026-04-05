import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/client';
import { useState } from 'react';
import type { AxiosError } from 'axios';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  basePrice: z.number().positive('Price must be positive'),
  category: z.string().optional(),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});
type ProductForm = z.infer<typeof schema>;

export const CreateProductPage = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ProductForm) => {
    setApiError('');
    try {
      const res = await productsAPI.create({ ...data, basePrice: Number(data.basePrice) });
      navigate(`/products/${res.data.id}`);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setApiError(error.response?.data?.message || 'Failed to create product');
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '640px' }}>
        <div className="page-header">
          <h1>Create Product</h1>
          <p>Add a new product to the marketplace</p>
        </div>
        <div className="card">
          {apiError && <div className="alert alert-error">{apiError}</div>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input className="form-input" placeholder="Classic T-Shirt"
                {...register('name')} />
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} placeholder="Product description..."
                {...register('description')} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Base Price ($) *</label>
                <input className="form-input" type="number" step="0.01" placeholder="29.99"
                  {...register('basePrice', { valueAsNumber: true })} />
                {errors.basePrice && <span className="form-error">{errors.basePrice.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input className="form-input" placeholder="Clothing"
                  {...register('category')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input className="form-input" placeholder="https://example.com/image.jpg"
                {...register('imageUrl')} />
              {errors.imageUrl && <span className="form-error">{errors.imageUrl.message}</span>}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ flex: 1 }}>
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};