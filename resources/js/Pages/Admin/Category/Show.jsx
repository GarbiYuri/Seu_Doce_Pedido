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
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Editar Categoria</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300 mt-4"
          >
            Salvar
          </button>
        </form>
      </div>
    
    );
  }