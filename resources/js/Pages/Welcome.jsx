import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from "@inertiajs/react";
import { useState } from 'react';

export default function Welcome({ products }) {
    const [buttonTexts, setButtonTexts] = useState({}); // Estado para armazenar o texto de cada botão

    // Função para adicionar produto ao carrinho
    const addToCart = (productId) => {

        router.post("/cartwl/add", { product_id: productId, quantity: 1 }, {
            onSuccess: () => {
                setButtonTexts((prev) => ({ ...prev, [productId]: "Adicionado!" }));
            },
            onError: (errors) => {
                console.error(errors);
                alert("Erro ao adicionar o produto ao carrinho.");
                setButtonTexts((prev) => ({ ...prev, [productId]: "Adicionar ao Carrinho" }));
            },

        });
        // Volta ao texto original após 1 segundo
        setTimeout(() => {
            setButtonTexts((prev) => ({ ...prev, [productId]: "Adicionar ao Carrinho" }));
        }, 800);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Welcome" />
            <div className='container' >
                {products.map((product) => (
                    <div
                        key={product.id}
                        
                    >
                        <h2 >{product.name}</h2>
                        <p >R$ {product.price}</p>

                        {/* Botão de adicionar ao carrinho */}
                        <button
                            
                            onClick={() => addToCart(product.id)}
                            disabled={buttonTexts[product.id] === "Adicionado!"} // Evita múltiplos cliques
                        >
                            {buttonTexts[product.id] || "Adicionar ao Carrinho"}
                        </button>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
