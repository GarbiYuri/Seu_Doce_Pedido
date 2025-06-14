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
    $request->validate([
        'id_banner' => 'required|exists:banner,id', // valida se o banner existe
    ]);

    // Busca ou cria o registro com id = 1, se criar já seta o id_banner
    $shop = Shop::firstOrCreate(
        ['id' => 1],
        ['id_banner' => $request->id_banner]
    );

    // Se o banner enviado for diferente do que já está salvo, atualiza
    if ($shop->id_banner !== $request->id_banner) {
        $shop->id_banner = $request->id_banner;
        $shop->save();
    }


}

}
