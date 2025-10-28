import React, { useState } from 'react';

// PUBLIC_INTERFACE
export default function SearchBar({ onSearch, initialValue = '' }) {
  /** Simple search bar that emits query text */
  const [q, setQ] = useState(initialValue);

  const submit = (e) => {
    e.preventDefault();
    onSearch?.(q);
  };

  return (
    <form className="searchbar" onSubmit={submit} role="search">
      <input
        type="text"
        placeholder="Search recipes..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search recipes"
      />
      <button type="submit" className="btn-primary">Search</button>
    </form>
  );
}
