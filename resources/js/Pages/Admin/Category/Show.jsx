import {React, useState, useEffect} from 'react';
import { router, Head } from '@inertiajs/react';

export default function CategoryEdit({ category }) {
    const [name, setName] = useState(category.name);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      router.put(`/categories/${category.id}`, { name });
      setName('');
    };
    
return (
  <div className="max-w-4xl mx-auto p-8 bg-white border border-pink-300 rounded-3xl shadow-sm">
    <h2
      className="text-3xl font-extrabold text-pink-600 mb-6 text-center"
      style={{ fontFamily: "'Candice', cursive" }}
    >
      Editar Categoria
    </h2>

    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-semibold text-pink-700 mb-1">
          Nome
        </label>
        <input
          type="text"
          id="name"
          className="w-full px-3 py-2 border border-pink-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition hover:scale-105 shadow-md mt-4"
      >
        Salvar
      </button>
    </form>
  </div>
);

  }