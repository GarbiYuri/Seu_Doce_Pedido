import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function ProductCreate({ categories }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null); // Agora armazena o arquivo
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const handleImageChange = (e) => {
    setImagem(e.target.files[0]); // Armazena o arquivo selecionado
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('id_categoria', selectedCategoryId);
    formData.append('descricao', descricao);
    if (imagem) {
      formData.append('imagem', imagem); // Adiciona a imagem ao FormData
    }

    // Enviar os dados para o servidor usando Inertia
    router.post(route('products.store'), formData, {
      forceFormData: true, // Importante para o Inertia entender que é um FormData
    });

    setName('');
    setPrice('');
    setDescricao('');
    setImagem(null);
    setSelectedCategoryId('');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Criar Produto</h2>
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
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
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
          <input
            type="text"
            id="descricao"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
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

        <div className="mb-4">
          <label htmlFor="imagem" className="block text-sm font-medium text-gray-700 mb-2">Imagem</label>
          <input 
            type="file" 
            name="imagem" 
            id="imagem"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            accept="image/*"
          />
        </div>

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
