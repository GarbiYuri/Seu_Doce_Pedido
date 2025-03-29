<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Category;

// Isso é a MiddleWare do Admin, sempre que um Admin estiver em sua tela, passa por aqui
//Confie em mim... É Seguro (Sem SQL Injection :/ )
class CheckIfAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Verifica se o usuário está autenticado e se é um administrador
        if (!$request->user() || !$request->user()->admin) {
            // Redireciona para a página inicial ou uma página de erro caso não seja admin
            return abort(403, 'Acesso negado.');
        }
        $categories = Category::all(); // Busca Todas as Categorias
        $usuarios = User::paginate(5); // Busca todos os usuários
        // Compartilha os dados com todas as páginas do Inertia
         Inertia::share([
            'categories' => $categories,
            'usuarios' => $usuarios
        ]);
        
    
        return $next($request);
    }
}
