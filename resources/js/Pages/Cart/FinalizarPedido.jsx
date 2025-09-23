import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FinalizarPedido({ tipoPedido, setTipoPedido, informacoes, botao, setBotao, enderecoSelecionado, setEnderecoSelecionado }) {
  const camposObrigatorios = ['rua', 'numero', 'bairro', 'cidade', 'estado', 'telefone'];
  const campoObrigatorio = ['telefone'];
  const user = usePage().props.auth.user;
  const enderecosSalvos = usePage().props.auth.enderecos || [];

  const [enderecoTemporario, setEnderecoTemporario] = useState(null);

  // Função que verifica se algum campo obrigatório está faltando
  const algumCampoFaltando = () => {
    if (tipoPedido === 'entrega') {
      const enderecoAtual = enderecoSelecionado || enderecoTemporario;
      if (!enderecoAtual) return true;
      return camposObrigatorios.some(campo => {
      const valorEndereco = enderecoAtual[campo]?.toString().trim();
     const valorInformacoes = informacoes?.[campo]?.toString().trim();
      return !valorEndereco && !valorInformacoes; // retorna true se ambos estiverem vazios
});
    }
    return false;
  };

  const campofaltando = campoObrigatorio.some(
    campo => !informacoes?.[campo]?.trim()
  );

  // Atualiza botão
  useEffect(() => {
    if (user.admin) {
      setBotao(false);
    } else if ((algumCampoFaltando() && tipoPedido === 'entrega') || (campofaltando && tipoPedido === 'retirada')) {
      setBotao(true);
    } else {
      setBotao(false);
    }
  }, [informacoes, tipoPedido, enderecoSelecionado, enderecoTemporario]);

  return (
    <div className="mb-4">
      <fieldset>
        <legend className="font-semibold mb-2">Tipo de pedido:</legend>
        <label className="inline-flex items-center mr-6 cursor-pointer">
          <input
            type="radio"
            name="tipoPedido"
            value="retirada"
            checked={tipoPedido === 'retirada'}
            onChange={e => setTipoPedido(e.target.value)}
          />
          <span className="ml-2">Retirada</span>
        </label>

        <label className="inline-flex items-center cursor-pointer">
          <input
            type="radio"
            name="tipoPedido"
            value="entrega"
            checked={tipoPedido === 'entrega'}
            onChange={e => setTipoPedido(e.target.value)}
          />
          <span className="ml-2">Entrega</span>
        </label>
      </fieldset>

      {tipoPedido === 'entrega' && (
        <>
          {algumCampoFaltando() && !user.admin && (
            <div className="mt-3 p-3 border rounded bg-yellow-100 text-yellow-800">
              ⚠️ Há informações de entrega incompletas. Por favor, revise os dados abaixo. <br />
              <Link
                href="/profile#infos"
                className="mt-2 inline-block text-sm underline text-blue-600 hover:text-blue-800"
              >
                👉 Clique aqui para preencher as informações no seu perfil
              </Link>
            </div>
          )}

          <div className="mt-3 p-3 border rounded bg-gray-50 space-y-2">
            {/* Endereços salvos */}
            {enderecosSalvos.map((end, i) => (
              <label key={i} className="flex items-center border p-2 rounded cursor-pointer hover:bg-gray-100">
                <input
                  type="radio"
                  name="enderecoSelecionado"
                  checked={enderecoSelecionado?.id === end.id}
                  onChange={() => { setEnderecoSelecionado(end); setEnderecoTemporario(null); }}
                  className="w-4 h-4 text-[#613d20]"
                />
                <span className="ml-2">
                  {end.nome_perfil} {end.is_principal ? '(Principal)' : ''} 
                </span>
              </label>
            ))}

            {/* Endereço temporário */}
            {enderecoTemporario && (
              <div className="flex items-center border p-2 rounded bg-gray-100">
                <input type="radio" checked readOnly className="w-4 h-4 text-[#613d20]" />
                <span className="ml-2">
                  {enderecoTemporario.rua || 'Rua não informada'}, {enderecoTemporario.numero || ''} - {enderecoTemporario.bairro || ''}, {enderecoTemporario.cidade || ''} - {enderecoTemporario.estado || ''}
                </span>
              </div>
            )}

            {/* Botão adicionar endereço temporário 
            <button
              type="button"
              onClick={() => {
                setEnderecoTemporario({ rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '', complemento: '', telefone: informacoes?.telefone || '' });
                setEnderecoSelecionado(null);
              }}
              className="mt-2 text-sm font-semibold text-[#613d20] hover:text-[#8a5a33]"
            >
              + Usar outro endereço
            </button>
            */}
          </div>

          {/* Mostra os detalhes do endereço selecionado ou temporário */}
          <div className="mt-3 p-3 border rounded bg-gray-50">
            <p><strong>Rua:</strong> <span className="text-red-500">*</span> { (enderecoSelecionado || enderecoTemporario)?.rua || 'Não informado' }</p>
            <p><strong>Número:</strong> <span className="text-red-500">*</span> { (enderecoSelecionado || enderecoTemporario)?.numero || 'Não informado' }</p>
            <p><strong>Bairro:</strong> <span className="text-red-500">*</span> { (enderecoSelecionado || enderecoTemporario)?.bairro || 'Não informado' }</p>
            <p><strong>Cidade:</strong> <span className="text-red-500">*</span> { (enderecoSelecionado || enderecoTemporario)?.cidade || 'Não informado' }</p>
            <p><strong>Estado:</strong> <span className="text-red-500">*</span> { (enderecoSelecionado || enderecoTemporario)?.estado || 'Não informado' }</p>
            <p><strong>CEP:</strong> { (enderecoSelecionado || enderecoTemporario)?.cep || 'Não informado' }</p>
            <p><strong>Telefone:</strong> <span className="text-red-500">*</span> {  informacoes?.telefone || 'Não informado' }</p>
          </div>
        </>
      )}

     {tipoPedido === 'retirada' && (!informacoes?.telefone || campofaltando) && (
  <div className="mt-3 p-3 border rounded bg-yellow-100 text-yellow-800">
    ⚠️ Há informações para retirada incompletas. Por favor, revise os dados abaixo:
    <div className="mt-2 bg-gray-50 p-2 border rounded">
      <p><strong>Telefone:</strong> {informacoes?.telefone || 'Não informado'}</p>
      {/* Você pode adicionar outros campos que quiser exibir */}
    </div>
    <Link
      href="/profile#infos"
      className="mt-2 inline-block text-sm underline text-blue-600 hover:text-blue-800"
    >
      👉 Clique aqui para preencher os dados no seu perfil
    </Link>
  </div>
)}

    </div>
  );
}
