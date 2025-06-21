import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FinalizarPedido from '@/Pages/Cart/FinalizarPedido';
import { Head, router, usePage, useForm } from "@inertiajs/react";
import { useState, useEffect } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';

export default function Cart({ cartProducts }) {
  const informacoes = usePage().props.auth.informacoes;
  const [updatedCart, setUpdatedCart] = useState(cartProducts);
  const [tipoPedido, setTipoPedido] = useState('retirada');

  const form = useForm({
    products: updatedCart.map(p => ({
      id: p.Id_Product,
      name: p.name,
      quantity: p.quantity,
      price: p.price,
    })),
    tipoPedido,
  });

  useEffect(() => {
    form.setData('tipoPedido', tipoPedido);
  }, [tipoPedido]);

  const handleSubmit = (e) => {
    e.preventDefault();
    form.post(route('pagar'), {
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

    const decreaseQuantity = (productId) => {
        const product = updatedCart.find(p => p.Id_Product === productId);
        const newQuantity = product && product.quantity > 1 ? product.quantity - 1 : 0;
        if(newQuantity === 0){
            removeProduct(productId)
        }else{
        updateQuantity(productId, newQuantity);
        }
        
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
          preserveScroll: true,
            onSuccess: () => {
                setUpdatedCart(prevCart => prevCart.filter(product => product.Id_Product !== productId));
            },
            onError: () => {
                alert('Erro ao remover o produto.');
            },
        });
    };

    const total = updatedCart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
   const updateQuantity = (productId, quantity) => {
        
        router.post("/updateC", {
            product_id: productId,
            quantity: quantity,
        }, {
          preserveScroll: true,
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

          {/* Formulário único envolvendo tudo */}
          <form onSubmit={handleSubmit} method="post" target="_blank" className="mt-6">
            <FinalizarPedido tipoPedido={tipoPedido} setTipoPedido={setTipoPedido} informacoes={informacoes} />

          <div className="flex flex-col gap-3 mt-6">
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-5 rounded-full text-sm font-medium shadow-md mt-4"
            >
              Continuar Compra
            </button>
          </div>
            
          </form>
        </div>
      ) : (
        <p className="text-center text-xl text-gray-500">Seu carrinho está vazio.</p>
      )}
    </AuthenticatedLayout>
  );
}
