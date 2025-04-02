import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from "@inertiajs/react";
import { useState } from 'react';

export default function Cart({ cartProducts }) {
    const [updatedCart, setUpdatedCart] = useState(cartProducts);

    const updateQuantity = (productId, quantity) => {
        router.post("/updateC", {
            product_id: productId,
            quantity: quantity,
        }, {
            onSuccess: () => {
                setUpdatedCart(prevCart =>
                    prevCart.map(product =>
                        product.Id_Product === productId ? { ...product, quantity } : product
                    )
                );
            },
            onError: () => {
                alert('Erro ao atualizar o carrinho.');
            }
        });
    };

    const decreaseQuantity = (productId) => {
        const product = updatedCart.find(p => p.Id_Product === productId);
        const newQuantity = product && product.quantity > 1 ? product.quantity - 1 : 1;
        updateQuantity(productId, newQuantity);
    };

    const removeProduct = (productId) => {
        router.post('/deleteC   ', {
            product_id: productId,
        }, {
            onSuccess: () => {
                setUpdatedCart(prevCart => prevCart.filter(product => product.Id_Product !== productId));
            },
            onError: () => {
                alert('Erro ao remover o produto.');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Carrinho de Compras" />

            {updatedCart.length > 0 ? (
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {updatedCart.map((cartproduct) => (
                            <div
                                key={cartproduct.Id_Product}
                                className="relative bg-white border border-gray-300 p-4 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105 text-center"
                            >
                                <button
                                    className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded-full"
                                    onClick={() => removeProduct(cartproduct.Id_Product)}
                                >
                                    X
                                </button>
                                <h2 className="text-xl font-bold text-pink-800">{cartproduct.name}</h2>
                                <img src={`/imagem/${cartproduct.imagem}`} alt="Imagem do Produto" />
                                <p className="text-lg font-semibold text-gray-700 mt-2">R$ {cartproduct.price}</p>
                                <p className="text-lg font-semibold text-gray-700 mt-2">Quantidade: {cartproduct.quantity}</p>
                                <p className="text-lg font-semibold text-gray-700 mt-2">Subtotal: R$ {(cartproduct.price * cartproduct.quantity).toFixed(2)}</p>

                                <button
                                    className="mt-2 px-4 py-2 bg-pink-600 text-white rounded-lg"
                                    onClick={() => decreaseQuantity(cartproduct.Id_Product)}
                                >
                                    -
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 text-right">
                        <h3 className="text-2xl font-bold">
                            Total: R$ {updatedCart.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2)}
                        </h3>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => alert("Pedido finalizado!")}
                            className="bg-pink-500 text-white py-3 px-6 rounded-full hover:bg-pink-600 transition duration-300"
                        >
                            Finalizar Pedido
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-center text-xl text-gray-500">Seu carrinho está vazio.</p>
            )}
        </AuthenticatedLayout>
    );
}
