# Frontend Environment and CORS

The frontend reads the API base URL from the environment:

- Variable: `REACT_APP_API_URL`
- Default (when not set): `http://localhost:3001`
- See `.env.example` for a template. Create a `.env` file to override locally.

Axios client is configured in `src/api/client.js` to use:
- `baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001'`
- `Authorization: Bearer <token>` header is attached when a token is present in localStorage.

CORS Requirements (backend)
- The backend must allow these origins at minimum:
  - http://localhost:3000 (local dev)
  - The preview origin hosting this frontend (e.g., https://vscode-internal-12832-beta.beta01.cloud.kavia.ai:3000)
- It should also allow the corresponding HTTPS preview of the backend if used.

Quick E2E smoke test (expected to pass if backend is running and CORS configured):
1) Register: POST /auth/register
2) Login: POST /auth/login (x-www-form-urlencoded: username, password)
3) Create recipe: POST /recipes
4) List recipes and search: GET /recipes?q=...
5) Favorite/unfavorite: POST/DELETE /favorites/{recipe_id}
6) My Recipes/Favorites: GET /users/me/recipes and /users/me/favorites

If you see CORS errors in the browser console, update backend CORS settings to include the frontend origin.
