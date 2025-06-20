<?php
use App\Http\Middleware\CheckIfAdmin;
use App\Http\Middleware\EmailVerifiedAt;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartProductController;
use App\Http\Controllers\CartWLController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\MercadoPagoController;
use App\Http\Controllers\InformacoesPessoaisController;


// Area de Testes 


// Area de Testes 

Route::post('/cartwl/add', [CartWLController::class, 'store']);
Route::get('CarrinhoWL', [CartWLController::class, 'index']);
Route::post('/update', [CartWLController::class, 'update']);
Route::post('/remove', [CartWLController::class, 'destroy']);

//Rotas do Checkout

Route::get('/checkout.success', function () {
            return Inertia::render('Checkout/success');
        })->name('checkout.success');

Route::get('/checkout.failure', function () {
            return Inertia::render('Checkout/failure');
        })->name('checkout.failure');

Route::get('/checkout.pending', function () {
            return Inertia::render('Checkout/pending');
        })->name('checkout.pending');

Route::get('/CheckoutRedirect', function () {
        return Inertia::render('Checkout/CheckoutRedirect');
})->name('CheckoutRedirect');

//Middleware de Usuario Autenticado
Route::middleware('auth')->group(function () {
 
    // Rota para a verificação do email
 Route::get('/VerifyEmail', function () {
    return Inertia::render('Auth/VerifyEmail');
})->name('VerifyEmail'); 

//Rota de Informações Pessoais

Route::resource('informacoes', InformacoesPessoaisController::class);


// As rotas de administração e categorias ficam dentro do middleware de autenticação e do middleware CheckIfAdmin
//Route::middleware(EmailVerifiedAt::class)->group(function () {
    //Middleware para Somente Admins
    Route::middleware([CheckIfAdmin::class])->group(function () {
        // Rota para a administração do painel
        Route::get('/Administracao', function () {
            return Inertia::render('Admin/DashboardAdmin');
        })->name('Administracao');

        // Rota para os produtos
        Route::get('/Produtos', function () {
            return Inertia::render('Admin/Product/Product');
        })->name('Produtos');

        // Rota para as categorias
        Route::get('/Categorias', function () {
            return Inertia::render('Admin/Category/Categories');
        })->name('Categorias');


        // Rota para alternar status de admin de usuário
        Route::post('/admin/toggle/{id}', [AdminController::class, 'toggleAdmin'])
            ->name('admin.toggle');

        // Rota para as categorias, com as funcionalidades do CRUD
        Route::resource('categories', CategoryController::class);

        // Rota para os produtos, com as funcionalidades do CRUD
        Route::resource('products', ProductController::class);


        Route::get('/Vendas', function(){
            return Inertia::render('Admin/Vendas/Vendas');
        })->name('Vendas');

        // Finaliza CheckifAdmin
    });



    // Rota para o dashboard do usuário
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');    

      // Rota Carts
      Route::get('/Carrinho', function () {
        return Inertia::render('Cart/Cart');
    })->name('Carrinho');

    Route::get('/CarrinhoDeCompra', [CartProductController::class, 'index']);
    Route::post('/cart/add', [CartProductController::class, 'store']);
    Route::post('/updateC', [CartProductController::class, 'update']);
    Route::post('/deleteC', [CartProductController::class, 'destroy']);
    

    // Rotas de perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //Finaliza Auth
// });
// Finaliza EmailVerifiedAt
});

//Rotas do Banner


Route::resource('banners', BannerController::class);
Route::delete('/banners/{id}', [BannerController::class, 'destroy'])->name('banners.destroy');

//Rotas do Shop

Route::get('/shop/banner', [ShopController::class, 'index']); // para carregar os banners
Route::post('/shop/banner', [ShopController::class, 'update']); // para alterar o banner

Route::match(['get', 'post'], '/pagar', [MercadoPagoController::class, 'pagar'])->name('pagar');

Route::get('/pagamento/sucesso', fn() => 'Pagamento aprovado!')->name('pagamento.sucesso');
Route::get('/pagamento/falha', fn() => 'Pagamento falhou!')->name('pagamento.falha');
Route::get('/pagamento/pendente', fn() => 'Pagamento pendente!')->name('pagamento.pendente');



require __DIR__.'/auth.php';

