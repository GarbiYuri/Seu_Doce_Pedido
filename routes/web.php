<?php
use App\Http\Middleware\CheckIfAdmin;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartProductController;
use App\Http\Controllers\CartWLController;




Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::post('/cartwl/add', [CartWLController::class, 'store']);
Route::get('CarrinhoWL', [CartWLController::class, 'index']);
Route::post('/update', [CartWLController::class, 'update']);
Route::post('/remove', [CartWLController::class, 'destroy']);


// As rotas de administração e categorias ficam dentro do middleware de autenticação e do middleware CheckIfAdmin
Route::middleware('auth')->group(function () {
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

    });

    // Rota para o dashboard do usuário
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');    

    // Rota para a verificação do email
    Route::get('/VerifyEmail', function () {
        return Inertia::render('Auth/VerifyEmail');
    })->name('VerifyEmail'); 


      // Rota Carts
      Route::get('/Carrinho', function () {
        return Inertia::render('Cart/Cart');
    })->name('Carrinho');

    Route::get('/CarrinhoDeCompra', [CartProductController::class, 'index']);
    Route::post('/cart/add', [CartProductController::class, 'store']);
    

    // Rotas de perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

});

require __DIR__.'/auth.php';

