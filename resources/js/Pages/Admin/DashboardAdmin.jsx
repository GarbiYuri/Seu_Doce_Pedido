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

            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Lista de Usuários
                </h1>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 shadow-sm rounded-lg">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-3 px-6 text-left">Nome</th>
                                <th className="py-3 px-6 text-left">Email</th>
                                <th className="py-3 px-6 text-left">Admin</th>
                                <th className="py-3 px-6 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.data.map((usuario) => (
                                <tr
                                    key={usuario.id}
                                    className="border-b border-gray-200 hover:bg-gray-100 transition"
                                >
                                    <td className="py-3 px-6">{usuario.name}</td>
                                    <td className="py-3 px-6">{usuario.email}</td>
                                    <td className="py-3 px-6">
                                        <span
                                            className={`px-3 py-1 rounded-lg text-white font-semibold text-sm 
                                    ${usuario.admin ? "bg-green-500" : "bg-red-500"}`}
                                        >
                                            {usuario.admin ? "Sim" : "Não"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        {usuario.id !== 1 ? (
                                            <button
                                                onClick={() => toggleAdmin(usuario.id)}
                                                className={`px-4 py-2 text-sm font-bold rounded-lg transition 
                                        ${usuario.admin ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                                        text-white`}
                                            >
                                                {usuario.admin ? "Remover Admin" : "Tornar Admin"}
                                            </button>
                                        ) : (
                                            <span className="text-gray-500 font-semibold">
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
                <div className="flex justify-center mt-6">
                    <div className="flex items-center space-x-4">
                        {/* Anterior */}
                        {usuarios.prev_page_url && (
                            <a
                                href={usuarios.prev_page_url}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Anterior
                            </a>
                        )}

                        {/* Próximo */}
                        {usuarios.next_page_url && (
                            <a
                                href={usuarios.next_page_url}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Próximo
                            </a>
                        )}
                    </div>
                </div>
            </div>




        </AdminLayout>
    );
}