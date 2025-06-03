import React, { useEffect, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';

export default function ProductIndex({ products, categories }) {
    const { delete: deleteProduct } = useForm();
    

    const handleDelete = (id) => {
        if (confirm('Você tem certeza que deseja excluir este produto?')) {
            deleteProduct(route('products.destroy', id));
        }
    };

    return (
  <>
    <style>
      {`
        @import url('https://fonts.googleapis.com/css2?family=Candice&display=swap');
      `}
    </style>

    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg border border-pink-300">
      <h2
        className="text-3xl font-extrabold text-pink-600 mb-6 text-center"
        style={{ fontFamily: "'Candice', cursive" }}
      >
        Produtos
      </h2>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-pink-300">
        <thead className="bg-pink-600 text-white">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Nome</th>
            <th className="px-6 py-4 text-center text-sm font-semibold">Preço</th>
            <th className="px-6 py-4 text-center text-sm font-semibold">Categoria</th>
            <th className="px-6 py-4 text-center text-sm font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-100 transition duration-300">
              <td className="px-6 py-6 text-sm">{product.id}</td>
              <td className="px-6 py-6 text-sm">{product.name}</td>
              <td className="px-6 py-6 text-sm">{product.price}</td>
              <td className="px-6 py-6 text-sm">{categories.find(category => category.id === product.id_categoria)?.name || 'Categoria não encontrada'}</td>

              <td className="px-6 py-4 text-center">
                <Link
                  href={`/products/${product.id}`}
                  className="btn btn-info btn-sm me-2 bg-pink-600 text-white py-1 px-3 rounded-md hover:bg-pink-700 transition duration-300"
                >
                  Ver
                </Link>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="btn btn-danger btn-sm bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);
}
