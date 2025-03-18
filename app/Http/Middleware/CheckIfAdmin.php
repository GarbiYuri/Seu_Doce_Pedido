<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckIfAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Verifica se o usuário está autenticado e se é um administrador
        if (!$request->user() || !$request->user()->admin) {
            // Redireciona para a página inicial ou uma página de erro caso não seja admin
            return redirect('/');
        }

        return $next($request);
    }
}
