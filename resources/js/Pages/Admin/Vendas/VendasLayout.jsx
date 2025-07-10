import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { FiArrowRight } from 'react-icons/fi';

export default function VendasLayout() {
    const { vendas } = usePage().props;

    console.log(vendas);

    const avancarStatus = (vendaId, statusAtual) => {
        const proximosStatus = {
            iniciado: 'em_preparo',
            em_preparo: 'em_entrega',
            em_entrega: 'entregue',
        };

        const proximo = proximosStatus[statusAtual];
        if (!proximo) return;

        router.post(`/admin/vendas/${vendaId}/status`, {
            status: proximo,
        });
    };

    return (
        <AdminLayout>
            <Head title="Pedidos" />
            
            <h1 className="text-2xl font-bold mb-6">Painel de Pedidos</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendas.map(venda => (
                  
                    <div key={venda.id} className="bg-white shadow rounded-xl p-4 border">
                      
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold">Pedido #{venda.id}</h2>
                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {venda.status.replace('_', ' ')}
                            </span>
                        </div>

                        <div className="mb-2 text-sm text-gray-600">
                            Tipo: <strong>{venda.tipo}</strong><br />
                            Valor: R$ {venda.valor}
                        </div>

                        <div className="mb-2">
                            <p className="text-sm text-gray-700 font-semibold">Produtos:</p>
                            <ul className="list-disc list-inside text-sm text-gray-800">
                                {venda.produtos.map(produto => (
                                    <li key={produto.id}>
                                        {produto.quantity}un - {produto.nome} - R${produto.preco}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-2">
                            <p className="text-sm text-gray-700 font-semibold">Cliente:</p>
                            <p className="text-sm">Nome: {venda.nome}</p>
                            <p className="text-sm">{venda.email}</p>
                            <p className="text-sm">{venda.telefone}</p>
                            {venda.tipo === 'entrega' && (
                              <div>
                                <br />
                                <p className='font-semibold'>Endereço:</p>
                                <p className="text-sm">{venda.rua}, {venda.numero}, {venda.endereco}, {venda.cep}</p>
                            </div>
                            )}
                        </div>

                       

                        {venda.status !== 'entregue' && (
                            <button
                                onClick={() => avancarStatus(venda.id, venda.status)}
                                className="mt-3 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded transition"
                            >
                                Avançar status
                                <FiArrowRight />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
