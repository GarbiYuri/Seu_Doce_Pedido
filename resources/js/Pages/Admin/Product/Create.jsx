import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function ProductCreate({ categories }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const handleImageChange = (e) => {
    setImagem(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('id_categoria', selectedCategoryId);
    formData.append('descricao', descricao);
    if (imagem) {
      formData.append('imagem', imagem);
    }

    router.post(route('products.store'), formData, {
      forceFormData: true,
    });

    setName('');
    setPrice('');
    setDescricao('');
    setImagem(null);
    setSelectedCategoryId('');
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
      encType="multipart/form-data"
      className="max-w-4xl mx-auto space-y-4 mb-8 bg-white border border-pink-300 rounded-3xl p-8 shadow-sm"
    >
      <h2
        className="text-3xl font-extrabold text-pink-600 mb-6 text-center"
        style={{ fontFamily: "'Candice', cursive" }}
      >
        Criar Produto
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

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-semibold text-pink-700 mb-1"
        >
          Preço
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-3 py-2 border border-pink-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="descricao"
          className="block text-sm font-semibold text-pink-700 mb-1"
        >
          Descrição
        </label>
        <input
          type="text"
          id="descricao"
          className="w-full px-3 py-2 border border-pink-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition text-sm"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-semibold text-pink-700 mb-1"
        >
          Categoria
        </label>
        <select
          id="category"
          className="w-full px-3 py-2 border border-pink-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition text-sm"
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

      <div>
        <label
          htmlFor="imagem"
          className="block text-sm font-semibold text-pink-700 mb-1"
        >
          Imagem
        </label>
        <input
          type="file"
          name="imagem"
          id="imagem"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-pink-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition bg-white text-sm"
          accept="image/*"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-pink-600 text-white text-base font-bold rounded-xl hover:bg-pink-700 transition hover:scale-105 shadow-md"
      >
        Salvar
      </button>

      {/* Espaço entre o formulário e visualização dos produtos */}
      <div className="mt-8">{/* Visualização dos produtos */}</div>
    </form>
  </>
);
}

