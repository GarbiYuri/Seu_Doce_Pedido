import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Dashboard({ products }) {
  
    const addToCart = (Id_Product) => {
        router.post("/cart/add", { Id_Product: Id_Product }, {
          onSuccess: () => {
            alert("Produto adicionado ao carrinho!");
          },
          onError: (errors) => {
            console.error(errors);
            alert("Erro ao adicionar o produto ao carrinho.");
          },
        });
      };
      
    return (
        <AuthenticatedLayout

        >
            <Head title="DashBoard" />


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-pink-100 border border-pink-300 p-4 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105 text-center"
                    >
                        <h2 className="text-xl font-bold text-pink-800">{product.name}</h2>
                        <p className="text-lg font-semibold text-gray-700 mt-2">R$ {product.price}</p>
                        <button
                            onClick={() => addToCart(product.id)}
                            className="mt-4 bg-pink-500 text-white py-2 px-4 rounded-full hover:bg-pink-600 transition duration-300"
                        >
                            Adicionar ao Carrinho
                        </button>
                    </div>
                ))}
            </div>

        </AuthenticatedLayout>
    );
}
