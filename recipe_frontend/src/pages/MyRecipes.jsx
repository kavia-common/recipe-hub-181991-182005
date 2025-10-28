import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import RecipeCard from '../components/RecipeCard';

// PUBLIC_INTERFACE
export default function MyRecipes() {
  /** Lists current user's recipes */
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get(ENDPOINTS.USERS.MY_RECIPES);
      setRecipes(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page container">
      <div className="page-header">
        <h1 className="title">My Recipes</h1>
        <p className="subtitle">Manage the recipes you created</p>
      </div>
      {loading ? (
        <div className="center p-4"><div className="spinner" /></div>
      ) : (
        <div className="grid">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} onFavoriteToggle={() => {}} />
          ))}
          {recipes.length === 0 && <div className="muted">You have not created any recipes yet.</div>}
        </div>
      )}
    </div>
  );
}
