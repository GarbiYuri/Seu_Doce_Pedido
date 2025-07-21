import React from 'react';
import { router } from '@inertiajs/react';
import { FiEye, FiTrash2, FiEdit } from 'react-icons/fi';

export default function PromocaoIndex({ promocoes }) {
  const handleDelete = (id) => {
    if (confirm('Deseja realmente excluir essa promoção?')) {
      router.delete(`/promocoes/${id}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold text-pink-600 mb-6 text-center" style={{ fontFamily: "'Candice', cursive" }}>
        Promoções Atuais
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promocoes.map((promo) => (
          <div
            key={promo.id}
            className="bg-white border border-pink-200 rounded-3xl shadow-md p-5 flex flex-col justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-pink-700">
                Produto: {promo.product ? promo.product.name : 'Sem produto'}
              </p>
              <p className="text-sm text-gray-600 mb-2">{promo.descricao || '-'}</p>
              <p className="text-lg font-bold text-pink-600">R$ {Number(promo.price).toFixed(2).replace('.', ',')}</p>
              <p className="text-sm text-gray-600">Qtd: {promo.quantidade ?? '-'}</p>
              <p className="text-sm text-gray-600">Estoque: {promo.estoque ?? '-'}</p>
            </div>

            {promo.imagem && (
              <img
                src={`/storage/${promo.imagem}`}
                alt="Imagem da promoção"
                className="mt-4 rounded-xl w-full h-40 object-cover"
              />
            )}

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => router.get(`/promocoes/${promo.id}/edit`)}
                className="text-pink-600 hover:text-pink-800 transition"
                title="Editar"
              >
                <FiEdit size={22} />
              </button>
              <button
                onClick={() => handleDelete(promo.id)}
                className="text-red-600 hover:text-red-800 transition"
                title="Excluir"
              >
                <FiTrash2 size={22} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
