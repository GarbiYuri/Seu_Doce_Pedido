import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ products, categories, banner }) {
        const user = usePage().props.auth.user;
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
                setButtonTexts((prev) => ({ ...prev, [Id_Product]: "Adicionar ao Carrinho" }));
            },
        });

    };

    
    
 return (
        <AuthenticatedLayout

        >
            <Head title="DashBoard" />

            <div className="container mx-auto text-center mt-10">
      {banner ? (
        <>
          <img
            src={banner.imagem}
            alt={banner.nome}
            className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
          />
          <h1 className="text-2xl font-bold mt-4">{banner.nome}</h1>

          {isAdmin && (
            <Link
              href={`/banners/${banner.id}/edit`}
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Editar Banner
            </Link>
          )}
        </>
      ) : (
        <>
         

          {user.admin === 1 && (
            <Link
              href="/banners/create"
              className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Adicionar Banner
            </Link>
          )}
        </>
      )}
    </div>

            {categories.map((category) => {
                const filteredProducts = products.filter(
                    (product) => product.id_categoria === category.id
                );

                if (filteredProducts.length === 0) return null;

                return (
                    <div
                        key={category.id}
                        className="mb-10"
                    >
                        <h2 className="text-lg font-bold text-pink-800 mb-3 p-2 ">
                            {category.name}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="rounded-xl  flex flex-col items-center p-4 "
                                >
                                    <img
                                        src={`/imagem/${product.imagem}`}
                                        alt={`Imagem de ${product.name}`}
                                        className=" w-48 h-48 object-contain rounded-lg mb-4 " 
                                       
                                
                                    />

                                    <h2 className="text-base font-medium text-gray-800">{product.name}</h2>

                                    <p className="text-xs text-gray-500 mb-1">{product.descricao}</p>

                                    <p className="text-xl font-bold text-gray-900 mb-4">
                                        R${Number(product.price).toFixed(2).replace('.', ',')}
                                    </p>

                                    <button
                                        className={`text-sm px-5 py-2 rounded-full font-medium shadow-md transition duration-300 ${buttonTexts[product.id] === "Adicionado!"
                                                ? "bg-green-500 hover:bg-green-600"
                                                : "bg-pink-500 hover:bg-pink-600"
                                            } text-white`}
                                        onClick={() => addToCart(product.id)}
                                        disabled={buttonTexts[product.id] === "Adicionado!"}
                                    >
                                        {buttonTexts[product.id] || "Adicionar ao carrinho"}
                                    </button>
                                </div>

                            ))}
                        </div>
                    </div>
                );

            })}

        </AuthenticatedLayout>
    );
    
   
}
