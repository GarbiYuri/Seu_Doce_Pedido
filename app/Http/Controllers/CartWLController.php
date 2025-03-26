<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CartWLController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cart = session()->get('cart', []); // Obtém o carrinho da sessão


        return Inertia::render('Cart/CartWL', [
            'cart' => $cart
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $cart = session()->get('cart', []);

        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1);

        if (isset($cart[$productId])) {
            $cart[$productId] += $quantity;
        } else {
            $cart[$productId] = $quantity;
        }

        session()->put('cart', $cart);

        return Redirect::back()->with('success', 'Produto Adicionado Ao Carrinho!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
    public function update(Request $request)
    {
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity');
    
        // Recupera o carrinho da sessão
        $cart = session()->get('cart', []);
    
        // Verifica se o produto existe no carrinho e se a quantidade é válida
        if (isset($cart[$productId])) {
            // Atualiza a quantidade no carrinho
            if ($quantity > 0) {
                $cart[$productId] = $quantity;
            } else {
                // Caso a quantidade seja 0 ou negativa, remove o produto
                unset($cart[$productId]);
            }
    
            // Salva as alterações no carrinho
            session()->put('cart', $cart);
    
            return Redirect::back()->with('success', 'Quantidade tirado do Carrinho!');
        }
    
        return Redirect::back()->with('success', 'Produto não encontrado no carrinho.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $productId = $request->input('product_id');
    
        // Aqui você deve implementar a lógica para remover o produto do carrinho (session ou banco de dados)
        // Por exemplo:
        $cart = session()->get('cart', []);
        if (isset($cart[$productId])) {
            unset($cart[$productId]);
            session()->put('cart', $cart);
        }
        
        return Redirect::back()->with('success', 'Produto Removido com Sucesso');
    }
}
