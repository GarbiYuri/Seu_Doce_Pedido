<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CategoryController extends Controller
{
    /**
     * Display the categories list view.
     */
    public function index(): Response
    {
        $categories = Category::all();

        // Convertendo as categorias para um array para garantir que os dados sejam passados de forma compatível
        $categories = $categories->toArray();

        return Inertia::render('Admin/Category/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Display the create category form.
     */

    /**
     * Store a newly created category in the database.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Category::create([
            'name' => $request->name,
        ]);

        return redirect()->route('Categorias');
    }

    /**
     * Display the specified category.
     */
    public function show($id): Response
    {
        $category = Category::findOrFail($id);
        return Inertia::render('Admin/Category/Show', [
            'category' => $category
        ]);
    }

    /**
     * Show the form for editing the specified category.
     */

    /**
     * Update the specified category in the database.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = Category::findOrFail($id);
        $category->update([
            'name' => $request->name,
        ]);

        return redirect()->route('Categorias');
    }

    /**
     * Remove the specified category from the database.
     */
    public function destroy($id): RedirectResponse
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return redirect()->route('Categorias');
    }
}
