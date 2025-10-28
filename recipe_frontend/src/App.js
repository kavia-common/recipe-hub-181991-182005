import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, Protected } from './context/AuthContext';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import AddEditRecipe from './pages/AddEditRecipe';
import Favorites from './pages/Favorites';
import MyRecipes from './pages/MyRecipes';

// PUBLIC_INTERFACE
function App() {
  /** Root application with theme toggle and all routes configured */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  return (
    <div data-theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <NavBar />
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 20 }}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <Routes>
            <Route path="/" element={<Navigate to="/recipes" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />

            <Route
              path="/add"
              element={
                <Protected fallback={<Navigate to="/login" replace />}>
                  <AddEditRecipe />
                </Protected>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <Protected fallback={<Navigate to="/login" replace />}>
                  <AddEditRecipe />
                </Protected>
              }
            />
            <Route
              path="/favorites"
              element={
                <Protected fallback={<Navigate to="/login" replace />}>
                  <Favorites />
                </Protected>
              }
            />
            <Route
              path="/my"
              element={
                <Protected fallback={<Navigate to="/login" replace />}>
                  <MyRecipes />
                </Protected>
              }
            />
            <Route path="*" element={<div className="container p-4">Not found</div>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
