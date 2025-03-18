<?php
use App\Http\Middleware\CheckIfAdmin;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::middleware('auth')->group(function () {
    Route::middleware([CheckIfAdmin::class])->group(function (){
        Route::get('/Administracao', function () {
            return Inertia::render('Admin/DashboardAdmin');
        })->name('Administracao');
        Route::get('/Produtos', function (){
            return Inertia::render('Admin/Product/Product');
        })->name('Produtos');
        Route::get('/Categorias', function (){
            return Inertia::render('Admin/Category/Categories');
        })->name('Categorias');
    });
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
