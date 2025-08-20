<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Crypt;

class InformacoesPessoais extends Model
{
    use HasFactory;
    protected $table = "informacoes_pessoais";

    protected $fillable = [
        'user_id',
        'rua',
        'numero',
        'bairro',
        'cidade',
        'estado',
        'complemento',
        'cep',
        'telefone',
        'cpf',
    ];

    // Criptografar antes de salvar
    public function setAttribute($key, $value)
    {
        if (in_array($key, $this->encryptableFields()) && !is_null($value)) {
            $value = Crypt::encryptString($value);
        }

        return parent::setAttribute($key, $value);
    }

    // Descriptografar ao acessar
    public function getAttribute($key)
    {
        $value = parent::getAttribute($key);

        if (in_array($key, $this->encryptableFields()) && !is_null($value)) {
            try {
                return Crypt::decryptString($value);
            } catch (\Exception $e) {
                // Caso o dado já esteja em texto simples
                return $value;
            }
        }

        return $value;
    }
    public function descriptografado()
{
    return [
        'id' => $this->id,
        'rua' => $this->rua,
        'numero' => $this->numero,
        'bairro' => $this->bairro,
        'cidade' => $this->cidade,
        'estado' => $this->estado,
        'complemento' => $this->complemento,
        'cep' => $this->cep,
        'telefone' => $this->telefone,
        'cpf' => $this->cpf,
    ];
}

    // Lista dos campos a serem criptografados
    protected function encryptableFields()
    {
        return [
            'rua',
            'numero',
            'bairro',
            'cidade',
            'estado',
            'complemento',
            'cep',
            'telefone',
            'cpf',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
