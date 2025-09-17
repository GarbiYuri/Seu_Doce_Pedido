<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * URIs que não precisam de verificação CSRF
     *
     * @var array
     */
    protected $except = [
        'webhook/mercadopago',
    ];
}
