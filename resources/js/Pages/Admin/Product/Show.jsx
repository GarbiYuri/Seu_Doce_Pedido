import { React, useState, useEffect } from 'react';
import { router, Head } from '@inertiajs/react';

export default function CategoryEdit({ product, categories }) {
  const [name, setName] = useState(''); // Estado para o nome do produto
  const [price, setPrice] = useState(''); // Estado para o preço
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); // Estado para a categoria selecionada

  // Definir os valores iniciais quando o componente for montado
  useEffect(() => {
    setName(product.name);
    setPrice(product.price);
    setSelectedCategoryId(product.id_categoria);
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Enviar os dados para o servidor com a nova categoria
    router.put(`/products/${product.id}`, { name, price, id_categoria: selectedCategoryId });

    // Limpar os campos após o envio
    setName('');
    setPrice('');
    setSelectedCategoryId('');
  };

 return (
  <div className="bg-pink-100 min-h-screen flex items-center justify-center">
    <div className="max-w-2xl mx-auto p-2 bg-white shadow-xl rounded-lg border border-pink-300">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Editar Produto</h2>

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
            {/* Mapeando as categorias para opções */}
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
  </div>
);

}
