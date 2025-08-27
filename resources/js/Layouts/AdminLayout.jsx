import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from "react";

export default function AdminLayout({ children }) {
    const user = usePage().props.auth.user;

    const [showMenu, setShowMenu] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
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
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user.admin) return null;

    return (
        <div className="min-h-screen bg-[#fffaf7] font-sans overflow-x-hidden">
            {/* HEADER */}
            <header className="bg-[#8a5a33] text-white px-4 sm:px-6 py-3 shadow flex items-center justify-between h-20 relative z-20">
                {/* Botão hamburguer - visível só no mobile */}
                <button
                    className="md:hidden flex items-center"
                    onClick={() => setShowSidebar(true)}
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Logo */}
                <Link href="/dashboard" className="flex-shrink-0">
                    <img src="imagens/Logo_Original - Editado.png" alt="Logo ADM" className="w-16 h-16 sm:w-20 sm:h-20" />
                </Link>

                {/* Frase centralizada - apenas desktop */}
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
                {/* SIDEBAR */}
                <aside
                    className={`
                        fixed z-30 inset-y-0 left-0 transform md:relative md:translate-x-0
                        transition-transform duration-300 ease-in-out
                        w-64 max-w-full bg-[##fffaf7] backdrop-blur-md border-r  p-4 sm:p-6 shadow-lg
                        ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
                    `}
                >
                    {/* Botão fechar mobile */}
                    <div className="md:hidden flex justify-end mb-4">
                        <button onClick={() => setShowSidebar(false)} className="text-[#613d20] hover:text-[#613d20] text-2xl font-bold">
                            ✕
                        </button>
                    </div>

                    <h2 className="text-2xl font-extrabold text-[#613d20] mb-6 ml-4">Painel</h2>

                    <Link href="/Administracao" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#613d20] hover:bg-[rgba(188,132,91,0.3)] transition">
                        <img src="/imagens/Icon_Home.png" alt="Home" className="h-5 w-5" />
                        <span className="font-semibold">Home</span>
                    </Link>

                    <Link href="/Vendas" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#613d20] hover:bg-[rgba(188,132,91,0.3)] transition">
                        <img src="/imagens/Icon_Vendas.png" alt="Vendas" className="h-5 w-5" />
                        <span className="font-semibold">Vendas</span>
                    </Link>

                    <Link
                        href="/Promocao"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#613d20] hover:bg-[rgba(188,132,91,0.3)] transition"
                    >
                        <img src="/imagens/prom.png" alt="Promoção" className="h-5 w-5" />
                        <span className="font-semibold">Promoção</span>
                    </Link>


                    <Link href="/Categorias" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#613d20] hover:bg-[rgba(188,132,91,0.3)] transition">
                        <img src="/imagens/Icon_Categoria.png" alt="Categorias" className="h-5 w-5" />
                        <span className="font-semibold">Categorias</span>
                    </Link>

                    <Link href="/Produtos" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#613d20] hover:bg-[rgba(188,132,91,0.3)] transition">
                        <img src="/imagens/Icon_Produtos.png" alt="Produtos" className="h-5 w-5" />
                        <span className="font-semibold">Produtos</span>
                    </Link>
                </aside>

                {/* CONTEÚDO PRINCIPAL */}
                <main className="flex-1 p-4 sm:p-6 bg-[#bc845b] min-h-screen">
                    <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-8 transition duration-200">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
