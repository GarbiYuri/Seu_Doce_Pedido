import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from "@inertiajs/react";
import { useState } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';

export default function CartWL() {
    const { cart = {} } = usePage().props;
    const { products = [] } = usePage().props;

    const cartProducts = products.filter(product => cart[product.id]);
    const total = cartProducts.reduce((sum, product) => sum + (product.price * cart[product.id]), 0);
    const [updatedCart, setUpdatedCart] = useState(cart);

    const updateQuantity = (productId, quantity) => {
        router.post("/update", {
            product_id: productId,
            quantity: quantity,
        }, {
            onSuccess: () => {
                setUpdatedCart(prevCart => ({
                    ...prevCart,
                    [productId]: quantity,
                }));
            },
            onError: () => {
                alert('Erro ao atualizar o carrinho.');
            }
        });
    };

    const decreaseQuantity = (productId) => {
        const newQuantity = cart[productId] > 1 ? cart[productId] - 1 : 1;
        updateQuantity(productId, newQuantity);
    };

    const increaseQuantity = (productId) => {
        const newQuantity = cart[productId] + 1;
        updateQuantity(productId, newQuantity);
    };

    const removeProduct = (productId) => {
        router.post('/remove', { product_id: productId }, {
            onSuccess: () => window.location.reload(),
            onError: () => alert('Erro ao remover o produto.'),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Carrinho de Compras" />

            <div className="p-6 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-pink-700 mb-6">Meu Carrinho</h2>

                {cartProducts.length > 0 ? (
                    <div className="bg-white border border-pink-200 rounded-3xl p-6">
                        {cartProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between border-b border-pink-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={`/imagem/${product.imagem}`}
                                        alt={product.name}
                                        className="w-16 h-16 rounded-xl object-cover"
                                    />
                                    <div>
                                        <h3 className="text-md font-semibold text-gray-800">{product.name}</h3>
                                        <p className="text-sm text-gray-500">Descrição do produto</p>
                                        <p className="text-md font-bold text-gray-700">R$ {product.price.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => removeProduct(product.id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    <div className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1">
                                        <button
                                            onClick={() => decreaseQuantity(product.id)}
                                            className="text-gray-700 hover:text-pink-600"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="text-sm font-medium">{cart[product.id]}</span>
                                        <button
                                            onClick={() => increaseQuantity(product.id)}
                                            className="text-gray-700 hover:text-pink-600"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between items-center pt-4">
                            <span className="text-pink-500 font-semibold">SubTotal</span>
                            <span className="text-lg font-bold text-gray-800">R$ {total.toFixed(2)}</span>
                        </div>

                        <div className="flex flex-col gap-3 mt-6">
                            <button className="bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-full text-sm font-medium">
                                Finalizar Compra
                            </button>
                            <button className="bg-pink-100 hover:bg-pink-200 text-pink-700 py-2 rounded-full text-sm font-medium">
                                Voltar à Página Inicial
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-lg text-gray-600">Seu carrinho está vazio.</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
