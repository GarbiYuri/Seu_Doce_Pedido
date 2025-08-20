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
                    "id" => $product['id_product'] ?? $product['id_promo'],
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
    
            ]);

                // 1. Cria a venda no banco
        $venda = Venda::create([
         'id_user' => $user->id,
         'status' => 'iniciado', // ou 'pendente'
          'payment_url' => $preference->init_point ?? null,
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
    if (!empty($product['id_category'])) {
        $categoriaNome = DB::table('category')
            ->where('id', $product['id_category'])
            ->value('name'); 
    }

    VendaProduct::create([
        'id_venda' => $venda->id,
        'id_product' => $product['id_product'] ?? null, // se tiver
        'nome' => $product['name'] ?? $product['promo_name'],
        'preco' => $product['price'],
        'descricao' => $product['description'] ?? '',
        'imagem' => $product['imagem'] ?? '',
        'id_category' => $product['id_categoria'] ?? null, // se tiver
        'id_promocao' => $product['id_promo'] ?? null, // se tiver
        'categoria' => $categoriaNome ?? 'Sem categoria',
        'quantity' => $product['quantity'],
        'kitquantity' => $product['kitquantity'] ?? null,
    ]);
}

        

            // Busca os produtos do carrinho para mostrar no retorno
            $userId = auth()->id();

            $cart = DB::table('cart')
                ->where('id_user', $userId)
                ->first();

             // Realiza o INNER JOIN entre a tabela cart_product, cart, product e promocao

   $Checkoutproducts = DB::table('cart_product as cp')
    ->leftJoin('product as p', 'cp.Id_Product', '=', 'p.id')
    ->leftJoin('promocao as pro', 'cp.Id_Promo', '=', 'pro.id')
    ->leftJoin('product as promo_prod', 'pro.Id_Product', '=', 'promo_prod.id')
    ->join('cart as c', 'cp.Id_Cart', '=', 'c.id')
    ->select(
        'cp.Id_Cart',
        'cp.Id_Product',
        'cp.Id_Promo',
        'cp.quantity',
        'cp.promo as isPromo',
        
        // Dados do produto direto (caso não seja promoção)
        'p.name as product_name',
        'p.imagem as product_image',
        'p.descricao as product_description',
        'p.price as product_price',
        'p.id_categoria as product_Id_Category',
        
        // Dados da promoção
        'pro.nome as promo_name',
        'pro.price as promo_price',
        'pro.quantidade as promo_quantity',
        'pro.descricao as promo_description',
        'pro.imagem as promo_image',
        'pro.Id_Product as promo_Id_Product',
        
        
        'c.Id_User'
    )
    ->where('c.Id_User', auth()->id())
    ->get();



            DB::table('cart_product')
                ->where('Id_Cart', $cart->id)
                ->delete();

            return Inertia::render('Checkout/CheckoutRedirect', [
                'init_point' => $preference->init_point,
                'cartItems' => $Checkoutproducts,
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
    if (!empty($product['id_category'])) {
        $categoriaNome = DB::table('category')
            ->where('id', $product['id_category'])
            ->value('name'); 
    }

     VendaProduct::create([
        'id_venda' => $venda->id,
        'id_product' => $product['id_product'] ?? null,
        'nome' => $product['name'],
        'preco' => $product['price'],
        'descricao' => $product['description'] ?? '',
        'imagem' => $product['imagem'] ?? '',
        'id_category' => $product['id_categoria'] ?? null, // se tiver
        'id_promocao' => $product['id_promo'] ?? null, // se tiver
        'categoria' => $categoriaNome ?? 'Sem categoria',
        'quantity' => $product['quantity'],
        'kitquantity' => $product['kitquantity'] ?? null,
    ]);
    }




            session()->put('cart');
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
