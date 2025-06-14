import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function CategoryEdit({ product, categories, onClose }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setDescription(product.descricao || '');
      setSelectedCategoryId(product.id_categoria);
      setPreviewImage(`/imagem/${product.imagem}`); // URL da imagem atual para preview
      setImageFile(null); // Nenhuma nova imagem selecionada inicialmente
    }
  }, [product]);

  // Preview da imagem quando seleciona nova
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Usar FormData para enviar imagem junto
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('descricao', description);
    formData.append('id_categoria', selectedCategoryId);

    if (imageFile) {
      formData.append('imagem', imageFile);
    }

    router.post(`/products/${product.id}?_method=PUT`, formData, {
      forceFormData: true,
      onSuccess: () => {
        onClose(); // Fecha o modal após salvar
      },
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-pink-600 mb-4 text-center">Editar Produto</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Preço</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Categoria</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full px-4 py-2 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Imagem</label>
          {/* Preview da imagem */}
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mb-2 w-32 h-32 object-cover rounded-md border border-pink-300"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition"
        >
          Salvar
        </button>
      </form>
    </div>
  );
}
