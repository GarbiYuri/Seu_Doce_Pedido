import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from "@inertiajs/react";

export default function Cart({ cartProducts }) {
    return (
        <AuthenticatedLayout>
            <Head title="Carrinho de Compras" />

            {cartProducts.length > 0 ? (
                <div className="p-6">
                    {/* Exibindo produtos no carrinho */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {cartProducts.map((cartproduct) => (
                            <div
                                key={cartproduct.Id_Product}
                                className="bg-white border border-gray-300 p-4 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105 text-center"
                            >
                                <img src={cartproduct.imageUrl} alt={cartproduct.name} className="h-32 w-32 object-cover mx-auto mb-4" />
                                <h2 className="text-xl font-bold text-pink-800">{cartproduct.name}</h2>
                                <p className="text-lg font-semibold text-gray-700 mt-2">R$ {cartproduct.price}</p>
                                <p className="text-lg font-semibold text-gray-700 mt-2">Quantidade: {cartproduct.quantity}</p>
                                <p className="text-lg font-semibold text-gray-700 mt-2">Subtotal: R$ {(cartproduct.price * cartproduct.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    {/* Exibindo o total do carrinho */}
                    <div className="mt-6 text-right">
                        <h3 className="text-2xl font-bold">Total: R$ 
                            {cartProducts.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2)}
                        </h3>
                    </div>

                    {/* Botão para finalizar o pedido */}
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
