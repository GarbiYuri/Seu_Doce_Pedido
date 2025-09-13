import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';


export default function Sobre() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Banner / Imagem de capa */}
        <div className="w-full h-64 rounded-2xl overflow-hidden mb-12 shadow-lg">
          <img
            src="/images/sobre-banner.jpg"
            alt="Nossa loja"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Título */}
        <h1 className="text-5xl font-bold text-center mb-6 text-[#613d20]">
          Nossa História
        </h1>

        {/* Texto principal */}
        <p className="text-lg text-gray-700 leading-relaxed text-center mb-10 max-w-3xl mx-auto">
          A nossa loja nasceu com a ideia de trazer qualidade, carinho e dedicação
          em cada produto. Desde o início, buscamos oferecer mais do que apenas
          doces, mas sim experiências que ficam na memória. ❤
        </p>

        {/* Galeria de imagens */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <img
            src="/images/loja1.jpg"
            alt="Foto 1"
            className="rounded-xl object-cover h-60 w-full shadow-md hover:scale-105 transition-transform duration-300"
          />
          <img
            src="/images/loja2.jpg"
            alt="Foto 2"
            className="rounded-xl object-cover h-60 w-full shadow-md hover:scale-105 transition-transform duration-300"
          />
          <img
            src="/images/loja3.jpg"
            alt="Foto 3"
            className="rounded-xl object-cover h-60 w-full shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Seção de contato */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#fdfdfd] shadow-lg rounded-2xl p-6 text-center border-t-4 border-[#613d20] hover:shadow-xl transition-shadow duration-300">
            <Mail className="mx-auto w-10 h-10 text-[#8a5a33] mb-3" />
            <h2 className="font-semibold text-xl text-[#613d20]">E-mail</h2>
            <p className="text-gray-600">contato@sualoja.com</p>
          </div>

          <div className="bg-[#fdfdfd] shadow-lg rounded-2xl p-6 text-center border-t-4 border-[#8a5a33] hover:shadow-xl transition-shadow duration-300">
            <Phone className="mx-auto w-10 h-10 text-[#bc845b] mb-3" />
            <h2 className="font-semibold text-xl text-[#613d20]">Telefone</h2>
            <p className="text-gray-600">(11) 99999-9999</p>
          </div>

          <div className="bg-[#fdfdfd] shadow-lg rounded-2xl p-6 text-center border-t-4 border-[#bc845b] hover:shadow-xl transition-shadow duration-300">
            <MapPin className="mx-auto w-10 h-10 text-[#8a5a33] mb-3" />
            <h2 className="font-semibold text-xl text-[#613d20]">Endereço</h2>
            <p className="text-gray-600">Rua Exemplo, 123 - São Paulo</p>
          </div>
        </div>

        {/* Botão de call-to-action */}
        <div className="text-center mt-12">
          <a
            href="/contato"
            className="inline-block bg-[#8a5a33] text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-[#613d20] transition-colors"
          >
            Fale Conosco
          </a>
        </div>

        {/* Rodapé */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Sua Loja - Todos os direitos reservados
          </p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

