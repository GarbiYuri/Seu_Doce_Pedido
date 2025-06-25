<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Product;
use App\Models\Category;
use App\Models\Shop;
use App\Models\Banner;
use Illuminate\Support\Facades\Crypt;


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
 $info = $request->user()?->informacoesPessoais?->descriptografado();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'informacoes' => $info,


            ],
            'csrf_token' => csrf_token(),
            'bannerss' => Banner::all()->toArray(),
            'shop' => Shop::with('banner')->find(1), // id fixo da loja
            'products' => Product::all()->toArray(), 
            'categories' => Category::all()->toArray(),
        ];
    }
}
