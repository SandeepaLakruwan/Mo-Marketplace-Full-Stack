import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">🛒 MO Market</Link>
        <div className="navbar-links">
          <Link to="/">Products</Link>
          {isAuthenticated ? (
            <>
              <Link to="/products/create">+ Add Product</Link>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {user?.email}
              </span>
              <button className="btn btn-secondary" onClick={handleLogout}
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.875rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary"
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.875rem', color: 'white' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};