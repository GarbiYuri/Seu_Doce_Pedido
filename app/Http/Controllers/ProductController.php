<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all(); // Busca todas as categorias
        return Inertia::render('ProductCreate', [
            'categories' => $categories // Passa as categorias para o componente
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        //
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'id_categoria' => 'required|Integer',
        ]);

        Product::create([
            'name' => $request->name,
            'price' => $request->price,
            'id_categoria' => $request->id_categoria,

        ]);

        return redirect()->route('Produtos');

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::findOrFail($id);
        return Inertia::render('Admin/Product/Show', [
            'product' => $product
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'id_categoria' => 'required|Integer',
        ]);

        $product = product::findOrFail($id);
        $product->update([
            'name' => $request->name,
            'price' => $request->price,
            'id_categoria' => $request->id_categoria,
        ]);

        return redirect()->route('Produtos');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): RedirectResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()->route('Produtos');
    }
}
