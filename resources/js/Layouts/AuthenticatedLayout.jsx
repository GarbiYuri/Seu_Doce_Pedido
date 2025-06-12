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

    if (user) {
        return (
            <>


                <div className="min-h-screen bg-gray-50">
                    {/* Faixa superior */}
                    <div
                        className="bg-pink-600 text-white text-center text-xs py-1 font-bold"
                        style={{ letterSpacing: '0.05em' }}
                    >
                        <strong style={{ fontWeight: '700', color: 'white' }}>
                            Sua felicidade começa com um doce &{' '}
                        </strong>
                        cuidamos de cada detalhe pra ela durar muito mais!

                    </div>

                    {/* Header */}
                    <header className="bg-white shadow-md">
                        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between py-5">
                            {/* Logo e nome */}
                            <div className="flex items-center gap-4">
                                <Link href="/dashboard">
                                    <img
                                        src="/imagens/Logo_GabyAtualizada.png"
                                        alt="Logo"
                                        width="80"
                                        height="80"
                                        className="object-contain"
                                    />
                                </Link>

                                {/* Google Fonts */}
                                <link
                                    href="https://fonts.googleapis.com/css2?family=Lobster&display=swap"
                                    rel="stylesheet"
                                />
                                <h1
                                    style={{ fontFamily: "'Lobster', cursive" }}
                                    className="text-3xl text-pink-600 select-none"
                                >
                                    Gaby Guslafer
                                </h1>
                            </div>

                            {/* Navegação */}
                            <nav className="flex items-center gap-8 text-sm font-medium text-gray-700">
                                {user.admin === 1 &&(
                                    <Link
                                    href="/Administracao"
                                    className="hover:text-pink-600 transition-colors duration-300"
                                >

                                    ADMINISTRAÇÃO
                                </Link>
                                )}
                                 
                                <Link
                                    href="/dashboard"
                                    className="hover:text-pink-600 transition-colors duration-300"
                                >
                                    CATÁLOGO
                                </Link>
                                <Link
                                    href="/CarrinhoDeCompra"
                                    className="hover:text-pink-600 transition-colors duration-300"
                                >
                                    CARRINHO
                                </Link>
                                <Link
                                    href="/contato"
                                    className="hover:text-pink-600 transition-colors duration-300"
                                >
                                    SOBRE
                                </Link>

                                {/* Botão do usuário */}
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors duration-300 shadow-md"
                                >
                                    {user.name}
                                </button>



                                {/* Dropdown do usuário */}
                                {showMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
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

                            </nav>
                        </div>
                    </header>

                    {/* Conteúdo */}
                    <main className="py-6">{children}</main>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>

                <div className="min-h-screen bg-gray-50">
                    {/* Faixa superior */}
                    <div
                        className="text-white text-center text-xs py-1"
                        style={{ backgroundColor: pinkColor }}
                    >
                        <strong style={{ fontWeight: '700', color: 'white' }}>
                            Sua felicidade começa com um doce &{' '}
                        </strong>
                        cuidamos de cada detalhe pra ela durar muito mais!
                    </div>

                    {/* Header */}
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
                            {/* Logo e nome */}
                            <div className="flex items-center gap-2">
                                <Link href="/">
                                    <img src="/imagens/Logo_GabyAtualizada.png" alt="Logo" heigth="100" width="100" />
                                </Link>
                                <span className="text-2xl font-extrabold" style={{ fontFamily: 'cursive', color: pinkColor }}>
                                    Gaby Guslafer
                                </span>
                            </div>

                            {/* Navegação */}
                            <nav className="flex items-center gap-6 text-sm font-medium">
                                <Link href="/dashboard" className="hover:text-pink-600">
                                    CATÁLOGO
                                </Link>
                                <Link href="/CarrinhoWL" className="hover:text-pink-600">
                                    CARRINHO
                                </Link>
                                <Link href="/contato" className="hover:text-pink-600">
                                    SOBRE
                                </Link>

                                <Link
                                    href={route('login')}
                                    style={{ backgroundColor: pinkColor }}
                                    className=" text-white px-4 py-2 rounded hover:bg-pink-700 transition"
                                >
                                    LOGIN
                                </Link>
                            </nav>
                        </div>
                    </header>

                    {/* Conteúdo */}
                    <main className="py-6">{children}</main>
                </div>
            </>
        );
    }
}
