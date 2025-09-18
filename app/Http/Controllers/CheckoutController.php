<?php

namespace App\Http\Controllers;

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
    $vendasRaw = DB::table('vendas')
        ->join('venda_products', 'vendas.id', '=', 'venda_products.id_venda')
        ->select(
            'vendas.id as venda_id',
            'vendas.status',
            'vendas.payment_url',
            'vendas.valor',
            'vendas.tipo',
            'vendas.created_at',
            'vendas.nome',
            'vendas.email',
            'vendas.telefone',
            'vendas.endereco',
            'vendas.cep',
            'vendas.rua',
            'vendas.numero',
            'venda_products.id as produto_venda_id',
            'venda_products.nome as produto_nome',
            'venda_products.preco as produto_preco',
            'venda_products.descricao as produto_descricao',
            'venda_products.categoria as produto_categoria',
            'venda_products.imagem as produto_imagem',
            'venda_products.quantity as produto_quantity'
        )
        ->orderBy('vendas.id', 'desc')
        ->get();



    // Agrupar produtos por venda
    $vendas = [];

    foreach ($vendasRaw as $item) {
        $vendaId = $item->venda_id;

        if (!isset($vendas[$vendaId])) {
            $vendas[$vendaId] = [
                'id' => $vendaId,
                'status' => $item->status,
                'valor' => $item->valor,
                'tipo' => $item->tipo,
                'created_at' => $item->created_at,
                'nome' => $item->nome,
                'email' => $item->email,
                'telefone' => $item->telefone,
                'endereco' => $item->endereco,
                'cep' => $item->cep,
                'rua' => $item->rua,
                'numero' => $item->numero,
                'produtos' => [],
            ];
        }

        $vendas[$vendaId]['produtos'][] = [
            'id' => $item->produto_venda_id,
            'nome' => $item->produto_nome,
            'preco' => $item->produto_preco,
            'descricao' => $item->produto_descricao,
            'imagem' => $item->produto_imagem,
            'categoria' => $item->produto_categoria,
            'quantity' => $item->produto_quantity,
        ];
    }

    // Reindexa como array sequencial para o Inertia/Vue
    $vendas = array_values($vendas);


    return Inertia::render('Admin/Vendas/VendasLayout', [
        'vendas' => $vendas,
    ]);
}


public function meuspedidos()
{
    

    $user = Auth::user();

    $vendas = DB::select("
        SELECT 
            v.id as venda_id,
            v.status,
            v.forma_pagamento,
            v.payment_url,
            v.valor,
            v.tipo,
            v.created_at,
            u.name as cliente_nome,
            u.email as cliente_email,
            vp.nome as produto_nome,
            vp.preco as produto_preco,
            vp.quantity as produto_quantidade,
            vp.descricao as produto_descricao,
            vp.id_promocao as id_promocao,
            vp.kitquantity as kitquantity
        FROM vendas v
        JOIN venda_products vp ON v.id = vp.id_venda
        JOIN users u ON u.id = v.id_user
        WHERE u.id = ?
        ORDER BY v.created_at DESC
    ", [$user->id]);


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
}
