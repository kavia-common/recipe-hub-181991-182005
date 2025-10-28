import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function RecipeDetail() {
  /** Recipe detail with ingredients, instructions, and owner actions */
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await client.get(ENDPOINTS.RECIPES.BY_ID(id));
      setRecipe(data);
    } catch (error) {
      setErr(error?.response?.data?.detail || 'Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleFavorite = async () => {
    if (!isAuthenticated || !recipe) return;
    try {
      if (recipe.is_favorite) {
        await client.delete(ENDPOINTS.FAVORITES.TOGGLE(recipe.id));
      } else {
        await client.post(ENDPOINTS.FAVORITES.TOGGLE(recipe.id));
      }
      setRecipe((r) => ({ ...r, is_favorite: !r.is_favorite }));
    } catch {}
  };

  const canEdit = isAuthenticated && recipe && user && recipe.owner_id === user.id;

  const onDelete = async () => {
    if (!canEdit) return;
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await client.delete(ENDPOINTS.RECIPES.BY_ID(recipe.id));
      navigate('/recipes');
    } catch {
      // ignore
    }
  };

  if (loading) return <div className="center p-4"><div className="spinner" /></div>;
  if (err) return <div className="container"><div className="alert error mt-2">{err}</div></div>;
  if (!recipe) return null;

  return (
    <div className="page container">
      <div className="page-header between">
        <div>
          <h1 className="title">{recipe.title}</h1>
          {recipe.description && <p className="subtitle">{recipe.description}</p>}
        </div>
        <div className="actions">
          <button
            className={recipe.is_favorite ? 'btn-outline active' : 'btn-outline'}
            onClick={toggleFavorite}
          >
            {recipe.is_favorite ? '★ Favorited' : '☆ Favorite'}
          </button>
          {canEdit && (
            <>
              <Link className="btn-primary" to={`/edit/${recipe.id}`}>Edit</Link>
              <button className="btn-danger" onClick={onDelete}>Delete</button>
            </>
          )}
        </div>
      </div>

      <section className="section">
        <h2 className="section-title">Ingredients</h2>
        <ul className="list">
          {(recipe.ingredients || []).map((ri) => (
            <li key={ri.id}>
              <span className="badge">{ri.ingredient?.name}</span>
              {ri.quantity ? ` — ${ri.quantity}` : ''} {ri.unit || ''}
            </li>
          ))}
          {(!recipe.ingredients || recipe.ingredients.length === 0) && <li className="muted">No ingredients listed.</li>}
        </ul>
      </section>

      <section className="section">
        <h2 className="section-title">Instructions</h2>
        <div className="prose">
          {recipe.instructions || <span className="muted">No instructions provided.</span>}
        </div>
      </section>

      {recipe.tags?.length > 0 && (
        <section className="section">
          <h2 className="section-title">Tags</h2>
          <div className="chips">
            {recipe.tags.map((t) => (
              <span key={t.id} className="chip">{t.tag?.name}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
