<?php

namespace App\Http\Controllers;

use Carbon\Traits\ToStringFormat;
use Illuminate\Http\Request;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Exceptions\MPApiException;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Venda;
use App\Models\VendaProduct;

class MercadoPagoController extends Controller
{
   

   public function pagar(Request $request)
{
    if ($request->method() === "POST") {
        try {
 
            $user = auth()->user();

            $accessToken = config('services.mercadopago.token');

            if (!$accessToken) {
            abort(500, 'Token do Mercado Pago não configurado.');
            }
            MercadoPagoConfig::setAccessToken($accessToken);

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
                  /*  "picture_url" => 'http://127.0.0.1:8000/imagem/' . $product['imagem'],*/ //usar quando hospedado
                    "description" => $product['description'],
                    "currency_id" => "BRL",
                    "unit_price" => (float) $product['price'],
                ];
                $total += $product['price'] * $product['quantity'];
            }

            

            // Se for entrega, adiciona taxa de entrega + dados de endereço
            if ($tipoPedido === 'entrega') {
                $items[] = [
                    "id" => "delivery_fee",
                    "title" => "Taxa de entrega",
                    "quantity" => 1,
                    "currency_id" => "BRL",
                    "unit_price" => 4, // valor fixo da entrega (precisa aplicar api para dinamizar)
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


                // 1. Cria a venda no banco
        $venda = Venda::create([
         'id_user' => $user->id,
         'status' => 'iniciado', // ou 'pendente'
        'valor' => $total,
        'tipo' => $tipoPedido, // retirada ou entrega
        'nome' => $user->name,
        'email' => $user->email,
        'telefone' => $informacoes['telefone'],
        'endereco' => $informacoes['bairro']  . ' - ' . $informacoes['cidade'] ?? null,
        'rua' => $informacoes['rua'] ?? null,
        'numero' => $informacoes['numero'] ?? null,
        'cep' => $informacoes['cep'] ?? null,
        ]);



        // 2. Salva os produtos da venda
    foreach ($products as $product) {
    $categoriaNome = null;
    if (!empty($product['id_categoria'])) {
        $categoriaNome = DB::table('category')
            ->where('id', $product['id_categoria'])
            ->value('name'); 
    }
    VendaProduct::create([
        'id_venda' => $venda->id,
        'id_product' => $product['id'],
        'nome' => $product['name'],
        'preco' => $product['price'],
        'descricao' => $product['description'] ?? '',
        'imagem' => $product['imagem'] ?? '',
        'id_category' => $product['id_categoria'] ?? 0, // se tiver
        'categoria' => $categoriaNome ?? 'Sem categoria',
        'quantity' => $product['quantity'],
    ]);
}

            // Cria a preferência Mercado Pago
            $preference = $client->create([
                "back_urls" => array(
                    "success" => "https://www.seudocepedido.shop/success",
                    "failure" => "https://www.seudocepedido.shop/failure",
                    "pending" => "https://www.seudocepedido.shop/pending"
                ),
                "auto_return" => "all",
                "items" => $items,
                "payer" => $payer,
                "binary_mode" => true,
                "external_reference" => (string) $venda->id,
    
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

            DB::table('cart_product')
                ->where('Id_Cart', $cart->id)
                ->delete();

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

            $accessToken = config('services.mercadopago.token');

            if (!$accessToken) {
            abort(500, 'Token do Mercado Pago não configurado.');
            }
            MercadoPagoConfig::setAccessToken($accessToken);

            $products = $request->input('products');
            $tipoPedido = $request->input('tipoPedido', 'retirada'); 
            $dadosEntrega = $request->input('dadosEntrega');

            $items = [];
            $total = 0;
            $payer =[];

            // Adiciona produtos ao array de items
            foreach ($products as $product) {
                $items[] = [
                    "id" => $product['id'],
                    "title" => $product['name'],
                     /*  "picture_url" => 'http://127.0.0.1:8000/imagem/' . $product['imagem'],*/ //usar quando hospedado
                     "description" => $product['description'],
                     "quantity" => (int) $product['quantity'],
                    "currency_id" => "BRL",
                    "unit_price" => (float) $product['price'],
                    "imagem" => $product['imagem'] ?? null,
                ];
                $total += $product['price'] * $product['quantity'];
            }

            

            // Se for entrega, adiciona taxa de entrega + dados de endereço
            if ($tipoPedido === 'entrega') {
                $items[] = [
                    "id" => "delivery_fee",
                    "title" => "Taxa de entrega",
                    "quantity" => 1,
                    "currency_id" => "BRL",
                    "unit_price" => 4, // valor fixo da entrega (precisa aplicar api para dinamizar)
                ];
                $frete = 4;
                $total += $frete;
                 $payer = [
            "name" => $dadosEntrega['nome'],
            "phone" => [
            "number" => $dadosEntrega['telefone'],
            ],
        ];
            }else{
        $payer = [
            "name" => $dadosEntrega['nome'],
            "phone" => [
            "number" => $dadosEntrega['telefone'],
            ],
        ];
                 $frete = 0.00;
            }





            $client = new PreferenceClient();



                // 1. Cria a venda no banco
        $venda = Venda::create([
         'status' => 'iniciado',
        'valor' => $total,
        'tipo' => $tipoPedido, // retirada ou entrega
        'nome' => $dadosEntrega['nome'],
        'email' => $dadosEntrega['email'],
        'telefone' => $dadosEntrega['telefone'],
        'endereco' => $dadosEntrega['bairro']  . ' - ' . $dadosEntrega['cidade'] ?? null,
        'rua' => $dadosEntrega['rua'] ?? null,
        'numero' => $dadosEntrega['numero'] ?? null,
        'cep' => $dadosEntrega['cep'] ?? null,
        ]);



        // 2. Salva os produtos da venda
    foreach ($products as $product) {
    $categoriaNome = null;
    if (!empty($product['id_categoria'])) {
        $categoriaNome = DB::table('category')
            ->where('id', $product['id_categoria'])
            ->value('name'); 
    }
    VendaProduct::create([
        'id_venda' => $venda->id,
        'id_product' => $product['id'],
        'nome' => $product['name'],
        'preco' => $product['price'],
        'descricao' => $product['description'] ?? '',
        'imagem' => $product['imagem'] ?? '',
        'id_category' => $product['id_categoria'] ?? null, // se tiver
        'categoria' => $categoriaNome ?? 'Sem categoria',
        'quantity' => $product['quantity'],
    ]);
    }



            // Cria a preferência Mercado Pago
            $preference = $client->create([
                "back_urls" => [
                     "success" => "https://www.seudocepedido.shop/success",
                    "failure" => "https://www.seudocepedido.shop/failure",
                    "pending" => "https://www.seudocepedido.shop/pending"
                ],
                "auto_return" => "all",
                "items" => $items,
                "payer" => $payer,
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
