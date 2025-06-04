import React, { useState } from 'react';
import { router } from '@inertiajs/react';
export default function CategoryCreate() {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/categories', { name });
        setName('');
    };


   return (
  <>
    <style>
      {`
        @import url('https://fonts.googleapis.com/css2?family=Candice&display=swap');
      `}
    </style>

    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-8 bg-white border border-pink-300 rounded-3xl shadow-sm space-y-4"
    >
      <h2
        className="text-3xl font-extrabold text-pink-600 mb-6 text-center"
        style={{ fontFamily: "'Candice', cursive" }}
      >
        Criar Categoria
      </h2>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-pink-700 mb-1"
        >
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
        className="w-full py-2 bg-pink-600 text-white text-base font-bold rounded-xl hover:bg-pink-700 transition hover:scale-105 shadow-md"
      >
        Salvar
      </button>

      <div className="mt-8">{/* Visualização dos produtos */}</div>
    </form>
  </>
);


}
