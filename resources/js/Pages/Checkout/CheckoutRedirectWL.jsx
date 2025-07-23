import { Head, usePage } from '@inertiajs/react';
import { FiArrowLeft } from 'react-icons/fi';

export default function CheckoutRedirect() {
  const { init_point, cartItems, userAddress, isPickup, frete, dadosEntrega } = usePage().props;


  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <Head title="Confirmar Pedido" />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">Confirme seu pedido</h1>

        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Seu carrinho está vazio.</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                
                <li key={item.id} className="flex items-center justify-between border-b py-3">
                  
                  <div className="flex items-center gap-4">
                    <img src={`${item.imagem}`} alt={item.name} className="w-16 h-16 object-contain rounded" />
                    
                    <div>
                      <h2 className="font-semibold text-gray-800">{item.name}</h2>
                      <p className="text-sm text-gray-600">
                        Quantidade: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-right font-bold text-pink-600">
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-3 text-pink-600">Suas Informações</h2>
          <p>Nome: {dadosEntrega.nome}</p>
          <p>Telefone: {dadosEntrega.telefone ? dadosEntrega.telefone : ' Não Informado'}</p>
          <p><strong>CPF:{dadosEntrega.cpf ? dadosEntrega.cpf : ' Não Informado'}</strong> </p>
          {isPickup ? (
            <p className="text-green-600 font-semibold mt-2">🏬 Retirada na loja (sem taxa de entrega)</p>
          ) : (
            <>
              <p className="mt-2"><strong>Endereço:</strong></p>
              {userAddress ? (
                <>
                  <p>{dadosEntrega.rua}, {dadosEntrega.numero}</p>
                  <p>{dadosEntrega.bairro} - {dadosEntrega.cidade}/{dadosEntrega.estado}</p>
                  <p>CEP: {dadosEntrega.cep}</p>
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
          <span className="text-pink-600">R$ 0,00</span>
        
        </div>
           </>
          ) : (
            <>
             <div className="flex justify-between items-center text-lg font-bold text-gray-800 mb-6">
          <span>Frete:</span>
          <span className="text-pink-600">R$ {frete.toFixed(2).replace('.', ',')}</span>
        
        </div>
            </>
          )}
          <div className="flex justify-between items-center text-lg font-bold text-gray-800 mb-6">
          <span>Total:</span>
          <span className="text-pink-600">R$ 
  {( frete + total).toFixed(2).replace('.', ',')}
</span>
        
        </div>
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4">
          <a
            href="/CarrinhoWL"
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
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 text-center rounded-full"
          >
            Ir para o Mercado Pago
          </a>
        </div>
      </div>
    </>
  );
}
