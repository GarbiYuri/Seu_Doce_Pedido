
import { Link } from '@inertiajs/react';

export default function FinalizarPedido({ tipoPedido, setTipoPedido, informacoes }) {
  const camposObrigatorios = ['rua', 'numero', 'bairro', 'cidade', 'estado', 'telefone'];

// Retorna true se algum estiver vazio
const algumCampoFaltando = camposObrigatorios.some(
  campo => !informacoes?.[campo]?.trim()
);

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
    {algumCampoFaltando ? (
     <div className="mt-3 p-3 border rounded bg-yellow-100 text-yellow-800">
  ⚠️ Há informações de entrega incompletas. Por favor, revise os dados abaixo. <br />
  <Link
    href="/profile"
    className="mt-2 inline-block text-sm underline text-blue-600 hover:text-blue-800"
  >
    👉 Clique aqui para preencher as informações no seu perfil
  </Link>
</div>
    ) : null}

    <div className="mt-3 p-3 border rounded bg-gray-50">
      <p><strong>Rua:</strong> {informacoes?.rua || 'Não informado'}</p>
      <p><strong>Número:</strong> {informacoes?.numero || 'Não informado'}</p>
      <p><strong>Bairro:</strong> {informacoes?.bairro || 'Não informado'}</p>
      <p><strong>Cidade:</strong> {informacoes?.cidade || 'Não informado'}</p>
      <p><strong>Estado:</strong> {informacoes?.estado || 'Não informado'}</p>
      <p><strong>CEP:</strong> {informacoes?.cep || 'Não informado'}</p>
      <p><strong>Telefone:</strong> {informacoes?.telefone || 'Não informado'}</p>
    </div>
  </>
)}

    </div>
  );
}
