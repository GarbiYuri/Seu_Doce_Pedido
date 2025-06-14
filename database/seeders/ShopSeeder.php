<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Shop;
use App\Models\Banner;

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        // Primeiro cria ou encontra um banner
        $banner = Banner::firstOrCreate(
            ['nome' => 'Banner Principal'], // condição
            ['imagem' => 'banner.jpg']     // valores caso precise criar
        );

        // Cria a loja com o id do banner
        Shop::updateOrCreate(
            ['id' => 1], // força o ID 1
            [
                'id_banner' => $banner->id,
                // adicione outros campos, se houver
            ]
        );
    }
}
