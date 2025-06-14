import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useState } from 'react';

export default function DashboardAdmin() {
  const { auth, usuarios } = usePage().props;
  const user = auth.user;

  const [search, setSearch] = useState('');

  // Função para alternar o status de Admin
  const toggleAdmin = (id) => {
    router.post(`/admin/toggle/${id}`);
  };

  // Filtra os usuários da página atual baseado no input de pesquisa
  const filteredUsers = usuarios.data.filter((usuario) => {
    const termo = search.toLowerCase();
    return (
      usuario.name.toLowerCase().includes(termo) ||
      usuario.email.toLowerCase().includes(termo)
    );
  });

  return (
    <AdminLayout>
      <Head title="Administração" />

      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center text-pink-600 mb-6">
          Lista de Usuários
        </h1>

        {/* Barra de pesquisa */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Pesquisar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-auto">
            <thead className="bg-pink-600 text-white hidden md:table-header-group">
              <tr>
                <th className="py-3 px-6 text-left">Nome</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-center">Admin</th>
                <th className="py-3 px-6 text-center">Ações</th>
              </tr>
            </thead>

            <tbody className="block md:table-row-group">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className="block md:table-row border-b border-pink-100 mb-6 md:mb-0 p-4 md:p-0 rounded-lg bg-pink-50 md:bg-transparent"
                  >
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 break-words">
                      <span className="font-semibold md:hidden text-pink-600">Nome: </span>
                      {usuario.name}
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 break-words max-w-xs truncate">
                      <span className="font-semibold md:hidden text-pink-600">Email: </span>
                      {usuario.email}
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 text-center">
                      <span className="font-semibold md:hidden text-pink-600">Admin: </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold 
                          ${
                            usuario.admin
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {usuario.admin ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 text-center">
                      {usuario.id !== 1 ? (
                        <button
                          onClick={() => toggleAdmin(usuario.id)}
                          className={`w-full md:w-auto px-5 py-2 rounded-full text-sm font-semibold transition-colors 
                          ${
                            usuario.admin
                              ? 'bg-red-500 hover:bg-red-600'
                              : 'bg-green-500 hover:bg-green-600'
                          } text-white`}
                        >
                          {usuario.admin ? 'Remover Admin' : 'Tornar Admin'}
                        </button>
                      ) : (
                        <span className="text-gray-400 italic text-sm md:text-base">
                          Impossível Alterar
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="block md:table-row p-4">
                  <td colSpan={4} className="text-center text-gray-500 py-6">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="flex justify-center mt-8 gap-4">
          {usuarios.prev_page_url && (
            <a
              href={usuarios.prev_page_url}
              className="flex items-center gap-2 px-5 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 text-sm font-medium"
            >
              <FiArrowLeft size={18} />
              Anterior
            </a>
          )}
          {usuarios.next_page_url && (
            <a
              href={usuarios.next_page_url}
              className="flex items-center gap-2 px-5 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 text-sm font-medium"
            >
              Próximo
              <FiArrowRight size={18} />
            </a>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
