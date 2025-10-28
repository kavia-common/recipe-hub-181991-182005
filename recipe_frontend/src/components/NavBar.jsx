import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/recipes" className="brand">
          <span className="brand-accent">Recipe</span>Hub
        </Link>

        <div className="nav-links">
          <NavLink to="/recipes" className={({ isActive }) => isActive ? 'link active' : 'link'}>Discover</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/my" className={({ isActive }) => isActive ? 'link active' : 'link'}>My Recipes</NavLink>
              <NavLink to="/favorites" className={({ isActive }) => isActive ? 'link active' : 'link'}>Favorites</NavLink>
              <NavLink to="/add" className={({ isActive }) => isActive ? 'link active btn-primary' : 'link btn-primary'}>Add Recipe</NavLink>
            </>
          )}
        </div>

        <div className="nav-auth">
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'link active' : 'link'}>Login</NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'link active' : 'link'}>Register</NavLink>
            </>
          ) : (
            <div className="user-actions">
              <span className="user-name" title={user?.email || ''}>{user?.full_name || user?.email}</span>
              <button className="btn-outline" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
