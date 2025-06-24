<?php

namespace App\Http\Controllers;

use Carbon\Traits\ToStringFormat;
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
    if ($request->method() === "POST") {
        try {
 
            $user = auth()->user();

            MercadoPagoConfig::setAccessToken(env('MP_ACCESS_TOKEN'));

            $informacoes  = $request->input('informacoes');
            $products = $request->input('products');
            $tipoPedido = $request->input('tipoPedido', 'retirada'); 

            $items = [];
    
            $total = 0;

           

               
           

            // Adiciona produtos ao array de items
            foreach ($products as $product) {
                $items[] = [
                    "id" => $product['id'],
                    "title" => $product['name'],
                    "quantity" => (int) $product['quantity'],
                    "picture_url" => 'http://127.0.0.1:8000/imagem/' . $product['imagem'],
                    "description" => $product['description'],
                    "currency_id" => "BRL",
                    "unit_price" => (float) $product['price'],
                ];
                $total += $product['price'] * $product['quantity'];
            }

            

            // Se for entrega, adiciona taxa de entrega
            if ($tipoPedido === 'entrega') {
                $items[] = [
                    "id" => "delivery_fee",
                    "title" => "Taxa de entrega",
                    "quantity" => 1,
                    "currency_id" => "BRL",
                    "unit_price" => 4, // valor fixo da entrega (pode ser variável)
                ];
                $frete = 4;
                $total += $frete;
                 $payer = [
        "name" => $user->name,
        "email" => $user->email,
        "phone" => [
            "number" => (string) $informacoes['telefone'],
        ],
    ];  
            }else{
               
                   
    $payer = [
        "name" => $user->name,
        "email" => $user->email,
        "phone" => [
            "number" => (string) $informacoes['telefone'],
        ],
    ];  
                
                 $frete = 0.00;
            }


            $client = new PreferenceClient();

            // Cria a preferência Mercado Pago
            $preference = $client->create([
                "back_urls" => array(
                    "success" => "success",
                    "failure" => "failure",
                    "pending" => "pending"
                ),
                "auto_return" => "all",
                "items" => $items,
                "payer" => $payer,
    
            ]);

            // Busca os produtos do carrinho para mostrar no retorno
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
                'userAddress' => $tipoPedido === 'entrega' ? true : null,
                'isPickup' => $tipoPedido === 'retirada',
                'frete' => $frete,
            ]);
        } catch (MPApiException $e) {
            return response()->json([
                'message' => 'Erro na API do Mercado Pago',
                'error' => $e->getApiResponse()->getContent()
            ], 500);
        }
    } else {
        return Inertia::render('Dashboard');
    }
}
  public function pagarWL(Request $request)
{
    if ($request->method() === "POST") {
        try {

            MercadoPagoConfig::setAccessToken(env('MP_ACCESS_TOKEN'));

            $products = $request->input('products');
            $tipoPedido = $request->input('tipoPedido', 'retirada'); 
            $dadosEntrega = $request->input('dadosEntrega');

            $items = [];
            $total = 0;

            // Adiciona produtos ao array de items
            foreach ($products as $product) {
                $items[] = [
                    "id" => $product['id'],
                    "title" => $product['name'],
                    "quantity" => (int) $product['quantity'],
                    "currency_id" => "BRL",
                    "unit_price" => (float) $product['price'],
                    "imagem" => $product['imagem'] ?? null,
                ];
                $total += $product['price'] * $product['quantity'];
            }

            // Se for entrega, adiciona taxa de entrega
            if ($tipoPedido === 'entrega') {
                $items[] = [
                    "id" => "delivery_fee",
                    "title" => "Taxa de entrega",
                    "quantity" => 1,
                    "currency_id" => "BRL",
                    "unit_price" => 4, // valor fixo da entrega (pode ser variável)
                ];
                $frete = 4;
                $total += $frete;
            }else{
                 $frete = 0.00;
            }


            $client = new PreferenceClient();

            // Cria a preferência Mercado Pago
            $preference = $client->create([
                "back_urls" => [
                    "success" => route('success'),
                    "failure" => route('failure'),
                    "pending" => route('pending')
                ],
                "items" => $items,
                "binary_mode" => true,
            ]);


            return Inertia::render('Checkout/CheckoutRedirectWL', [
                'init_point' => $preference->init_point,
                'cartItems' => $products,
                'dadosEntrega' => $dadosEntrega,
                'userAddress' => $tipoPedido === 'entrega' ? true : null,
                'isPickup' => $tipoPedido === 'retirada',
                'frete' => $frete,
            ]);
        } catch (MPApiException $e) {
            return response()->json([
                'message' => 'Erro na API do Mercado Pago',
                'error' => $e->getApiResponse()->getContent()
            ], 500);
        }
    } else {
        return Inertia::render('Dashboard');
    }
}
        
}
