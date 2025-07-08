import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import { FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Welcome({ products, categories }) {
  const shop = usePage().props.shop;  
  const banner = shop.banner;


  // Estados para busca e filtro
  const [searchText, setSearchText] = useState('');
  const [filterField, setFilterField] = useState('all');
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  // Estado para controle do botão voltar ao topo
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Estado para armazenar o texto de cada botão "Adicionar ao carrinho"
  const [buttonTexts, setButtonTexts] = useState({});


  // Monitorar scroll para mostrar/ocultar botão voltar ao topo
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 100) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Limpar listener quando componente desmontar
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Função para rolar a página suavemente até o topo
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para adicionar produto ao carrinho (session / cache)
  const addToCart = (productId) => {
    router.post("/cartwl/add", { product_id: productId, quantity: 1 }, {
      preserveScroll: true,
      onSuccess: () => {
        setButtonTexts((prev) => ({ ...prev, [productId]: "Adicionado!" }));
      },
      onError: (errors) => {
        console.error(errors);
        alert("Erro ao adicionar o produto ao carrinho.");
        setButtonTexts((prev) => ({ ...prev, [productId]: "Adicionar ao Carrinho" }));
      },
    });

    // Volta ao texto original após 800ms
    setTimeout(() => {
      setButtonTexts((prev) => ({ ...prev, [productId]: "Adicionar ao Carrinho" }));
    }, 800);
  };

  // Filtrar produtos conforme texto e filtro
  const filteredProducts = products.filter(product => {
    const priceStr = product.price.toString();
    const match = (field) => field.toLowerCase().includes(searchText.toLowerCase());

    if (!searchText) return true;

    switch (filterField) {
      case 'category':
        const cat = categories.find(c => c.id === product.id_categoria);
        return cat && match(cat.name);
      case 'name':
        return match(product.name);
      case 'description':
        return match(product.descricao);
      case 'price':
        return priceStr.includes(searchText);
      case 'all':
      default:
        const catName = categories.find(c => c.id === product.id_categoria)?.name || '';
        return (
          match(product.name) ||
          match(product.descricao) ||
          match(catName) ||
          priceStr.includes(searchText)
        );
    }
  });

   const carouselsRef = useRef({});
 
  const handleLeftClick = (categoryId) => {
   const el = carouselsRef.current[categoryId]?.current;
   if (el) el.scrollLeft -= 200;
 };
 
 const handleRightClick = (categoryId) => {
   const el = carouselsRef.current[categoryId]?.current;
   if (el) el.scrollLeft += 200;
 };
   

    const categoriaRef = useRef(null);
  
    const scrollLeft = () => {
      categoriaRef.current.scrollLeft -= 200;
    };
  
    const scrollRight = () => {
      categoriaRef.current.scrollLeft += 200;
    };
  

  return (
    <AuthenticatedLayout>
      <Head title="Bem-vindo" />

      <div className="relative w-full mt-10">
        {banner ? (
          <img
            src={banner.imagem}
            alt={banner.nome}
              className="w-full max-h-[px] object-contain rounded shadow-md mx-auto"
          />
        ) : (
          <div></div>
        )}
      </div>

<div className="relative w-full">
      <h2 className="text-center text-xl font-bold text-gray-800 mb-6 mt-10">ESCOLHA POR CATEGORIA</h2>

      <div className="flex items-center justify-between px-4">
        {/* Botão esquerdo */}
        <button
          onClick={scrollLeft}
          className="p-2 bg-white rounded-full shadow-md border border-gray-300 hover:bg-gray-100 transition"
        >
          <FiChevronLeft className="text-pink-600" size={24} />
        </button>

        {/* Carrossel */}
        <div
          ref={categoriaRef}
          className="flex items-center gap-4 overflow-x-auto px-2 py-2 hide-scrollbar scroll-smooth"
        >
        
          {categories.map((category) => {
              const filteredCategoryProducts = filteredProducts.filter(
         p => p.id_categoria === category.id
       );
     
       if (filteredCategoryProducts.length === 0) return null;

        return (
         <div
              key={category.id}
              className="flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105 flex-shrink-0"
              onClick={() => {
                const el = document.getElementById(`categoria-${category.id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="w-24 h-24 rounded-full border-2 border-pink-500 overflow-hidden flex items-center justify-center bg-white shadow">
                {category.imagem ? (
                  <img
                    src={`/imagens/categorias/${category.imagem}`}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-500">Sem imagem</span>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-700">{category.name.toUpperCase()}</p>
            </div>
       );
           
})}
        </div>

        {/* Botão direito */}
        <button
          onClick={scrollRight}
          className="p-2 bg-white rounded-full shadow-md border border-gray-300 hover:bg-gray-100 transition"
        >
          <FiChevronRight className="text-pink-600" size={24} />
        </button>
      </div>
    </div>

      {/* Barra de pesquisa e filtro */}
      <div className="flex items-center gap-2 my-6 max-w-md mx-auto relative">
        <input
          type="text"
          placeholder="Pesquisar produtos..."
          className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <button
          onClick={() => setShowFilterOptions(!showFilterOptions)}
          className="bg-pink-500 text-white p-2 rounded-md hover:bg-pink-600"
          title="Filtrar por"
        >
          <FiFilter size={20} />
        </button>

        {showFilterOptions && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded shadow-md z-50 w-40">
            <ul>
              {[
                { label: 'Todos', value: 'all' },
                { label: 'Categoria', value: 'category' },
                { label: 'Nome', value: 'name' },
                { label: 'Descrição', value: 'description' },
                { label: 'Preço', value: 'price' },
              ].map(option => (
                <li
                  key={option.value}
                  onClick={() => {
                    setFilterField(option.value);
                    setShowFilterOptions(false);
                  }}
                  className={`cursor-pointer px-4 py-2 hover:bg-pink-100 ${
                    filterField === option.value ? 'font-bold bg-pink-200' : ''
                  }`}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Produtos filtrados agrupados por categoria */}
      {categories.map((category, index) => {
       const filteredCategoryProducts = filteredProducts.filter(
         p => p.id_categoria === category.id
       );
     
       if (filteredCategoryProducts.length === 0) return null;
     
      if (!carouselsRef.current[category.id]) {
         carouselsRef.current[category.id] = React.createRef();
       }
     
       return (
         <div key={category.id} className="mb-20 relative" id={`categoria-${category.id}`}>
     
           <h2 className="text-2xl font-semibold text-pink-700 mb-6 pb-2 px-4">
             {category.name.toUpperCase()}
           </h2>
            {/* Botão Esquerdo */}
         <button
             onClick={() => handleLeftClick(category.id)}
             className="lg:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow-md rounded-full p-2 hover:bg-gray-100"
           >
             <FiChevronLeft size={24} />
           </button>
         
           {/* Carrossel com drag */}
           <div className="overflow-x-auto px-8 hide-scrollbar" ref={carouselsRef.current[category.id]}>
            <div
               key={category.id}
               className="flex gap-6 snap-x snap-mandatory pb-4 scroll-smooth cursor-grab active:cursor-grabbing"
             >
               {filteredCategoryProducts.map(product => (
                 <div
                   key={product.id}
                   className="min-w-[260px] max-w-[280px] bg-white rounded-xl p-4 flex-shrink-0 flex flex-col items-center text-center shadow-md snap-center transition-transform hover:scale-[1.03]"
                 >
                   <img
                     src={`/imagem/${product.imagem}`}
                     alt={`Imagem de ${product.name}`}
                     className="w-44 h-44 object-contain rounded-md mb-4"
                   />
     
                   <h3 className="text-lg font-bold text-gray-900 mb-1 truncate w-full">
                     {product.name}
                   </h3>
     
                   <p className="text-sm text-gray-500 mb-3 h-12">{product.descricao}</p>
     
                   <p className="text-xl font-extrabold text-gray-900 mb-4">
                     R${Number(product.price).toFixed(2).replace('.', ',')}
                   </p>
     
                   <button
                     className={`w-full py-2 rounded-full font-semibold shadow-md transition-colors duration-300 ${
                       buttonTexts[product.id] === 'Adicionado!'
                         ? 'bg-green-500 hover:bg-green-600 cursor-default'
                         : 'bg-pink-600 hover:bg-pink-700'
                     } text-white`}
                     onClick={() => addToCart(product.id)}
                     disabled={buttonTexts[product.id] === 'Adicionado!'}
                   >
                     {buttonTexts[product.id] || 'Adicionar ao carrinho'}
                   </button>
                 </div>
               ))}
             </div>
           </div>
                      {/* Botão Direito */}
           
           
          <button
             onClick={() => handleRightClick(category.id)}
             className="lg:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow-md rounded-full p-2 hover:bg-gray-100"
           >
             <FiChevronRight size={24} />
           </button>
         </div>
       );
     })}
   
      {/* Botão voltar ao topo */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-pink-600 text-white rounded-full shadow-lg hover:bg-pink-700 transition"
          title="Voltar ao topo"
          style={{ zIndex: 1000 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </AuthenticatedLayout>
  );
}
