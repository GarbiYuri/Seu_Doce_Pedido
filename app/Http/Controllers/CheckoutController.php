<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Venda;
use App\Models\VendaProduct;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
class CheckoutController extends Controller
{
  public function index()
{
    $vendasRaw = DB::table('vendas')
        ->join('venda_products', 'vendas.id', '=', 'venda_products.id_venda')
        ->select(
            'vendas.id as venda_id',
            'vendas.status',
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
