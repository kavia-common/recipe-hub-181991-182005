import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import RecipeCard from '../components/RecipeCard';

// PUBLIC_INTERFACE
export default function Favorites() {
  /** Lists current user's favorite recipes */
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get(ENDPOINTS.USERS.MY_FAVORITES);
      setRecipes(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (recipe) => {
    try {
      await client.delete(ENDPOINTS.FAVORITES.TOGGLE(recipe.id));
      setRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
    } catch {}
  };

  return (
    <div className="page container">
      <div className="page-header">
        <h1 className="title">Favorites</h1>
        <p className="subtitle">Recipes you have starred</p>
      </div>
      {loading ? (
        <div className="center p-4"><div className="spinner" /></div>
      ) : (
        <div className="grid">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={{ ...r, is_favorite: true }} onFavoriteToggle={handleToggle} />
          ))}
          {recipes.length === 0 && <div className="muted">No favorites yet.</div>}
        </div>
      )}
    </div>
  );
}
