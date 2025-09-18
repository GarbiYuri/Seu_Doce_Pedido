import { Head, usePage, router } from '@inertiajs/react';
import { FiX } from 'react-icons/fi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState,useEffect } from 'react';

export default function MeusPedidos() {
    const { vendas } = usePage().props;

   const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

const [showModal, setShowModal] = useState(false);
const [pedidoParaCancelar, setPedidoParaCancelar] = useState(null);
const [pedidos, setPedidos] = useState([]);


const abrirModalCancelar = (vendaId) => {
  setPedidoParaCancelar(vendaId);
  setShowModal(true);
};

const cancelarComRetorno = () => {
  router.post(
    `/meus-pedidos/${pedidoParaCancelar}/cancelar`,
    { retornar: true }, 
    { preserveScroll: true }
  );
  setShowModal(false);
};

const cancelarSemRetorno = () => {
  router.post(`/meus-pedidos/${pedidoParaCancelar}/cancelar`, 
    { retornar: false },
    {preserveScroll: true}
  );
  setShowModal(false);
};


   useEffect(() => {
  const agrupados = Object.values(
    vendas?.reduce((acc, item) => {
      const id = item.venda_id;
      if (!acc[id]) {
        acc[id] = {
          venda_id: id,
          status: item.status,
          formapagamento : item.forma_pagamento,
          payment_url: item.payment_url,
          tipo: item.tipo,
          valor: item.valor,
          created_at: item.created_at,
          produtos: [],
        };
      }

      acc[id].produtos.push({
        nome: item.produto_nome,
        preco: item.produto_preco,
        quantidade: item.produto_quantidade,
        id_promocao: item.id_promocao,
        kitquantity: item.kitquantity
      });

      return acc;
    }, {})
  );

  setPedidos(agrupados);
  if (agrupados.length > 0) {
    setPedidoSelecionado(agrupados[0]);
  }
}, [vendas]);


console.log(pedidoSelecionado);

    const coresStatus = {
        iniciado: 'bg-red-100 text-red-700',
        em_preparo: 'bg-yellow-100 text-yellow-700',
        em_entrega: 'bg-blue-100 text-blue-700',
        entregue: 'bg-green-100 text-green-700',
    };

    const formatarFormaPagamento = (formaApi) => {
  const nomes = {
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    pix: 'Pix',
    ticket: 'Boleto Bancário',
    account_money: 'Saldo Mercado Pago',
    bank_transfer: 'Transferencia Bancária',
  };


  return nomes[formaApi] || formaApi || 'Não informado';
};


    return (
        <AuthenticatedLayout>
            <Head title="Meus Pedidos" />
            {pedidos.length > 0 ? (<div> 
                  <div className="flex gap-6 px-4 py-6 max-w-6xl mx-auto">
                {/* Lista lateral */}
                <div className="w-1/3 space-y-4">
                
                    {pedidos.map((venda) => (
                        
                        <div
                            key={venda.venda_id}
                            onClick={() => setPedidoSelecionado(venda)}
                            className={`p-4 rounded-xl shadow cursor-pointer border border-pink-100 hover:bg-pink-50 transition ${
                                pedidoSelecionado?.venda_id === venda.venda_id ? 'bg-pink-50 ring-2 ring-pink-400' : ''
                            }`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-gray-800">Pedido #{venda.venda_id}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${coresStatus[venda.status] || 'bg-gray-100 text-gray-700'}`}>
                                    {venda.status.replace('_', ' ')}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">Feito em {new Date(venda.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
            ))}
                </div>

                {/* Detalhes do pedido */}
                <div className="w-2/3 bg-white p-6 rounded-xl border shadow space-y-4">
                    {pedidoSelecionado ? (
                        <>
                            <h2 className="text-xl font-bold text-pink-600 mb-2">Pedido #{pedidoSelecionado.venda_id}</h2>
                            <p className="text-sm text-gray-600 mb-1">Status: <strong>{pedidoSelecionado.status.replace('_', ' ')}</strong></p>
                            <p className="text-sm text-gray-600 mb-1">Forma de Pagamento: <strong>{formatarFormaPagamento(pedidoSelecionado?.formapagamento)}</strong></p>
                            <p className="text-sm text-gray-600 mb-1">Tipo: {pedidoSelecionado.tipo}</p>
                            <p className="text-sm text-gray-600 mb-1">Valor: R$ {parseFloat(pedidoSelecionado.valor).toFixed(2)}</p>
                            <p className="text-sm text-gray-600 mb-1">Feito em: {new Date(pedidoSelecionado.created_at).toLocaleString()}</p>

                            <p className="font-semibold text-sm mt-4">Produtos:</p>
                            <ul className="list-disc list-inside text-sm text-gray-800">
                               {pedidoSelecionado?.produtos?.map((produto, index) => (
<li key={index} className="mb-3 p-3 rounded-lg bg-gray-50 border border-gray-200 shadow-sm">
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-700 font-medium">
      {produto.quantidade}x {produto.nome}
    </span>
    <span className="text-sm font-semibold text-green-600">
      R$ {Number(produto.preco)} à Unidade
    </span>
  </div>

  {produto.id_promocao && produto.kitquantity > 1 && (
    <div className="mt-1 text-xs text-blue-600 flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
      </svg>
      Kit promocional com {produto.kitquantity} itens
    </div>
  )}
</li>

))}

                            </ul>

                        {pedidoSelecionado.status != 'pago' && (
                          
  <div className="mt-6 flex gap-2">
    <button
      onClick={() => abrirModalCancelar(pedidoSelecionado.venda_id)}
      className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded shadow"
    >
      Cancelar Pedido
      <FiX />
    </button>

    <a
      href={pedidoSelecionado.payment_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded shadow"
    >
      Realizar Pagamento
    </a>
  </div>
)}

                        </>
                    ) : (
                        <p className="text-gray-500">Selecione um pedido para ver os detalhes.</p>
                    )}
                </div>
            </div>
           {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Cancelar Pedido</h2>
      <p className="text-sm text-gray-600 mb-6">
        Deseja <strong>retornar os produtos ao carrinho</strong> ou apenas apagar o pedido?
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={cancelarComRetorno}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded"
        >
          Sim, retornar os produtos ao carrinho
        </button>

        <button
          onClick={cancelarSemRetorno}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded"
        >
          Não, apenas apagar o pedido
        </button>

        <button
          onClick={() => setShowModal(false)}
          className="w-full text-sm text-gray-500 hover:underline mt-2"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}
                </div>)  :
                (
                <div> 
               <div className="text-center py-20 text-gray-500">
  <p>Você ainda não realizou nenhuma compra.</p>
  <p className="mt-2">Quando você fizer um pedido, ele aparecerá aqui.</p>
</div>

                </div>
                )
                }
          

        </AuthenticatedLayout>
    );
}
