<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Venda;

class VendaController extends Controller
{
    
public function atualizarStatus(Request $request, $id)
{
    $venda = Venda::findOrFail($id);

    // Atualiza o status com base no que foi enviado na requisição
    $novoStatus = $request->input('status');

    // Segurança: apenas permite certos status válidos
    $statusPermitidos = ['iniciado', 'em_preparo', 'em_entrega', 'entregue', 'cancelado'];

    if (!in_array($novoStatus, $statusPermitidos)) {
        return redirect()->back()->with('failure', 'Atualizado Inválido');
    }

    // Atualiza e salva
    $venda->status = $novoStatus;
    $venda->save();

    return redirect()->back()->with('success', 'Atualizado Status');
}
}
