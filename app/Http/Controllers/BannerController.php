<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Banner;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{


   public function store(Request $request)
{
    $request->validate([
        'nome' => 'required|string|max:255',
        'imagem' => 'required|file|image|mimes:jpg,jpeg,png|max:2048', // max 2MB
    ]);

    // Upload da imagem
    if ($request->hasFile('imagem')) {
        $ImagemName = time() . '.' . $request->imagem->extension();
        $request->imagem->move(public_path('imagem'), $ImagemName);
    }

    // Salva no banco
    Banner::create([
        'nome' => $request->nome,
        'imagem' => 'imagem/' . $ImagemName,
    ]);

}


    public function edit(string $id)
    {
        $banner = Banner::findOrFail($id);

        return Inertia::render('Banners/Edit', [
            'banner' => $banner,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'imagem' => 'required|string|max:255',
        ]);

        $banner = Banner::findOrFail($id);
        $banner->update($request->only('nome', 'imagem'));

        return redirect()->route('banners.index');
    }

    public function destroy($id)
{
    $banner = Banner::findOrFail($id);
    
    // Se quiser remover o arquivo físico:
     Storage::delete($banner->imagem); // se o caminho for do Storage

    $banner->delete();

   
}
}
