import { Head, Link } from "@inertiajs/react";
import React, { useState, useEffect, useRef } from "react";

export default function Welcome({ auth }) {
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

    return (
        <>
            <Head title="Seu Doce Pedido" />

            <header>

                <div className="header-container">
                    <div className="header-left">
                        <img src="imagens/logo-seudocepedido.png" alt="Logo Seu Doce Pedido" className="header-logo" />
                        <span className="company-name">Seu Doce Pedido!</span>
                    </div>

                    <div className="header-right">
                        <a href="index.html" className="header-link">
                            <img src="imagens/icone-menu.png" alt="Ícone Menu" className="header-icon" />
                            Menu
                        </a>
                        <a href="cart.html" className="header-link">
                            <img src="imagens/icone-carrinho.png" alt="Ícone Carrinho" className="header-icon" />
                            Carrinho
                        </a>

                        {/* Sobre + Menu Dropdown */}
                        <div className="relative inline-block">
                            <button
                                ref={buttonRef}
                                className="header-link flex items-center gap-1"
                                onMouseEnter={() => setShowMenu(true)}
                                onClick={() => setShowMenu((prev) => !prev)} // Para mobile
                            >
                                <img src="imagens/icone-sobre.png" alt="Ícone Sobre" className="header-icon" />
                                Sobre
                                <span
                                    className={`transition-transform duration-300 ${
                                        showMenu ? "rotate-90" : "rotate-0"
                                    }`}
                                >
                                    ➤
                                </span>
                            </button>

                            {/* Menu suspenso */}
                            <div
                                ref={menuRef}
                                className={`absolute left-0 mt-2 w-40 bg-white border border-gray-300 shadow-lg rounded-md transform transition-all duration-300 ${
                                    showMenu ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                                }`}
                                onMouseEnter={() => setShowMenu(true)} // Mantém aberto ao passar o mouse
                                onMouseLeave={() => setShowMenu(false)} // Fecha ao sair do menu
                            >
                                <Link
                                    href={route("login")}
                                    className="block px-4 py-2 text-black hover:bg-gray-200"
                                    onMouseEnter={() => setShowMenu(true)} // Impede que o menu feche ao passar o mouse
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="block px-4 py-2 text-black hover:bg-gray-200"
                                    onMouseEnter={() => setShowMenu(true)} // Impede que o menu feche ao passar o mouse
                                >
                                    Registro
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
