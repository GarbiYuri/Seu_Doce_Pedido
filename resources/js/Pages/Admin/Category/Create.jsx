import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { FiFolderPlus, FiFolder, FiEye, FiTrash2 } from 'react-icons/fi'; // Ícones

export default function CategoryCreate() {
    const [name, setName] = useState('');
    const { categories } = usePage().props;

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/categories', { name });
        setName('');
    };

    const handleDelete = (id) => {
        if (confirm('Tem certeza que deseja excluir esta categoria?')) {
            router.delete(`/categories/${id}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Formulário */}
            <form
                onSubmit={handleSubmit}
                className="bg-white border border-pink-200 rounded-3xl shadow-lg p-6 sm:p-10 space-y-6"
            >
                <div className="flex items-center gap-3 justify-center">
                    <FiFolderPlus className="text-pink-600 w-8 h-8" />
                    <h2
                        className="text-3xl font-extrabold text-pink-600 text-center"
                        style={{ fontFamily: "'Candice', cursive" }}
                    >
                        Criar Categoria
                    </h2>
                </div>

                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-pink-700 mb-1"
                    >
                        Nome da categoria
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border border-pink-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Digite o nome da nova categoria"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 bg-pink-600 text-white text-base font-bold rounded-xl hover:bg-pink-700 transition hover:scale-105 shadow-md"
                >
                    Salvar Categoria
                </button>
            </form>

            {/* Grid de Categorias */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories?.map((category) => (
                    <div
                        key={category.id}
                        className="flex items-center justify-between bg-white border border-pink-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center gap-3">
                            <FiFolder className="text-pink-500 w-6 h-6" />
                            <span className="text-sm font-semibold text-pink-700">{category.name}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => router.get(`/categories/${category.id}`)}
                                className="text-pink-500 hover:text-pink-700 transition"
                                title="Ver"
                            >
                                <FiEye className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(category.id)}
                                className="text-red-500 hover:text-red-700 transition"
                                title="Excluir"
                            >
                                <FiTrash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
