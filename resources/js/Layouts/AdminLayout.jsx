import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from "react";

export default function AdminLayout({ children }) {
    const user = usePage().props.auth.user;

    const [showMenu, setShowMenu] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false); // 👈 controle da sidebar
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setShowMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!user.admin) return null;

    return (
        <div className="min-h-screen bg-[#fffaf7] font-sans">
            {/* HEADER */}
            <header className="bg-[#8a5a33] text-white px-6 py-3 shadow flex items-center justify-between h-20 relative z-20">
                {/* Botão hamburguer - visível só no mobile */}
                <button
                    className="md:hidden flex items-center"
                    onClick={() => setShowSidebar(true)}
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Logo maior */}
                <Link href="/dashboard" className="flex-shrink-0">
                    <img src="imagens/Logo_Original - Editado.png" alt="Logo ADM" height="80" width="80" />
                </Link>

                {/* Frase centralizada */}
                <div className="flex-1 text-center hidden md:block">
                    <span className="text-lg font-medium italic leading-snug block">
                        A cada novo dia, você tem a chance de fazer diferente e melhor!
                    </span>
                </div>

                {/* Menu de usuário */}
                <div className="relative">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md items-center">
                                <img src="/imagens/icone-sobre.png" alt="Ícone Sobre" className="h-6 w-6" />
                                <button type="button" className="ml-2 text-white flex items-center">
                                    {user.name}
                                    <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </span>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <Dropdown.Link href={route('profile.edit')}>Perfil</Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button">Sair</Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </header>

            {/* LAYOUT GERAL */}
            <div className="flex min-h-screen">
                {/* MENU LATERAL - desktop + responsivo (off-canvas) */}
                <aside
                    className={`
                        fixed z-30 inset-y-0 left-0 transform md:relative md:translate-x-0
                        transition-transform duration-300 ease-in-out
                        w-64 bg-white/60 backdrop-blur-md border-r border-pink-100 p-6 shadow-lg
                        ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
                    `}
                >
                    {/* Botão fechar no mobile */}
                    <div className="md:hidden flex justify-end mb-4">
                        <button onClick={() => setShowSidebar(false)} className="text-pink-600 hover:text-pink-800">
                            ✕
                        </button>
                    </div>

                    <h2 className="text-2xl font-extrabold text-[#613d20] mb-6">Painel</h2>

                    <Link href="/Administracao" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#613d20] hover:bg-[#613d20]-100 transition">
                        <img src="/imagens/Icon_Home.png" alt="Home" className="h-5 w-5" />
                        <span className="font-semibold">Home</span>
                    </Link>


                    <Link href="/Vendas" className="flex items-center gap-3 px-4 py-3 rounded-xl  text-[#613d20] hover:bg-[#613d20]-100 transition">
                        <img src="/imagens/Icon_Vendas.png" alt="Vendas" className="h-5 w-5" />
                        <span className="font-semibold">Vendas</span>
                    </Link>

                    <Link href="/Promocao" className="flex items-center gap-3 px-4 py-3 rounded-xl  text-[#613d20] hover:bg-[#613d20]-100 transition">
                        <img src="/imagens/prom.png" alt="Home" className="h-5 w-5" />
                        <span className="font-semibold">Promoção</span>
                    </Link>

                    <Link href="/Categorias" className="flex items-center gap-3 px-4 py-3 rounded-xl  text-[#613d20] hover:bg-[#613d20]-100 transition">
                        <img src="/imagens/Icon_Categoria.png" alt="Categorias" className="h-5 w-5" />
                        <span className="font-semibold">Categorias</span>
                    </Link>

                    <Link href="/Produtos" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#613d20] hover:bg-[#613d20]-100 transition">
                        <img src="/imagens/Icon_Produtos.png" alt="Produtos" className="h-5 w-5" />
                        <span className="font-semibold">Produtos</span>
                    </Link>
                </aside>

                {/* CONTEÚDO PRINCIPAL */}
                <main className="flex-1 p-6 bg-pink-50">
                    <div className="bg-white rounded-3xl shadow-xl p-8 transition hover:scale-[1.01] duration-200">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
