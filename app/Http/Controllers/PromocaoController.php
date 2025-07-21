<?php

namespace App\Http\Controllers;

use App\Models\Promocao;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromocaoController extends Controller
{
    // Listar todas promoções
    public function index()
    {
        $promocoes = Promocao::with('product')->get();

        return Inertia::render('Promocoes/Index', [
            'promocoes' => $promocoes
        ]);
    }

    // Formulário para criar promoção
    public function create()
    {
        $products = Product::all();

        return Inertia::render('Promocoes/Create', [
            'products' => $products
        ]);
    }

    // Salvar promoção no banco
    public function store(Request $request)
    {
        $request->validate([
            'Id_Product' => 'nullable|exists:product,id',
            'descricao' => 'nullable|string|max:255',
            'price' => 'required|numeric',
            'quantidade' => 'nullable|integer',
            'estoque' => 'nullable|integer',
            'imagem' => 'nullable|image|max:2048',
        ]);

        $data = $request->only('Id_Product', 'descricao', 'price', 'quantidade', 'estoque');

        if ($request->hasFile('imagem')) {
            $path = $request->file('imagem')->store('promocoes', 'public');
            $data['imagem'] = $path;
        }

        Promocao::create($data);

        return redirect()->route('promocoes.index')->with('success', 'Promoção criada com sucesso!');
    }

    // Mostrar detalhes de uma promoção
    public function show($id)
    {
        $promocao = Promocao::with('product')->findOrFail($id);

        return Inertia::render('Promocoes/Show', [
            'promocao' => $promocao
        ]);
    }

    // Formulário para editar promoção
    public function edit($id)
    {
        $promocao = Promocao::findOrFail($id);
        $products = Product::all();

        return Inertia::render('Promocoes/Edit', [
            'promocao' => $promocao,
            'products' => $products,
        ]);
    }

    // Atualizar promoção
    public function update(Request $request, $id)
    {
        $request->validate([
            'Id_Product' => 'nullable|exists:product,id',
            'descricao' => 'nullable|string|max:255',
            'price' => 'required|numeric',
            'quantidade' => 'nullable|integer',
            'estoque' => 'nullable|integer',
            'imagem' => 'nullable|image|max:2048',
        ]);

        $promocao = Promocao::findOrFail($id);

        $data = $request->only('Id_Product', 'descricao', 'price', 'quantidade', 'estoque');

        if ($request->hasFile('imagem')) {
            $path = $request->file('imagem')->store('promocoes', 'public');
            $data['imagem'] = $path;
        }

        $promocao->update($data);

        return redirect()->route('promocoes.index')->with('success', 'Promoção atualizada com sucesso!');
    }

    // Deletar promoção
    public function destroy($id)
    {
        $promocao = Promocao::findOrFail($id);
        $promocao->delete();

        return redirect()->route('promocoes.index')->with('success', 'Promoção excluída com sucesso!');
    }
}
