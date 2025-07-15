import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
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

    const pinkColor = '#EF3167';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Faixa superior */}
            <div className="bg-pink-600 text-white text-center text-xs py-1 font-bold" style={{ letterSpacing: '0.05em' }}>
                <strong style={{ fontWeight: '700', color: 'white' }}>
                    Sua felicidade começa com um doce &{' '}
                </strong>
                cuidamos de cada detalhe pra ela durar muito mais!
            </div>

            {/* Header */}
            <header className="bg-white shadow-md relative">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between py-5">
                    {/* Logo e nome */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link href="/dashboard">
                            <img
                                src="/imagens/Logo_GabyAtualizada.png"
                                alt="Logo"
                                width="80"
                                height="80"
                                className="object-contain"
                            />
                        </Link>
                        ) : (
                            <Link href="/">
                            <img
                                src="/imagens/Logo_GabyAtualizada.png"
                                alt="Logo"
                                width="80"
                                height="80"
                                className="object-contain"
                            />
                        </Link>
                        )}
                        
                        <link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet" />
                        <h1 style={{ fontFamily: "'Lobster', cursive" }} className="text-3xl text-pink-600 select-none">
                            Gaby Guslafer
                        </h1>
                    </div>

                    {/* Navegação - visível em telas grandes */}
                    <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-gray-700">
                        {user ? (
                            <>
                            {user.admin === 1 && (
                            <Link href="/Administracao" className="hover:text-pink-600 transition-colors duration-300">
                                ADMINISTRAÇÃO
                            </Link>
                            )}
                        <Link href="/dashboard" className="hover:text-pink-600 transition-colors duration-300">
                            CATÁLOGO
                        </Link>
                        <Link href="/CarrinhoDeCompra" className="hover:text-pink-600 transition-colors duration-300">
                            CARRINHO
                        </Link>   
                           <Link href="/MeusPedidos" className="hover:text-pink-600 transition-colors duration-300">
                            MEUS PEDIDOS
                        </Link> 
                            </>
                        ): (
                            <>
                            <Link href="/" className="hover:text-pink-600 transition-colors duration-300">
                            CATÁLOGO
                        </Link>
                         <Link href="/CarrinhoWL" className="hover:text-pink-600 transition-colors duration-300">
                            CARRINHO
                        </Link>
                        </>
                        )}
                       
                        <Link href="/contato" className="hover:text-pink-600 transition-colors duration-300">
                            SOBRE
                        </Link>
                        {user ? (
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors duration-300 shadow-md"
                            >
                                {user.name}
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors duration-300 shadow-md"
                            >
                                LOGIN
                            </Link>
                        )}
                         
                    </nav>

                    {/* Botão hamburguer - visível em telas pequenas */}
                    <button
                        onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                        className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-white hover:bg-pink-600 focus:outline-none transition"
                    >
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            {showingNavigationDropdown ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Menu suspenso do usuário (desktop) */}
                {showMenu && (
                    <div className="absolute right-4 top-[90px] w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 text-center">
                            <div className="text-lg font-semibold text-pink-700">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                        <div className="flex flex-col items-center py-2">
                            <ResponsiveNavLink
                                href={route('profile.edit')}
                                className="w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition rounded"
                            >
                                Perfil
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition rounded"
                            >
                                Sair
                            </ResponsiveNavLink>
                        </div>
                    </div>
                )}

                {/* Menu responsivo para mobile */}
                {showingNavigationDropdown && (
                    <div className="sm:hidden absolute top-full right-4 mt-2 bg-white shadow-lg rounded-md py-2 px-4 z-50 w-64 space-y-2 text-sm font-medium">
                        {user ? (
                         <>
                     {user.admin === 1 && (
                     <Link href="/Administracao" className="block text-gray-700 hover:text-pink-600">
                        ADMINISTRAÇÃO
                     </Link>
                        )}
                    <Link href="/dashboard" className="block text-gray-700 hover:text-pink-600">
                     CATÁLOGO
                    </Link>
                    <Link href="/CarrinhoDeCompra" className="block text-gray-700 hover:text-pink-600">
                            CARRINHO
                        </Link>
                           <Link href="/MeusPedidos" className="block text-gray-700 hover:text-pink-600">
                            MEUS PEDIDOS
                        </Link> 
                     </>
                    )  : (
                        <>
                    <Link href="/" className="block text-gray-700 hover:text-pink-600">
                     CATÁLOGO
                    </Link>
                    <Link href="/CarrinhoWL" className="block text-gray-700 hover:text-pink-600">
                    CARRINHO
                    </Link>
                        </>
                    )}
                     
                        
                        <Link href="/contato" className="block text-gray-700 hover:text-pink-600">
                            SOBRE
                        </Link>
                        {user ? (
                            <>
                                <Link href={route('profile.edit')} className="block text-gray-700 hover:text-pink-600">
                                    PERFIL
                                </Link>
                                <Link
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                    className="block w-full text-left text-gray-700 hover:text-pink-600"
                                >
                                    SAIR
                                </Link>
                            </>
                        ):(
                         <Link href="/login" className="block text-gray-700 hover:text-pink-600">
                                    LOGIN
                                </Link>
                        )}
                        
                    </div>
                    
                )}
            </header>

            {/* Conteúdo */}
            <main className="py-6">{children}</main>
        </div>
    );
}
