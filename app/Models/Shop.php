<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Shop extends Model
{
     use HasFactory;

    protected $table = 'shop'; 

     protected $fillable = [
    
        'id_banner',
        'hora_abertura',
        'hora_fechamento',
        'loja_aberta',
        
    ];
     /**
     * Relacionamento: A loja tem apenas um banner
     */
    public function banner()
    {
        return $this->belongsTo(Banner::class, 'id_banner', 'id');
    }
}
