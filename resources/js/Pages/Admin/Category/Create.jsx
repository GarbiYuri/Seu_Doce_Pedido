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
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Criar Categoria</h2>
        
        <form onSubmit={handleSubmit}>
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
