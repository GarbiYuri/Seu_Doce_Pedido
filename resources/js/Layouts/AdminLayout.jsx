import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';


import React, { useState, useEffect, useRef } from "react";

export default function AdminLayout({ header, children }) {
    const user = usePage().props.auth.user;
    

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    // Fecha o menu ao clicar fora dele
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

    if (user.admin) {
        // Usúario Registrado/Logado (Com Login Administrativo)
        return (
            <>
                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

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

                <header>

                    <div className="header-container">
                        <div className="header-left">
                            <Link href='Administracao'>
                                <img src="imagens/logo-seudocepedido.png" alt="Logo Seu Doce Pedido" className="header-logo" />
                            </Link>

                            <span className="company-name">Administração</span>
                        </div>

                        <div className="header-right">
                        <a href="dashboard" className="header-link">
                                <img src="imagens/House.png" alt="Home" height="30" width="30"/>Home
                            </a>
                            <a href="/" className="header-link">
                                Vendas
                            </a>
                            <Link href='Categorias' className='header-link'>
                                Categorias
                            </Link>


                            <Link href="Produtos" className="header-link">
                                Produtos

                            </Link>



                            <div className="">




                                <div className="relative ms-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <img src="imagens/icone-sobre.png" alt="Ícone Sobre" className="header-icon" />
                                                <button
                                                    type="button"
                                                    className="header-link flex items-center gap-1"
                                                >
                                                    {user.name}

                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route('profile.edit')}
                                            >
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>

                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <main>{children}</main>
            </>

        );
    } else {
        return (
            <>

            </>
        )
    }

}


