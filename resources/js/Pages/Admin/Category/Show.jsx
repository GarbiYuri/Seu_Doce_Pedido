import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { FiArrowLeft } from 'react-icons/fi';

export default function CategoryEdit({ category }) {
  const [name, setName] = useState(category.name);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  // Carregar imagem atual ao iniciar
  useEffect(() => {
    if (category.imagem) {
      setPreviewImage(`/imagens/categorias/${category.imagem}`);
    }
  }, [category]);

  // Atualizar imagem selecionada
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    if (imageFile) {
      formData.append('imagem', imageFile);
    }

    router.post(`/categories/${category.id}?_method=PUT`, formData, {
      forceFormData: true,
    });
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

        <form onSubmit={handleSubmit} encType="multipart/form-data">
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

          {/* Imagem */}
          <div>
            <label className="block mb-2 font-medium text-pink-700">
              Imagem da Categoria
            </label>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mb-3 w-32 h-32 object-cover rounded-xl border border-gray-300 shadow-sm"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-600"
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
