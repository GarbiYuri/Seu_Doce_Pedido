<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Banner;
use Inertia\Inertia;

class BannerController extends Controller
{


    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'imagem' => 'required|string|max:255',
        ]);

         // Upload da logo
        if ($request->hasFile('imagem')) {
        $ImagemName = time() . '.' . $request->imagem->extension();
        $request->imagem->move(public_path('imagem'), $ImagemName);
        }

        Banner::create($request->only('nome', 'imagem'));

        return redirect()->route('banners.index');
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

    public function destroy(string $id)
    {
        Banner::destroy($id);
        return redirect()->route('banners.index');
    }
}
