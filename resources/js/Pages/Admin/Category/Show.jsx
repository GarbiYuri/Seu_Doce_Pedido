import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import { FiArrowLeft } from 'react-icons/fi';

export default function CategoryEdit({ category }) {
  const [name, setName] = useState(category.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.put(`/categories/${category.id}`, { name });
  };

  const handleBack = () => {
    router.visit('/Categorias');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Botão de voltar */}
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="flex items-center text-pink-600 hover:text-pink-800 transition"
        >
          <FiArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Voltar</span>
        </button>
      </div>

      {/* Formulário de edição */}
      <div className="bg-white border border-pink-300 rounded-3xl shadow-sm p-6 sm:p-10">
        <h2
          className="text-3xl font-extrabold text-pink-600 mb-6 text-center"
          style={{ fontFamily: "'Candice', cursive" }}
        >
          Editar Categoria
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-pink-700 mb-1"
            >
              Nome
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-pink-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Digite o novo nome da categoria"
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
    </div>
  );
}
