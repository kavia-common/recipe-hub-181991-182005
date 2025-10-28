import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function RecipeCard({ recipe, onFavoriteToggle }) {
  /** Card view for a recipe list item */
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-header">
          <h3 className="card-title">{recipe.title}</h3>
          <div className="card-actions">
            <button
              className={recipe.is_favorite ? 'icon-btn favorite active' : 'icon-btn favorite'}
              onClick={() => onFavoriteToggle?.(recipe)}
              title={recipe.is_favorite ? 'Unfavorite' : 'Favorite'}
              aria-label={recipe.is_favorite ? 'Unfavorite' : 'Favorite'}
            >
              {recipe.is_favorite ? '★' : '☆'}
            </button>
          </div>
        </div>
        <p className="card-desc">{recipe.description || 'No description.'}</p>
        <div className="card-footer">
          <Link to={`/recipes/${recipe.id}`} className="link">View Details →</Link>
        </div>
      </div>
    </div>
  );
}
