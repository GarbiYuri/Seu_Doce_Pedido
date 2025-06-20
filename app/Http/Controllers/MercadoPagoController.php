<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Exceptions\MPApiException;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class MercadoPagoController extends Controller
{
    public function pagar(Request $request)
    {
        if($request->method() === "POST"){
// Define o token de acesso
        try{
        $user = auth()->user();


        MercadoPagoConfig::setAccessToken(env('MP_ACCESS_TOKEN'));

        $products = $request->input('products');

         $items = [];
        $total = 0;

        foreach ($products as $product) {
       $items[] = [
    "id" => $product['id'],
    "title" => $product['name'],
    "quantity" => (int) $product['quantity'],
    "currency_id" => "BRL",
    "unit_price" => (float) $product['price'],
];
        $total += $product['price'] * $product['quantity'];
    }
    $items[] = [
        "id" => "delivery_fee",
        "title" => "Taxa de entrega",
        "quantity" => 1,
        "currency_id" => "BRL",
        "unit_price" => 4,
    ];
    


        $client = new PreferenceClient();

        // Cria a preferência
        $preference = $client->create([
            "back_urls" => [
                "success" => route('checkout.success'),
                "failure" => route('checkout.failure'),
                "pending" => route('checkout.pending')
            ],
            "items" => $items,
            "payer" => [
                
    "name" => $user->name, 
    "surname" => "",
    "email" => $user->email,
                "address" => [
                    "zip_code" => "06233200",
                    "street_name" => "Rua Teste",
                    "street_number" => "123"
                ]
            ],
            
            "binary_mode" => true,
            "notification_url" => "https://seusite.com/notificacoes"
        ]);
         $userId = auth()->id();

    $cart = DB::table('cart')
        ->where('id_user', $userId)
        ->first();

    $products = DB::table('cart_product')
        ->join('product', 'cart_product.Id_Product', '=', 'product.id')
        ->where('Id_Cart', $cart->id)
        ->select(
            'product.id',
            'product.name',
            'product.price',
            'product.imagem',
            'cart_product.quantity'
        )
        ->get();

       return Inertia::render('Checkout/CheckoutRedirect', [
    'init_point' => $preference->init_point,
    'cartItems' => $products,
    'userAddress' => [
        'street' => 'Rua Exemplo',
        'number' => '123',
        'zip' => '01234567',
        'bairro' => 'Centro',
        'cidade' => 'São Paulo',
        'estado' => 'SP'
    ],
    'cpf' => '123.456.789-00',
    'isPickup' => false // ou false se for entrega
]);
        
        }catch (MPApiException $e) {
        // Verifique a resposta de erro completa
        return response()->json([
            'message' => 'Erro na API do Mercado Pago',
            'error' => $e->getApiResponse()->getContent()
        ], 500);
        
        }
    }else{
            return Inertia::render('Dashboard');
        }
        }
        
}
