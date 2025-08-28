import { Head, usePage } from '@inertiajs/react';
import { FiArrowLeft } from 'react-icons/fi';

export default function CheckoutRedirect() {
  const { init_point, cartItems, userAddress, isPickup, frete } = usePage().props;
  const informacoes = usePage().props.auth.informacoes;
  const user = usePage().props.auth.user;

const total = cartItems.reduce((sum, item) => {
    const price = item.isPromo ? item.promo_price : item.product_price;
    return sum + price * item.quantity;
}, 0);


  return (
    <>
      <Head title="Confirmar Pedido" />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-[#613d20] mb-6">Confirme seu pedido</h1>

        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Seu carrinho está vazio.</p>
          ) : (
            <ul>
              {cartItems.map((item) => {
                const existe = item?.promo_Id_Product || null;
               
                return(
                   <div
              key={item.Id_Product}
              className="flex items-center justify-between border-b border-[#8a5a33] pb-4 mb-4 last:border-0 last:pb-0 last:mb-0"
            >
                   {item.isPromo && existe ? (
                <div className="flex items-center gap-4">
                    <img src={`${item.product_image}`} alt={item.product_name} className="w-16 h-16 object-contain rounded" />
                    <div>
                      <h2 className="font-semibold text-gray-800">{item.product_name}</h2>
                      <p className="text-sm text-gray-600">
                        Quantidade: {item.quantity}
                      </p>
                      
                    </div>
                   
                  </div>

) : item.isPromo ? (
<div className="flex items-center gap-4">
                    <img src={`${item.promo_image}`} alt={item.product_name} className="w-16 h-16 object-contain rounded" />
                    <div>
                      <h2 className="font-semibold text-gray-800">{item.promo_name}</h2>
                      <p className="text-sm text-gray-600">
                        Quantidade: {item.quantity}
                      </p>
                    </div>
                  </div>
) : (
    <div className="flex items-center gap-4">
                    <img src={`${item.product_image}`} alt={item.product_name} className="w-16 h-16 object-contain rounded" />
                    <div>
                      <h2 className="font-semibold text-gray-800">{item.product_name}</h2>
                      <p className="text-sm text-gray-600">
                        Quantidade: {item.quantity}
                      </p>
                    
                    </div>
                  </div>
)}
     <li key={item.id} className="flex items-center justify-between border-b py-3">
                   
                    {item.isPromo ? (
                  <p className="text-right font-bold text-pink-600">
                     R$ {(item.promo_price * item.quantity).toFixed(2).replace('.', ',')}
                  </p>
                    ):(
                      <p className="text-right font-bold text-pink-600">
                     R$ {(item.product_price * item.quantity).toFixed(2).replace('.', ',')}
                  </p>
                    )}
                   
                </li>
                
                </div>
                );
})}
            </ul>
          )}
        </div>

        
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-3 text-pink-600">Suas Informações</h2>
          
          <p>Nome: {user.name}</p>
          <p>Telefone: {informacoes.telefone}</p>
          <p><strong>CPF:</strong> {informacoes.cpf}</p>

          {isPickup ? (
            <p className="text-green-600 font-semibold mt-2">🏬 Retirada na loja (sem taxa de entrega)</p>
          ) : (
            <>
              <p className="mt-2"><strong>Endereço:</strong></p>
              {userAddress ? (
                <>
                  <p>{informacoes.rua}, {informacoes.numero}</p>
                  <p>{informacoes.bairro} - {informacoes.cidade}/{informacoes.estado}</p>
                  <p>CEP: {informacoes.cep}</p>
                </>
              ) : (
                <p>Endereço não informado</p>
              )}
            </>
          )}
        </div>

<div className="flex justify-between items-center text-lg font-bold text-gray-800 mb-6">
          <span>SubTotal:</span>
          <span className="text-pink-600">R$ {total.toFixed(2).replace('.', ',')}</span>
        
        </div>
 {isPickup ? (
           <>
          <div className="flex justify-between items-center text-lg font-bold text-gray-800 mb-6">
          <span>Frete:</span>
          <span className="text-[#613d20]">R$ 0,00</span>
        
        </div>
           </>
          ) : (
            <>
             <div className="flex justify-between items-center text-lg font-bold text-gray-800 mb-6">
          <span>Frete:</span>
          <span className="text-[#613d20]">R$ {frete.toFixed(2).replace('.', ',')}</span>
        
        </div>
            </>
          )}
          <div className="flex justify-between items-center text-lg font-bold text-gray-800 mb-6">
          <span>Total:</span>
          <span className="text[#613d20]">
  {(frete + total).toFixed(2).replace('.', ',')}
</span>
        
        </div>
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4">
          <a
            href="/CarrinhoDeCompra"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-full transition justify-center"
          >
            <FiArrowLeft size={20} />
            Voltar para o Carrinho
          </a>

          <a
            href={init_point}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#613d20] hover:bg-[#8a5a33] text-white px-6 py-2 text-center rounded-full"
          >
            Ir para o Mercado Pago
          </a>
        </div>
      </div>
    </>
  );
}
