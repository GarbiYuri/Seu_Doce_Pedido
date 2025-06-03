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
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-xl">
    <h2 className="text-3xl font-extrabold text-pink-600 mb-8">Criar Categoria</h2>

    <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label
                htmlFor="name"
                className="block text-sm font-semibold text-pink-700 mb-2"
            >
                Nome
            </label>
            <input
                type="text"
                id="name"
                className="w-full px-5 py-3 border border-pink-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
        </div>

        <button
            type="submit"
            className="w-full py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition duration-300 shadow-md hover:scale-[1.02]"
        >
            Salvar
        </button>
    </form>
</div>

    );
}
