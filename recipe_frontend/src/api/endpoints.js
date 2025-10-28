/**
 * Centralized API endpoint paths for the Recipe Hub frontend.
 * These map to backend REST routes.
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/users/me',
  },
  USERS: {
    ME: '/users/me',
    MY_RECIPES: '/users/me/recipes',
    MY_FAVORITES: '/users/me/favorites',
  },
  RECIPES: {
    ROOT: '/recipes',
    BY_ID: (id) => `/recipes/${id}`,
  },
  FAVORITES: {
    TOGGLE: (recipeId) => `/favorites/${recipeId}`,
  },
};
