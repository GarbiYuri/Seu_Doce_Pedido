import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ products }) {
    const [buttonTexts, setButtonTexts] = useState({}); // Estado para armazenar o texto de cada botão
  
    const addToCart = (Id_Product) => {
        router.post("/cart/add", { Id_Product: Id_Product }, {
          onSuccess: () => {
            setButtonTexts((prev) => ({ ...prev, [Id_Product]: "Adicionado!" }));
             // Volta ao texto original após 1 segundo
          setTimeout(() => {
            setButtonTexts((prev) => ({ ...prev, [Id_Product]: "Adicionar ao Carrinho" }));
        }, 800);
          },
          onError: (errors) => {
            console.error(errors);
            alert("Erro ao adicionar o produto ao carrinho.");
            setButtonTexts((prev) => ({ ...prev, [Id_Product]: "Adicionar ao Carrinho"}));
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
            className="bg-white border border-pink-200 rounded-3xl shadow-md hover:shadow-xl transition transform hover:scale-105 flex flex-col items-center p-5"
        >
            <img
                src={`/imagem/${product.imagem}`}
                alt={`Imagem de ${product.name}`}
                className="w-32 h-32 object-cover rounded-xl border border-pink-100"
            />

            <h2 className="text-lg font-bold text-pink-800 mt-4">
                {product.name}
            </h2>

            <p className="text-sm text-gray-500 mt-1">Descrição do produto</p>

            <p className="text-lg font-semibold text-gray-800 mt-3">
                R$ {product.price}
            </p>

            <button
                className={`mt-4 px-6 py-2 rounded-full font-semibold transition duration-300 ${
                    buttonTexts[product.id] === "Adicionado!"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-pink-500 hover:bg-pink-600"
                } text-white shadow-md`}
                onClick={() => addToCart(product.id)}
                disabled={buttonTexts[product.id] === "Adicionado!"}
            >
                {buttonTexts[product.id] || "Adicionar ao Carrinho"}
            </button>
        </div>
    ))}
</div>


        </AuthenticatedLayout>
    );
}
