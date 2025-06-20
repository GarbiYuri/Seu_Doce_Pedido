import { useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function PersonalInfoForm() {
  const informacoes = usePage().props.auth.informacoes;

  const { data, setData, put, processing, recentlySuccessful } = useForm({
    rua: informacoes?.rua || '',
    numero: informacoes?.numero || '',
    bairro: informacoes?.bairro || '',
    cidade: informacoes?.cidade || '',
    estado: informacoes?.estado || '',
    cep: informacoes?.cep || '',
    telefone: informacoes?.telefone || '',
    cpf: informacoes?.cpf || '',
    complemento: informacoes?.complemento || '',
  });

  // Função para buscar endereço pelo CEP
  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return; // Validação simples

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const endereco = await response.json();

      if (!endereco.erro) {
        setData('rua', endereco.logradouro || '');
        setData('bairro', endereco.bairro || '');
        setData('cidade', endereco.localidade || '');
        setData('estado', endereco.uf || '');
      } else {
        setData('rua', '');
        setData('bairro', '');
        setData('cidade', '');
        setData('estado', '');
      }
    } catch (error) {
      
    }
  };

  // Quando o campo CEP mudar, chama buscarCep automaticamente
  useEffect(() => {
    if (data.cep.length === 9 || data.cep.length === 8) { // pode ajustar para aceitar 8 ou 9 (com traço)
      buscarCep(data.cep);
    }
  }, [data.cep]);

  const submit = (e) => {
    e.preventDefault();
    put(route('informacoes.update', informacoes.id));
  };

  return (
    <section className="mt-6">
      <header>
        <h2 className="text-lg font-medium text-gray-900">Informações Pessoais</h2>
        <p className="mt-1 text-sm text-gray-600">
          Adicione seu endereço, telefone e CPF para facilitar o processo de entrega.
        </p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            placeholder="CEP"
            value={data.cep}
            onChange={e => setData('cep', e.target.value)}
            className="border rounded p-2"
          />
          <input
            placeholder="Rua"
            value={data.rua}
            onChange={e => setData('rua', e.target.value)}
            className="border rounded p-2 bg-gray-100 cursor-not-allowed"
            readOnly 
          />
          <input
            placeholder="Número"
            value={data.numero}
            onChange={e => setData('numero', e.target.value)}
            className="border rounded p-2"
          />
          <input
            placeholder="Bairro"
            value={data.bairro}
            onChange={e => setData('bairro', e.target.value)}
            className="border rounded p-2 bg-gray-100 cursor-not-allowed"
            readOnly 
          />
          <input
            placeholder="Cidade"
            value={data.cidade}
            onChange={e => setData('cidade', e.target.value)}
            className="border rounded p-2 bg-gray-100 cursor-not-allowed"
            readOnly 
          />
          <input
            placeholder="Estado"
            value={data.estado}
            onChange={e => setData('estado', e.target.value)}
            className="border rounded p-2 bg-gray-100 cursor-not-allowed"
            readOnly 
          />
          <input
            placeholder="Telefone"
            value={data.telefone}
            onChange={e => setData('telefone', e.target.value)}
            className="border rounded p-2"
          />
          <input
            placeholder="CPF"
            value={data.cpf}
            onChange={e => setData('cpf', e.target.value)}
            className="border rounded p-2"
          />
          <input
            placeholder="Complemento"
            value={data.complemento}
            onChange={e => setData('complemento', e.target.value)}
            className="border rounded p-2"
          />
        </div>

        <button
          type="submit"
          disabled={processing}
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
        >
          Salvar
        </button>

        {recentlySuccessful && <p className="text-green-600 text-sm mt-2">Informações salvas com sucesso!</p>}
      </form>
    </section>
  );
}
