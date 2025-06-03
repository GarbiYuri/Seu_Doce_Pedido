import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, router } from '@inertiajs/react';

export default function DashboardAdmin() {
    const { auth, usuarios } = usePage().props; // Pegando os usuários do middleware
    const user = usePage().props.auth.user;
    // Função para alternar o status de Admin
    const toggleAdmin = (id) => {
        router.post(`/admin/toggle/${id}`);
    };
    return (
        <AdminLayout

        >
            <Head title="Administração" />

          <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl">
    <h1 className="text-3xl font-extrabold text-center text-pink-600 mb-8">
        Lista de Usuários
    </h1>
    <div className="overflow-x-auto">
        <table className="w-full table-auto">
            <thead className="bg-pink-600 text-white">
                <tr>
                    <th className="py-4 px-6 text-left">Nome</th>
                    <th className="py-4 px-6 text-left">Email</th>
                    <th className="py-4 px-6 text-center">Admin</th>
                    <th className="py-4 px-6 text-center">Ações</th>
                </tr>
            </thead>
            <tbody>
                {usuarios.data.map((usuario) => (
                    <tr
                        key={usuario.id}
                        className="border-b border-pink-100 hover:bg-pink-50 transition-colors"
                    >
                        <td className="py-4 px-6 text-gray-700 font-medium">
                            {usuario.name}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                            {usuario.email}
                        </td>
                        <td className="py-4 px-6 text-center">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold 
                                ${usuario.admin
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {usuario.admin ? "Sim" : "Não"}
                            </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                            {usuario.id !== 1 ? (
                                <button
                                    onClick={() => toggleAdmin(usuario.id)}
                                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors 
                                        ${usuario.admin
                                            ? "bg-red-500 hover:bg-red-600"
                                            : "bg-green-500 hover:bg-green-600"
                                        } text-white`}
                                >
                                    {usuario.admin ? "Remover Admin" : "Tornar Admin"}
                                </button>
                            ) : (
                                <span className="text-gray-400 italic">
                                    Impossível Alterar
                                </span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>

    {/* Paginação */}
    <div className="flex justify-center mt-8 gap-4">
        {usuarios.prev_page_url && (
            <a
                href={usuarios.prev_page_url}
                className="px-5 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 text-sm font-medium"
            >
                Anterior
            </a>
        )}
        {usuarios.next_page_url && (
            <a
                href={usuarios.next_page_url}
                className="px-5 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 text-sm font-medium"
            >
                Próximo
            </a>
        )}
    </div>
</div>

        </AdminLayout>
    );
}