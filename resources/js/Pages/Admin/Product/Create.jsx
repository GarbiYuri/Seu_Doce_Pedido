import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function ProductCreate({ categories }) {
  const [name, setName] = useState(''); // Estado para o nome do produto
  const [price, setPrice] = useState(''); // Estado para o preço
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Enviar os dados para o servidor usando o Inertia router
    router.post(route('products.store'), {
      name: name,
      price: price,
      id_categoria: selectedCategoryId,
    });

    setName("");
    setPrice("");
    setSelectedCategoryId("")
    // Limpar o formulário ou mostrar mensagem de sucesso
    console.log("Produto criado com sucesso!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Criar Produto</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          {/* Campo de Nome */}
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          {/* Campo de Preço */}
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Preço</label>
          <input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          />
        </div>

        <div className="mb-4">
          {/* Campo de Seleção de Categoria */}
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
          <select
            id="category"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Botão de Submissão */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300 mt-4"
        >
          Salvar
        </button>
      </form>
    </div>
  );
}
