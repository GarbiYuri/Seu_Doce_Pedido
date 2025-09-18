<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Venda extends Model
{
    use HasFactory;

    // Se a tabela não seguir o plural padrão, declare explicitamente
    protected $table = 'vendas';

    // Quais campos podem ser preenchidos via mass assignment (ex: Venda::create([...]))
    protected $fillable = [
        'id_user',
        'status',
        'id_mp',
        'payment_url',
        'forma_pagamento',
        'valor',
        'tipo',
        'nome',
        'email',
        'endereco',
        'cep',
        'rua',
        'numero',
        'telefone',
    ];

    // Se quiser, pode configurar o relacionamento com User (se existir)
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
