import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

// Top navigation bar showing logo, user avatar, and logout button
export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/products" className="navbar-brand">
          <div className="brand-icon-box">
            <Package size={20} />
          </div>
          <span>Product Admin</span>
        </Link>

        {isAuthenticated && (
          <div className="navbar-actions">
            {/* Current user profile info */}
            <div className="user-pill">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.username || 'User'}
                  className="user-avatar"
                />
              ) : (
                <div className="user-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color="#fff" />
                </div>
              )}
              <span style={{ fontWeight: 600 }}>{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username || 'Admin'}</span>
            </div>

            {/* Logout button */}
            <Button
              variant="secondary"
              size="sm"
              icon={LogOut}
              onClick={handleLogout}
              title="Log out"
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
