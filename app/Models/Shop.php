<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Shop extends Model
{
     use HasFactory;

    protected $table = 'shop'; // Nome da tabela no banco de dados

     protected $fillable = [
    
        'id_banner',
        
    ];
     /**
     * Relacionamento: A loja tem apenas um banner
     */
    public function banner()
    {
        return $this->belongsTo(Banner::class, 'id_banner', 'id');
    }
}
