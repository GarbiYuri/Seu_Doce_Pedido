<?php

namespace App\Http\Middleware;

use App\Models\Promocao;
use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Product;
use App\Models\Category;
use App\Models\Shop;
use App\Models\Banner;


class HandleInertiaRequests extends Middleware
{
    
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
  

public function share(Request $request): array
{
    $user = $request->user();
    $info = $user?->informacoesPessoais?->descriptografado();

    $cartCount = 0;

    if ($user) {
        $cart = \App\Models\Cart::where('id_user', $user->id)->first();

        if ($cart) {
            $cartCount = \App\Models\cart_product::where('Id_Cart', $cart->id)->sum('quantity');
        }
    }

    return [
        ...parent::share($request),

        'auth' => [
            'user' => $user,
            'informacoes' => $info,
            'cart' => [
                'totalItems' => $cartCount,
            ],
        ],

        'csrf_token' => csrf_token(),
        'bannerss' => Banner::all()->toArray(),
        'shop' => Shop::with('banner')->find(1),
        'lojaAberta' => Shop::find(1)->loja_aberta,
        'products' => Product::where('ativo', true)->get()->toArray(),
        'categories' => Category::where('ativo', true)->get()->toArray(),
        'promocoes' => Promocao::with('product')->where('ativo', true)->get()->toArray(),

       
    ];
}


}
