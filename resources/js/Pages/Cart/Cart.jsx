import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FinalizarPedido from '@/Pages/Cart/FinalizarPedido';
import { Head, router, usePage, useForm } from "@inertiajs/react";
import { useState, useEffect } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';

export default function Cart({ cartProducts}) {
  const informacoes = usePage().props.auth.informacoes;
  const shop = usePage().props.shop; 
  const [updatedCart, setUpdatedCart] = useState(cartProducts);
  const [tipoPedido, setTipoPedido] = useState('retirada');
  const user = usePage().props.auth.user;
  
  const [botao, setBotao] = useState(false);

  const [enderecoSelecionado, setEnderecoSelecionado] = useState(
  usePage().props.auth.enderecos?.find(end => end.is_principal) || null
);

  const form = useForm({
  products: updatedCart.map(p => ({
    id_product: p.Id_Product,
    name: p.product_name,
    promo_name: p.promo_name,
    quantity: p.quantity,
    kitquantity: p.promo_quantity,
    price: p.isPromo ? p.promo_price : p.product_price,
    imagem: p.product_imagem,
    description : p.product_description,
    id_categoria : p.product_Id_Category,
  })),
  informacoes,
  tipoPedido,
});



useEffect(() => {
  form.setData('products', updatedCart.map(p => ({
    id_product: p.Id_Product,
    id_promo: p.Id_Promo,
    name: p.product_name,
    promo_name: p.promo_name,
    quantity: p.quantity,
    kitquantity: p.promo_quantity,
    price: p.isPromo ? p.promo_price : p.product_price,
    imagem: p.product_imagem,
    description: p.product_description,
    id_categoria: p.product_Id_Category,
  })));
  // Inclui endereço se for entrega
  if(tipoPedido === 'entrega') {
    const enderecoAtual = enderecoSelecionado || enderecoTemporario;
    form.setData('endereco', {
      rua: enderecoAtual?.rua || '',
      numero: enderecoAtual?.numero || '',
      bairro: enderecoAtual?.bairro || '',
      cidade: enderecoAtual?.cidade || '',
      estado: enderecoAtual?.estado || '',
      cep: enderecoAtual?.cep || '',
      complemento: enderecoAtual?.complemento || '',
      telefone: informacoes?.telefone || '',
    });
  } else {
    form.setData('endereco', null); // ou apenas telefone se quiser
  }

}, [updatedCart, tipoPedido, enderecoSelecionado, ]);


console.log(updatedCart);

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

  const total = updatedCart.reduce((sum, product) => {
  const price = product.isPromo ? product.promo_price : product.product_price;
  return sum + (price * product.quantity);
}, 0);

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
        
        <div className="bg-white border border-[#8a5a33] rounded-3xl p-6 shadow-md max-w-3xl mx-auto">
          {updatedCart.map((product) => {
              const existe = product?.promo_Id_Product || null;
            return (
            <div
              key={product.Id_Product}
              className="flex items-center justify-between border-b border-[#8a5a33] pb-4 mb-4 last:border-0 last:pb-0 last:mb-0"
            >
   
              {/* Produto */}
              <div className="flex items-center gap-4">
                {product.isPromo && !existe  ? (
                   <img
                  src={`${product.promo_image}`}
                  alt={product.product_name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
               
                ) : (
                   <img
                  src={`${product.product_image}`}
                  alt={product.product_name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                )}
               
                <div>
                  
                  <h3 className="text-md font-semibold text-gray-800">{product.product_name}</h3>
                  <p className="text-xs text-gray-500">{product.product_description}</p>
                {product.isPromo && existe? (
  <p className="text-md font-bold text-gray-900">
    <span className="line-through text-gray-500 mr-2">
      R$ {Number(product.product_price).toFixed(2).replace('.', ',')}
    </span>
    <span className="text- [#613d20]">
      R$ {Number(product.promo_price).toFixed(2).replace('.', ',')}
    </span>
    
  </p>
) : product.isPromo ?(
  <div>
    
  <h3 className="text-md font-semibold text-gray-800">{product.promo_name}</h3>
  <p className="text-xs text-gray-500">{product.promo_description}</p>
  <p className="text-md font-bold text-gray-900">
    
    <span className="text-[#613d20]">
      R$ {Number(product.promo_price).toFixed(2).replace('.', ',')}
    </span>
  </p>
  
  </div>
) : (
  <p className="text-md font-bold text-gray-900">
    R$ {Number(product.product_price).toFixed(2).replace('.', ',')}
  </p>
)}
{product.promo_quantity > 1 && product.isPromo && (
<span className="text-sm font-semibold px-2">{product.quantity} kit(s) de {product.promo_quantity}x</span>
)}


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
                    className="text-gray-700 hover:text-[#613d20]"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm font-semibold px-2">{product.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(product.Id_Product)}
                    className="text-gray-700 hover:text-[#613d20]"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
            );
})}

          {/* Subtotal */}
          <div className="flex justify-between items-center pt-4 border-t border-[#8a5a33] mt-4">
            <span className="text-[#613d20] font-bold text-base">SubTotal</span>
            <span className="text-lg font-bold text-gray-900">
              R$ {total.toFixed(2).replace('.', ',')}
            </span>
          </div>

    
            <FinalizarPedido 
            tipoPedido={tipoPedido} 
            setTipoPedido={setTipoPedido} 
            informacoes={informacoes}  
            setBotao={setBotao}
            enderecoSelecionado={enderecoSelecionado}
            setEnderecoSelecionado={setEnderecoSelecionado}
            />
          {/* Formulário único envolvendo tudo */}
          {botao == false ? (
            <div>
           <form onSubmit={handleSubmit} method="post" target="_blank" className="mt-6">

         {shop.loja_aberta || user.admin ? (
  <div className="flex flex-col gap-3 mt-6">
    <button
      type="submit"
      className="bg-[#613d20] hover:bg-[#613d20] text-white py-2 px-5 rounded-full text-sm font-medium shadow-md mt-4"
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
          ) : (
            <div>
               <form onSubmit={handleSubmit} method="post" target="_blank" className="mt-6">

          <div className="flex flex-col gap-3 mt-6">
             
      
            <button
  type="submit"
  disabled={botao} // Desativa quando "botao" é true
  className={`bg-[#613d20] text-white py-2 px-5 rounded-full text-sm font-medium shadow-md mt-4 transition 
    ${botao ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#613d20]'}
  
  `}
 
>
  Continuar Compra
</button>
     
          </div>
            
          </form>
            </div>
          )}
           
       
            </div>
         
         

      ) : (
        <p className="text-center text-xl text-gray-500">Seu carrinho está vazio.</p>
      )}
    </AuthenticatedLayout>
  );
}
