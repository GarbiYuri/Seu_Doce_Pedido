import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, router, useForm  } from '@inertiajs/react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useState } from 'react';

export default function DashboardAdmin() {
  const { auth, usuarios, shops } = usePage().props;
  const user = auth.user;
  
  const [horaAbertura, setHoraAbertura] = useState(shops.hora_abertura );
  const [horaFechamento, setHoraFechamento] = useState(shops.hora_fechamento );
  const [lojaAberta, setLojaAberta] = useState(Boolean(shops.loja_aberta));
  const [telefone, setTelefone] = useState(shops.telefone);


  const [search, setSearch] = useState('');

  // Função para alternar o status de Admin
  const toggleAdmin = (id) => {
    router.post(`/admin/toggle/${id}`);
  };


 const { data, setData, post, processing, errors } = useForm({
  telefone: shops.telefone || '',
});
    const Deftelefone = (e) => {
    e.preventDefault();
    post('/shop/atualizar'); 
  };

    // Função para alternar a loja aberta/fechada
  const toggleLojaAberta = () => {
    const novoStatus = !lojaAberta;
    router.post('/shop/atualizar', { loja_aberta: novoStatus }, {
      onSuccess: () => setLojaAberta(novoStatus)
    });
  };

  // Função para atualizar horários de abertura e fechamento
  const atualizarHorario = (tipo, valor) => {
    if (tipo === 'abertura') setHoraAbertura(valor);
    else if (tipo === 'fechamento') setHoraFechamento(valor);
  };

  const salvarHorarios = () => {
  router.post('/shop/atualizar', {
    hora_abertura: horaAbertura,
    hora_fechamento: horaFechamento,
  }, {
    preserveScroll: true, // mantém rolagem da página
    onSuccess: () => {
      alert('Horários atualizados com sucesso!');
      // ou use um toast bonito aqui, se tiver biblioteca
    },
    onError: (errors) => {
      alert('Erro ao salvar. Verifique os campos.');
      console.log(errors);
    },
  });
};

  // Filtra os usuários da página atual baseado no input de pesquisa
  const filteredUsers = usuarios.data.filter((usuario) => {
    const termo = search.toLowerCase();
    return (
      usuario.name.toLowerCase().includes(termo) ||
      usuario.email.toLowerCase().includes(termo)
    );
  });

   return (
    <AdminLayout>
      <Head title="Administração" />

      <section className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-3xl shadow-2xl space-y-8">
        <h1 className="text-3xl font-extrabold text-center text-pink-600 mb-6">Controle da Loja</h1>
          <div>
             <form onSubmit={Deftelefone} className="space-y-4">

      <div>
        <label htmlFor="telefone" className="block font-semibold text-gray-700">
          Novo Telefone:
        </label>
        <input
          id="telefone"
          type="text"
          value={data.telefone}
          onChange={(e) => setData('telefone', e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Ex: (19) 99620-6053"
        />
        {errors.telefone && (
          <p className="text-red-500 text-sm">{errors.telefone}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={processing}
        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded"
      >
        Salvar
      </button>
    </form>


          </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          <div>
            <p><strong>Loja aberta?</strong> {lojaAberta ? 'Sim' : 'Não'}</p>
            <button
              onClick={toggleLojaAberta}
              className={`mt-2 px-6 py-2 rounded-full font-semibold text-white ${
                lojaAberta ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {lojaAberta ? 'Fechar Loja' : 'Abrir Loja'}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div>
              <label className="block font-semibold mb-1">Hora de abertura:</label>
              <input
                type="time"
                value={horaAbertura}
                onChange={(e) => atualizarHorario('abertura', e.target.value)}
                className="border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Hora de fechamento:</label>
              <input
                type="time"
                value={horaFechamento}
                onChange={(e) => atualizarHorario('fechamento', e.target.value)}
                className="border px-3 py-2 rounded"
              />
            </div>

            <button
              onClick={salvarHorarios}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-semibold"
            >
              Salvar Horários
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mt-12 p-6 bg-white rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center text-pink-600 mb-6">
          Administração de Usuários
        </h1>

        {/* Barra de pesquisa */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Pesquisar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-auto">
            <thead className="bg-pink-600 text-white hidden md:table-header-group">
              <tr>
                <th className="py-3 px-6 text-left">Nome</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-center">Admin</th>
                <th className="py-3 px-6 text-center">Ações</th>
              </tr>
            </thead>

            <tbody className="block md:table-row-group">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className="block md:table-row border-b border-pink-100 mb-6 md:mb-0 p-4 md:p-0 rounded-lg bg-pink-50 md:bg-transparent"
                  >
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 break-words">
                      <span className="font-semibold md:hidden text-pink-600">Nome: </span>
                      {usuario.name}
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 break-words max-w-xs truncate">
                      <span className="font-semibold md:hidden text-pink-600">Email: </span>
                      {usuario.email}
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 text-center">
                      <span className="font-semibold md:hidden text-pink-600">Admin: </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold 
                          ${
                            usuario.admin
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {usuario.admin ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 text-center">
                      {usuario.id !== 1 ? (
                        <button
                          onClick={() => toggleAdmin(usuario.id)}
                          className={`w-full md:w-auto px-5 py-2 rounded-full text-sm font-semibold transition-colors 
                          ${
                            usuario.admin
                              ? 'bg-red-500 hover:bg-red-600'
                              : 'bg-green-500 hover:bg-green-600'
                          } text-white`}
                        >
                          {usuario.admin ? 'Remover Admin' : 'Tornar Admin'}
                        </button>
                      ) : (
                        <span className="text-gray-400 italic text-sm md:text-base">
                          Impossível Alterar
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="block md:table-row p-4">
                  <td colSpan={4} className="text-center text-gray-500 py-6">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="flex justify-center mt-8 gap-4">
          {usuarios.prev_page_url && (
            <a
              href={usuarios.prev_page_url}
              className="flex items-center gap-2 px-5 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 text-sm font-medium"
            >
              <FiArrowLeft size={18} />
              Anterior
            </a>
          )}
          {usuarios.next_page_url && (
            <a
              href={usuarios.next_page_url}
              className="flex items-center gap-2 px-5 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 text-sm font-medium"
            >
              Próximo
              <FiArrowRight size={18} />
            </a>
          )}
        </div>
      </section>
    </AdminLayout>
  ); 
}
