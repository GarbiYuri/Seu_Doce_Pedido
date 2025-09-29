<?php

namespace App\Http\Controllers;

use Brick\Math\BigInteger;
use Illuminate\Http\Request;
use App\Models\Venda;
use App\Models\VendaProduct;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Cart;
class CheckoutController extends Controller
{
public function index()
{
    $user = Auth::user();

    // 1. Busca todas as vendas do usuário
    $vendas = Venda::orderBy('created_at', 'desc')->get();

    // 2. Pega os ids das vendas
    $vendasIds = $vendas->pluck('id');

    // 3. Busca os produtos das vendas
    $produtos = VendaProduct::whereIn('id_venda', $vendasIds)
        ->select([
            'id',
            'id_venda',
            'id_product',
            'nome',
            'preco',
            'quantity',
            'descricao',
            'categoria',
            'imagem',
            'id_promocao',
            'kitquantity'
        ])
        ->get();

    // 4. Agrupa os produtos por venda
    $produtosPorVenda = $produtos->groupBy('id_venda');

    // 5. Adiciona os produtos à venda correspondente
    $vendas->each(function ($venda) use ($produtosPorVenda) {
        $venda->produtos = $produtosPorVenda->get($venda->id, collect());
    });

    // 6. Reindexa para array sequencial para o Inertia
    $vendasArray = $vendas->map(function ($venda) {
        return [
            'id' => $venda->id,
            'status' => $venda->status,
            'valor' => $venda->valor,
            'tipo' => $venda->tipo,
            'created_at' => $venda->created_at,
            'nome' => $venda->nome,
            'email' => $venda->email,
            'telefone' => $venda->telefone,
            'endereco' => $venda->endereco,
            'cidade' => $venda->cidade,
            'bairro' => $venda->bairro,
            'cep' => $venda->cep,
            'rua' => $venda->rua,
            'numero' => $venda->numero,
            'complemento' => $venda->complemento,
            'forma_pagamento' => $venda->forma_pagamento,
            'payment_url' => $venda->payment_url,
            'produtos' => $venda->produtos->map(function ($produto) {
                return [
                    'id' => $produto->id,
                    'nome' => $produto->nome,
                    'preco' => $produto->preco,
                    'quantity' => $produto->quantity,
                    'descricao' => $produto->descricao,
                    'categoria' => $produto->categoria,
                    'imagem' => $produto->imagem,
                    'id_promocao' => $produto->id_promocao,
                    'kitquantity' => $produto->kitquantity,
                ];
            })->toArray(),
        ];
    })->toArray();

    // 7. Retorna para o Inertia

    return Inertia::render('Admin/Vendas/VendasLayout', [
        'vendas' => $vendas,
    ]);
}


public function meuspedidos()
{
    $user = Auth::user();

    // 1. Busca todas as vendas do usuário
    $vendas = Venda::where('id_user', $user->id)
        ->orderBy('created_at', 'desc')
        ->get();

    // 2. Pega os ids das vendas
    $vendasIds = $vendas->pluck('id');

    // 3. Busca os produtos das vendas
    $produtos = VendaProduct::whereIn('id_venda', $vendasIds)
        ->select([
            'id', 
            'id_venda', 
            'id_product', 
            'nome', 
            'preco', 
            'quantity', 
            'id_promocao', 
            'kitquantity'
        ])
        ->get();

    // 4. Agrupa os produtos por venda
    $produtosPorVenda = $produtos->groupBy('id_venda');

    // 5. Adiciona os produtos à venda correspondente
    $vendas->each(function ($venda) use ($produtosPorVenda) {
        // produtos será uma coleção, mesmo que vazia
        $venda->produtos = $produtosPorVenda->get($venda->id, collect());
    });

    // 6. Retorna para o Inertia
    return Inertia::render('Pedido/MeusPedidos', [
        'vendas' => $vendas,
    ]);
}


public function cancelarPedido(Request $request, $id)
{
    $userId = Auth::id();
    $retornar = $request->input('retornar', false);
    
    

    DB::transaction(function () use ($id, $userId, $retornar) {
        if($retornar){
        // Busca os produtos da venda
        $produtosDaVenda = DB::table('venda_products')
            ->where('id_venda', $id)
            ->get();
        
        // Busca ou cria o carrinho do usuário
        $cart = Cart::firstOrCreate(['id_user' => $userId]);

        foreach ($produtosDaVenda as $produto) {
            // Verifica se o produto já está no carrinho
            $produtoNoCarrinho = DB::table('cart_product')
                ->where('Id_Cart', $cart->id)
                ->where('Id_Product', $produto->id_product)
                ->first();
        
        

            if ($produtoNoCarrinho) {
                // Incrementa quantidade
                DB::table('cart_product')
                    ->where('Id_Cart', $cart->id)
                    ->where('Id_Product', $produto->id_product)
                    ->update([
                        'quantity' => $produtoNoCarrinho->quantity + $produto->quantity,
                    ]);
            } else {
                // Insere novo produto no carrinho
               DB::table('cart_product')->insert([
                    'Id_Cart' => $cart->id,
                    'Id_Product' => $produto->id_product,
                    'quantity' => $produto->quantity,
                ]);

            }
        }
    }

        // Deleta os produtos da venda
        DB::table('venda_products')->where('id_venda', $id)->delete();

        // Deleta a venda
        DB::table('vendas')->where('id', $id)->delete();
    });

    return redirect()->back()->with('success', 'Pedido cancelado e produtos devolvidos ao carrinho.');
}

public function success(Request $request)
{
    $vendaId = $request->query('external_reference');

    if ($vendaId) {
        Venda::where('id', $vendaId)->update(['status' => 'pago']);
    }

    return Inertia::render('Dashboard');
}

public function pending(Request $request)
{
    $vendaId = $request->query('external_reference');

    if ($vendaId) {
        Venda::where('id', $vendaId)->update(['status' => 'pagamento_pendente']);
    }

    return Inertia::render('Dashboard');
}

public function failure(Request $request)
{
    $vendaId = $request->query('external_reference');

    if ($vendaId) {
        Venda::where('id', $vendaId)->update(['status' => 'falha_pagamento']);
    }

    return Inertia::render('Dashboard');
}

public function pagardepois(Venda $venda)
{
    // 1. VERIFICAÇÃO DE SEGURANÇA
    // Garante que o usuário logado só possa ver os seus próprios pedidos.
    if (Auth::id() !== $venda->id_user) {
        abort(403, 'Acesso não autorizado.');
    }

    // 2. BUSCAR OS PRODUTOS DA VENDA
    // Usamos 'load' para carregar o relacionamento de produtos.
    // Como os dados na Venda estão criptografados, o Eloquent os descriptografa aqui.
    $venda->load('produtos');

    // 3. RETORNAR PARA A PÁGINA DO INERTIA
    // Enviamos os dados da venda (já com os produtos) como uma 'prop' para o componente React.
    return Inertia::render('Checkout/Retirada', [
        'venda' => $venda,
    ]);
}

}
