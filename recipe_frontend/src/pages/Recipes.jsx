import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function Recipes() {
  /** Public recipe discovery page with search */
  const { isAuthenticated } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [err, setErr] = useState('');

  const fetchRecipes = async (query = '') => {
    setLoading(true);
    setErr('');
    try {
      const params = {};
      if (query) params.q = query;
      const { data } = await client.get(ENDPOINTS.RECIPES.ROOT, { params });
      setRecipes(data || []);
    } catch (error) {
      setErr(error?.response?.data?.detail || 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const onSearch = (query) => {
    setQ(query);
    fetchRecipes(query);
  };

  const toggleFavorite = async (recipe) => {
    if (!isAuthenticated) return;
    const id = recipe.id;
    try {
      if (recipe.is_favorite) {
        await client.delete(ENDPOINTS.FAVORITES.TOGGLE(id));
      } else {
        await client.post(ENDPOINTS.FAVORITES.TOGGLE(id));
      }
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_favorite: !r.is_favorite } : r))
      );
    } catch {
      // ignore errors for now
    }
  };

  return (
    <div className="page container">
      <div className="page-header">
        <h1 className="title">Discover Recipes</h1>
        <p className="subtitle">Browse and search community recipes</p>
      </div>
      <SearchBar onSearch={onSearch} initialValue={q} />
      {err && <div className="alert error mt-2">{err}</div>}
      {loading ? (
        <div className="center p-4"><div className="spinner" /></div>
      ) : (
        <div className="grid">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} onFavoriteToggle={toggleFavorite} />
          ))}
          {recipes.length === 0 && <div className="muted">No recipes found.</div>}
        </div>
      )}
    </div>
  );
}
