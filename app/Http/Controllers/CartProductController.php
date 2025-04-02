<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\cart_product;
use App\Models\Cart;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;


class CartProductController extends Controller
{
    
  
    public function index()
    {
        $userId = auth()->user()->id;  // Obtendo o id do usuário logado
      
         // Realiza o INNER JOIN entre a tabela cart_product, cart e product
    $cartProducts = DB::table('cart_product')
    ->join('product', 'cart_product.Id_Product', '=', 'product.id')
    ->join('cart', 'cart_product.Id_Cart', '=', 'cart.id') // JOIN com a tabela de carrinho
    ->where('cart.Id_User', $userId)
    ->select('cart_product.Id_Cart', 'cart_product.Id_Product', 'product.name', 'product.price','product.imagem' ,DB::raw('count(cart_product.Id_Product) as quantity'))
    ->groupBy('cart_product.Id_Cart', 'cart_product.Id_Product', 'product.name', 'product.price', 'product.imagem')
    ->get();

    
        // Retorna os dados para a view
        return Inertia::render('Cart/Cart', [
            'cartProducts' => $cartProducts,
        ]);
    }
    public function store(Request $request)
{
    $request->validate([
        'Id_Product' => 'required|exists:product,id',
    ]);

    // Obtém o carrinho do usuário autenticado
    $cart = Cart::where('id_user', Auth::id())->first();

    if (!$cart) {
        return response()->json(['message' => 'Carrinho não encontrado.'], 404);
    }

    // Adiciona o produto ao carrinho
    $cartProduct = cart_product::create([
        'Id_Product' => $request->Id_Product,
        'Id_Cart' => $cart->id, // Usa o carrinho do usuário logado   
    ]);

    return Redirect::back()->with('success', 'Produto Adicionado Ao Carrinho!');
}
public function update(Request $request)
{
    $productId = $request->input('product_id');
    $quantity = $request->input('quantity');

    $userId = auth()->user()->id; // Obtém o ID do usuário logado

    // Obtém o carrinho do usuário
    $cart = DB::table('cart')
        ->where('Id_User', $userId)
        ->first();

    if (!$cart) {
        return Redirect::back()->with('error', 'Carrinho não encontrado.');
    }

    // Verifica se o produto existe no carrinho
    $cartProduct = DB::table('cart_product')
        ->where('Id_Cart', $cart->id)
        ->where('Id_Product', $productId)
        ->first();

    if ($cartProduct) {
        if ($quantity > 0) {
            // Atualiza a quantidade no banco de dados
            DB::table('cart_product')
            ->where('Id_Product', $productId)
            ->where('Id_Cart', $cart->id)
            ->limit(1)
            ->delete();
        } else {
            // Remove o produto do carrinho se a quantidade for 0
            DB::table('cart_product')
                ->where('Id_Cart', $cart->id)
                ->where('Id_Product', $productId)
                ->delete();
        }

        return Redirect::back()->with('success', 'Carrinho atualizado!');
    }

    return Redirect::back()->with('error', 'Produto não encontrado no carrinho.');
}


/**
 * Remove the specified resource from storage.
 */
public function destroy(Request $request)
{
    $productId = $request->input('product_id');

    $userId = auth()->user()->id; // Obtém o ID do usuário logado

    // Obtém o carrinho do usuário
    $cart = DB::table('cart')
        ->where('Id_User', $userId)
        ->first();

    if (!$cart) {
        return Redirect::back()->with('error', 'Carrinho não encontrado.');
    }

     // Verifica se o produto existe no carrinho
     $cartProduct = DB::table('cart_product')
     ->where('Id_Cart', $cart->id)
     ->where('Id_Product', $productId)
     ->first();

     if ($cartProduct) {
            // Exclui o PRoduto do Carrinho
            DB::table('cart_product')
            ->where('Id_Product', $productId)
            ->where('Id_Cart', $cart->id)
            ->delete();
            return Redirect::back()->with('success', 'Carrinho atualizado!');
        } 
        return Redirect::back()->with('error', 'Produto não encontrado no carrinho.');
        
    }

   
}

