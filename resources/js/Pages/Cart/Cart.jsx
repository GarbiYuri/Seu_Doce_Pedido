import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from "@inertiajs/react";
import { useState } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';

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

    const increaseQuantity = (productId) => {
        const product = updatedCart.find(p => p.Id_Product === productId);
        const newQuantity = product.quantity + 1;
        updateQuantity(productId, newQuantity);
    };

    const removeProduct = (productId) => {
        router.post('/deleteC', {
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

    const total = updatedCart.reduce((sum, product) => sum + (product.price * product.quantity), 0);

    return (
        <AuthenticatedLayout>
            <Head title="Carrinho de Compras" />

            {updatedCart.length > 0 ? (
                <div className="bg-white border border-pink-200 rounded-3xl p-6 shadow-md max-w-3xl mx-auto">
                    {updatedCart.map((product) => (
                        <div
                            key={product.Id_Product}
                            className="flex items-center justify-between border-b border-pink-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0"
                        >
                            {/* Produto */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={`/imagem/${product.imagem}`}
                                    alt={product.name}
                                    className="w-20 h-20 rounded-xl object-cover"
                                />
                                <div>
                                    <h3 className="text-md font-semibold text-gray-800">{product.name}</h3>
                                    <p className="text-xs text-gray-500">Descrição do produto</p>
                                    <p className="text-md font-bold text-gray-900">R$ {product.price}</p>
                                </div>
                            </div>

                            {/* Ações */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => removeProduct(product.Id_Product)}
                                    className="text-red-500 hover:text-red-600"
                                    title="Remover"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 bg-gray-50">
                                    <button
                                        onClick={() => decreaseQuantity(product.Id_Product)}
                                        className="text-gray-700 hover:text-pink-600"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="text-sm font-semibold px-2">{product.quantity}</span>
                                    <button
                                        onClick={() => increaseQuantity(product.Id_Product)}
                                        className="text-gray-700 hover:text-pink-600"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Subtotal */}
                    <div className="flex justify-between items-center pt-4 border-t border-pink-100 mt-4">
                        <span className="text-pink-500 font-bold text-base">SubTotal</span>
                        <span className="text-lg font-bold text-gray-900">
                            R$ {total.toFixed(2).replace('.', ',')}
                        </span>
                    </div>

                    {/* Botões */}
                    <div className="flex flex-col gap-3 mt-6">
                        <button className="bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-full text-sm font-medium shadow-md">
                            Finalizar Compra
                        </button>
                        <button className="bg-pink-100 hover:bg-pink-200 text-pink-700 py-2 rounded-full text-sm font-medium shadow-inner">
                            Voltar à Página Inicial
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-center text-xl text-gray-500">Seu carrinho está vazio.</p>
            )}
        </AuthenticatedLayout>
    );
}
