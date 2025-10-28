import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

// PUBLIC_INTERFACE
export default function AddEditRecipe() {
  /** Add or edit recipe owned by current user */
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    instructions: '',
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      try {
        const { data } = await client.get(ENDPOINTS.RECIPES.BY_ID(id));
        setForm({
          title: data.title || '',
          description: data.description || '',
          instructions: data.instructions || '',
        });
      } catch (error) {
        setErr(error?.response?.data?.detail || 'Failed to load recipe');
      }
    };
    load();
  }, [id, isEdit]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      if (isEdit) {
        const { data } = await client.patch(ENDPOINTS.RECIPES.BY_ID(id), {
          title: form.title || null,
          description: form.description || null,
          instructions: form.instructions || null,
        });
        navigate(`/recipes/${data.id}`);
      } else {
        const { data } = await client.post(ENDPOINTS.RECIPES.ROOT, {
          title: form.title,
          description: form.description || null,
          instructions: form.instructions || null,
          tags: [],
          ingredients: [],
        });
        navigate(`/recipes/${data.id}`);
      }
    } catch (error) {
      setErr(error?.response?.data?.detail || 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container">
      <div className="page-header">
        <h1 className="title">{isEdit ? 'Edit Recipe' : 'Add Recipe'}</h1>
        <p className="subtitle">{isEdit ? 'Update your recipe details' : 'Share your recipe with others'}</p>
      </div>

      {err && <div className="alert error mt-2">{err}</div>}

      <form className="form" onSubmit={onSubmit}>
        <label>
          Title
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            required
          />
        </label>
        <label>
          Description
          <textarea
            value={form.description}
            rows={3}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
          />
        </label>
        <label>
          Instructions
          <textarea
            value={form.instructions}
            rows={8}
            onChange={(e) => setForm((s) => ({ ...s, instructions: e.target.value }))}
          />
        </label>

        <div className="actions">
          <button className="btn-primary btn-large" type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
