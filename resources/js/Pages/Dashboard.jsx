import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import Modal from '@/Components/Modal'; 
import CreateBannerForm from '@/Pages/Banner/CreateBanner'; 
import { FiEdit, FiPlus, FiTrash, FiFilter,  FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Dashboard({ products, categories, bannerss }) {
  const [showSelectBannerModal, setShowSelectBannerModal] = useState(false);
  const [showCreateBannerModal, setShowCreateBannerModal] = useState(false);
  const [buttonTexts, setButtonTexts] = useState({});
  const [banners, setBanners] = useState([]);
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterField, setFilterField] = useState('all');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const user = usePage().props.auth.user;
  const shop = usePage().props.shop;  
  const banner = shop.banner;
  const Inertia = router;
  





  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (Id_Product) => {
    router.post("/cart/add", { Id_Product },  {
      preserveScroll: true,
      onSuccess: () => {
        setButtonTexts(prev => ({ ...prev, [Id_Product]: "Adicionado!" }));
        setTimeout(() => {
          setButtonTexts(prev => ({ ...prev, [Id_Product]: "Adicionar ao Carrinho" }));
        }, 800);
      },
      onError: () => {
        alert("Erro ao adicionar o produto ao carrinho.");
      },
    });
  };

  const fetchBanners = async () => {
    const res = await axios.get('/shop');
    setBanners(res.data.banners);
  };

  const updateBanner = async () => {
    const formData = new FormData();
    formData.append('id_banner', selectedBannerId);
    router.post('/shop/banner', formData, { forceFormData: true });
    Inertia.reload();
  };

  const deleteBanner = (id) => {
    if (!confirm("Tem certeza que deseja excluir este banner?")) return;
    router.delete(`/banners/${id}`, { onSuccess: fetchBanners });
  };

  const filteredProducts = products.filter(product => {
    const match = (field) => field.toLowerCase().includes(searchText.toLowerCase());
    const catName = categories.find(c => c.id === product.id_categoria)?.name || '';
    const priceStr = product.price.toString();

    if (!searchText) return true;

    switch (filterField) {
      case 'category': return match(catName);
      case 'name': return match(product.name);
      case 'description': return match(product.descricao);
      case 'price': return priceStr.includes(searchText);
      default: return match(product.name) || match(product.descricao) || match(catName) || priceStr.includes(searchText);
    }
  });

  const carousel = useRef(null);

   const handleLeftClick = (e) =>{
    e.preventDefault();
    carousel.current.scrollLeft -= carousel.current.offsetWidth;
  }
  const handleRightClick = (e) =>{
    e.preventDefault();
     carousel.current.scrollLeft += carousel.current.offsetWidth;
  }
  const categoriaRef = useRef(null);

  const scrollLeft = () => {
    categoriaRef.current.scrollLeft -= 200;
  };

  const scrollRight = () => {
    categoriaRef.current.scrollLeft += 200;
  };

  return (
    <AuthenticatedLayout>
      <Head title="DashBoard" />

      <div className="relative w-full mt-10">
        {banner ? (
          <>
            <img src={banner.imagem} alt={banner.nome} className="w-full max-h-[px] object-contain rounded shadow-md mx-auto" />
            {user?.admin === 1 && (
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button onClick={() => { fetchBanners(); setShowSelectBannerModal(true); }} className="bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700">
                  <FiEdit size={20} />
                </button>
                <button onClick={() => setShowCreateBannerModal(true)} className="bg-green-600 text-white p-2 rounded-full shadow hover:bg-green-700">
                  <FiPlus size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 italic">Nenhum banner selecionado</p>
        )}

        {showSelectBannerModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
            <div className="relative bg-white p-6 rounded-lg w-[90%] max-w-md max-h-[80vh] overflow-y-auto">
              <button onClick={() => setShowSelectBannerModal(false)} className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl font-bold">&times;</button>
              <h3 className="text-lg font-bold mb-4">Selecione um banner</h3>
              <div className="overflow-x-auto mb-4">
                <div className="flex gap-4 px-1 py-2 w-full">
                  {bannerss.map(b => (
                    <div key={b.id} className={`relative min-w-[160px] max-w-[160px] cursor-pointer border rounded-lg p-2 transition hover:shadow-lg ${selectedBannerId === b.id ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-300'}`}>
                      {b.id !== banner.id && (
                        <button onClick={(e) => { e.stopPropagation(); deleteBanner(b.id); }} className="absolute top-1 right-1 text-red-600 hover:text-red-800 z-10">
                          <FiTrash size={18} />
                        </button>
                      )}
                      <div onClick={() => setSelectedBannerId(b.id)}>
                        <img src={b.imagem} alt={b.nome} className="w-full h-28 object-cover rounded" />
                        <h4 className="mt-2 text-sm text-center font-semibold truncate">{b.nome}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowSelectBannerModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">Cancelar</button>
                <button onClick={updateBanner} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Salvar</button>
              </div>
            </div>
          </div>
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
          {categories.map((category) => (
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
          ))}
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

      <div className="flex items-center gap-2 my-6 max-w-md mx-auto relative">
        <input type="text" placeholder="Pesquisar produtos..." className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" value={searchText} onChange={e => setSearchText(e.target.value)} />
        <button onClick={() => setShowFilterOptions(!showFilterOptions)} className="bg-pink-500 text-white p-2 rounded-md hover:bg-pink-600">
          <FiFilter size={20} />
        </button>
        {showFilterOptions && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded shadow-md z-50 w-40">
            <ul>
              {[{ label: 'Todos', value: 'all' }, { label: 'Categoria', value: 'category' }, { label: 'Nome', value: 'name' }, { label: 'Descrição', value: 'description' }, { label: 'Preço', value: 'price' }].map(option => (
                <li key={option.value} onClick={() => { setFilterField(option.value); setShowFilterOptions(false); }} className={`cursor-pointer px-4 py-2 hover:bg-pink-100 ${filterField === option.value ? 'font-bold bg-pink-200' : ''}`}>
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
     {categories.map((category, index) => {
  const filteredCategoryProducts = filteredProducts.filter(
    p => p.id_categoria === category.id
  );

  if (filteredCategoryProducts.length === 0) return null;


  return (
    <div key={category.id} className="mb-20 relative" id={`categoria-${category.id}`}>

      <h2 className="text-2xl font-semibold text-pink-700 mb-6 pb-2 px-4">
        {category.name.toUpperCase()}
      </h2>

      {/* Carrossel com drag */}
      <div className="overflow-x-auto px-8 hide-scrollbar" ref={carousel}>
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
                 {/* Botões de navegação */}
      <button
        onClick={handleLeftClick}
        className=" lg:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow-md rounded-full p-2 hover:bg-gray-100"
      >
        <FiChevronLeft size={24} />
      </button>
      
      <button
        onClick={handleRightClick}
        className=" lg:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow-md rounded-full p-2 hover:bg-gray-100"
      >
        <FiChevronRight size={24} />
      </button>
    </div>
  );
})}


      <Modal show={showCreateBannerModal} onClose={() => setShowCreateBannerModal(false)}>
        <CreateBannerForm closeModal={() => setShowCreateBannerModal(false)} />
      </Modal>

      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 p-3 bg-pink-600 text-white rounded-full shadow-lg hover:bg-pink-700 transition" title="Voltar ao topo" style={{ zIndex: 1000 }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </AuthenticatedLayout>
  );
}
