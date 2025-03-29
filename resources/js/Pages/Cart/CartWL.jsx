import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from "@inertiajs/react";
import { useState } from 'react';


export default function CartWL() {
    const { cart = {} } = usePage().props; // Pegando os dados do carrinho
    const { products = [] } = usePage().props;

    // Filtra os produtos que estão no carrinho
    const cartProducts = products.filter(product => cart[product.id]);

    // Calcula o total do carrinho
    const total = cartProducts.reduce((sum, product) => sum + (product.price * cart[product.id]), 0);

    const [updatedCart, setUpdatedCart] = useState(cart);

    const updateQuantity = (productId, quantity) => {
        router.post("/update", {
            product_id: productId,
            quantity: quantity,
        }, {
            onSuccess: () => {
                // Atualiza o estado do carrinho sem recarregar a página
                setUpdatedCart(prevCart => ({
                    ...prevCart,
                    [productId]: quantity,
                }));
            },
            onError: (errors) => {
                alert('Erro ao atualizar o carrinho.');
            }
        });

    };


    // Função para diminuir a quantidade
    const decreaseQuantity = (productId) => {
        const newQuantity = cart[productId] > 0 ? cart[productId] - 1 : 1;
        updateQuantity(productId, newQuantity);
    };

    // Função para remover produto do carrinho
    const removeProduct = (productId) => {
        router.post('/remove', {
            product_id: productId,
        }, {
            onSuccess: () => {
                // Atualiza o estado do carrinho após remover o produto
                window.location.reload(); // Recarrega a página para pegar os dados atualizados do backend
            },
            onError: () => {
                alert('Erro ao remover o produto.');
            },
        });
    };
    return (
        <AuthenticatedLayout>
            <Head title="Carrinho de Compras" />

            <div className="p-6">
                <h2 className="text-2xl font-bold text-pink-700 mb-4">Meu Carrinho</h2>

                {cartProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {cartProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white border border-pink-300 p-4 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105 text-center relative"
                            >
                                {/* Botão de remoção do produto (X) */}
                                <button
                                    className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded-full"
                                    onClick={() => removeProduct(product.id)}
                                >
                                    X
                                </button>

                                <h2 className="text-xl font-bold text-pink-800">{product.name}</h2>
                                <p className="text-lg font-semibold text-gray-700 mt-2">R$ {product.price}</p>
                                <p className="text-md text-gray-600">Quantidade: {cart[product.id]}</p>
                                <p className="text-md font-bold text-pink-700">Subtotal: R$ {(product.price * cart[product.id]).toFixed(2)}</p>

                                {/* Botão de diminuição de quantidade */}
                                <button
                                    className="mt-2 px-4 py-2 bg-pink-600 text-white rounded-lg"
                                    onClick={() => decreaseQuantity(product.id)}
                                >
                                    -
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-lg text-gray-600">Seu carrinho está vazio.</p>
                )}

                {/* Total do Carrinho */}
                <div className="mt-6 text-center">
                    <h2 className="text-xl font-bold text-pink-800">Total: R$ {total}</h2>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
