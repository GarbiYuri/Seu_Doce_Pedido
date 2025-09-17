<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InformacoesPessoais;
class InformacoesPessoaisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    // Validação dos dados recebidos
    $validatedData = $request->validate([
        'rua' => 'nullable|string|max:255',
        'numero' => 'nullable|integer',
        'bairro' => 'nullable|string|max:255',
        'cidade' => 'nullable|string|max:255',
        'estado' => 'nullable|string|max:255',
        'cep' => 'nullable|string|max:20',
        'telefone' => 'nullable|string|max:20',
        'cpf' => 'nullable|string|max:14',
        'complemento' => 'nullable|string|max:255',
    ]);

    // Adiciona o ID do usuário logado para vincular o registro
    $validatedData['user_id'] = auth()->id();

    // Cria o novo registro
    InformacoesPessoais::create($validatedData);

    // Redireciona de volta com mensagem de sucesso
    return redirect()->back()->with('success', 'Informações pessoais cadastradas com sucesso!');
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
   public function update(Request $request, string $id)
{
    // Validação dos dados recebidos (ajuste as regras conforme necessidade)
    $validatedData = $request->validate([
        'rua' => 'nullable|string|max:255',
        'numero' => 'nullable|integer',
        'bairro' => 'nullable|string|max:255',
        'cidade' => 'nullable|string|max:255',
        'estado' => 'nullable|string|max:255',
        'cep' => 'nullable|string|max:20',
        'telefone' => 'nullable|string|max:20',
        'cpf' => 'nullable|string|max:14',
        'complemento' => 'nullable|string|max:255',
    ]);

    // Encontra o registro pelo ID
    $informacao = InformacoesPessoais::findOrFail($id);

    // Verifica se o usuário atual é dono das informações para segurança
    if ($informacao->user_id !== auth()->id()) {
        abort(403, 'Ação não autorizada.');
    }

    // Atualiza com os dados validados
    $informacao->update($validatedData);

    // Redireciona de volta com uma mensagem de sucesso
    return redirect()->back()->with('success', 'Informações pessoais atualizadas com sucesso!');
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
