<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shop;

class ShopController extends Controller
{
     /**
     * Retorna todos os banners e o banner atual da loja.
     */
    public function index()
    {
        $banners = Banner::all(); // pega todos os banners
        $shop = Shop::find(1); // assume que só tem uma loja, com id 1

        return response()->json([
            'banners' => $banners,
            'selected_banner_id' => $shop?->id_banner, // null-safe caso shop não exista
        ]);
    }

    /**
     * Atualiza o banner da loja com o ID 1.
     */
public function update(Request $request)
{
    // Validação flexível: só valida se o campo foi enviado
    $request->validate([
        'id_banner' => 'nullable|exists:banner,id',
        'hora_abertura' => 'nullable',
        'hora_fechamento' => 'nullable',
        'loja_aberta' => 'nullable|boolean',
    ]);

    // Busca ou cria o registro da loja
    $shop = Shop::firstOrNew(['id' => 1]);

    // Atualiza apenas os campos que vieram no request
    if ($request->has('id_banner')) {
        $shop->id_banner = $request->id_banner;
    }

    if ($request->has('hora_abertura')) {
        $shop->hora_abertura = $request->hora_abertura;
    }

    if ($request->has('hora_fechamento')) {
        $shop->hora_fechamento = $request->hora_fechamento;
    }

    if ($request->has('loja_aberta')) {
        $shop->loja_aberta = $request->loja_aberta;
    }

    $shop->save();

    return redirect()->back();
}



}
