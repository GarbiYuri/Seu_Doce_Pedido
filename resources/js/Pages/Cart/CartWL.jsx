import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, useForm } from "@inertiajs/react";
import { useState, useEffect } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import FinalizarPedidoWL from './FinalizarPedidoWL';

export default function CartWL() {
    const { cart = {} } = usePage().props;
    const { products = [] } = usePage().props;
    const shop = usePage().props.shop;

    const cartProducts = products.filter(product => cart[product.id]);
    const total = cartProducts.reduce((sum, product) => sum + (product.price * cart[product.id]), 0);
    const [updatedCart, setUpdatedCart] = useState(cartProducts);
    const [tipoPedido, setTipoPedido] = useState('retirada');

     

      const [dadosEntrega, setDadosEntrega] = useState({
    nome: '',
    cpf:'',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    email: ''
  });

  useEffect(() => {
  form.setData('dadosEntrega', dadosEntrega);
}, [dadosEntrega]);

    const updateQuantity = (productId, quantity) => {
        router.post("/update", {
            product_id: productId,
            quantity: quantity,
        }, {
             preserveScroll: true,
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
        const newQuantity = cart[productId] >= 1 ? cart[productId] - 1 : 1;
        updateQuantity(productId, newQuantity);
    };

    const increaseQuantity = (productId) => {
        const newQuantity = cart[productId] + 1;
        updateQuantity(productId, newQuantity);
    };

    const removeProduct = (productId) => {
        router.post('/remove', { product_id: productId }, {
            preserveScroll: true,
            onSuccess: () => setUpdatedCart(prev => {
    const newCart = { ...prev };
    delete newCart[productId];
    return newCart;
  }),
            onError: () => alert('Erro ao remover o produto.'),
        });
    };
  const form = useForm({
        products: cartProducts.map(p => ({
       id: p.id,
       name: p.name,
       description : p.descricao,
       quantity: cart[p.id],
       price: p.price,
       imagem : p.imagem,
       id_categoria : p.id_categoria,
     })),
     tipoPedido,
     dadosEntrega,
   });
 
   useEffect(() => {
     form.setData('tipoPedido', tipoPedido);
   }, [tipoPedido]);
 
   const handleSubmit = (e) => {
     e.preventDefault();
     form.post(route('pagarWL'), {
       onSuccess: (page) => {
         const initPoint = page.props.init_point;
         if (initPoint) {
           window.open(url, '_blank');
           window.location.href = initPoint;
         }
       },
       onError: () => {
         alert('Erro ao processar o pagamento.');
       }
     });
   };
 


    return (
        <AuthenticatedLayout>
            <Head title="Carrinho de Compras" />
                {cartProducts.length > 0 ? (
                    <div className="bg-white border border-pink-200 rounded-3xl p-6 shadow-md">
                 {cartProducts.map((product) => (
                    <div
                        key={product.id}
                        className="flex items-center justify-between border-b border-pink-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0"
                    >
                        {/* Produto */}
                        <div className="flex items-center gap-4">
                            <img
                                src={`${product.imagem}`}
                                alt={product.name}
                                className="w-20 h-20 rounded-xl object-cover"
                            />
                            <div>
                                <h3 className="text-md font-semibold text-gray-800">{product.name}</h3>
                                <p className="text-xs text-gray-500">{product.descricao}</p>
                                <p className="text-md font-bold text-gray-900">R${product.price}</p>
                            </div>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => removeProduct(product.id)}
                                className="text-red-500 hover:text-red-600"
                                title="Remover"
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 bg-gray-50">
                                <button
                                    onClick={() => decreaseQuantity(product.id)}
                                    className="text-gray-700 hover:text-pink-600"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="text-sm font-semibold px-2">{cart[product.id]}</span>
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

                {/* Subtotal */}
                <div className="flex justify-between items-center pt-4 border-t border-pink-100 mt-4">
                    <span className="text-pink-500 font-bold text-base">SubTotal</span>
                    <span className="text-lg font-bold text-gray-900">
                        R$ {total.toFixed(2).replace('.', ',')}
                    </span>
                </div>

                {/* Botões */}
                  {/* Formulário único */}
          <form onSubmit={handleSubmit} className="mt-6">
            {/* Passa dadosEntrega e setDadosEntrega para FinalizarPedidoWL */}
            <FinalizarPedidoWL
              tipoPedido={tipoPedido}
              setTipoPedido={setTipoPedido}
              dadosEntrega={dadosEntrega}
              setDadosEntrega={setDadosEntrega}
            />

       {shop.loja_aberta ? (
  <div className="flex flex-col gap-3 mt-6">
              <button
                type="submit"
                disabled={form.processing}
                className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-5 rounded-full text-sm font-medium shadow-md mt-4"
              >
                Continuar Compra
              </button>
            </div>
) : (
  <div className="flex flex-col gap-3 mt-6">
    <p className="text-red-600 font-semibold text-sm">
      Loja fechada no momento. Não é possível continuar a compra.
    </p>
    <button
      disabled
      className="bg-gray-400 text-white py-2 px-5 rounded-full text-sm font-medium shadow-md mt-4 opacity-50 cursor-not-allowed"
    >
      Loja Fechada
    </button>
  </div>
)}
           
          </form>
            </div>

                ):(   <p className="text-center text-xl text-gray-500">Seu carrinho está vazio.</p>)}
            
        </AuthenticatedLayout>
    );
}
