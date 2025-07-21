<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Shop;
use Carbon\Carbon;


class VerificarLojaAberta extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:verificar-loja-aberta';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
  public function handle()
{
    $shop = Shop::first();

    

    if (!$shop) return;

    if ($shop->hora_abertura && $shop->hora_fechamento) {
        // Converte as strings para Carbon com data atual
        $agora = Carbon::now();
        
        // Pega hoje com hora da abertura e fechamento
        $abertura = Carbon::createFromFormat('H:i:s', $shop->hora_abertura)->setDate($agora->year, $agora->month, $agora->day);
        $fechamento = Carbon::createFromFormat('H:i:s', $shop->hora_fechamento)->setDate($agora->year, $agora->month, $agora->day);


        // Se a hora de fechamento for menor que a abertura, quer dizer que atravessa a meia-noite
        if ($fechamento->lessThanOrEqualTo($abertura)) {
            // Fecha no dia seguinte
            $fechamento->addDay();
            $this->info($fechamento);
            // Se a hora atual for menor que abertura, assumimos que ela é depois da meia-noite, então soma 1 dia
            if ($agora->lessThan($abertura)) {
                $agora->addDay();
            }
        }

        $statusDesejado = $agora->between($abertura, $fechamento);

$this->info("Hora agora: {$agora->format('Y-m-d H:i:s')}");
$this->info("Abertura: {$abertura->format('Y-m-d H:i:s')}");
$this->info("Fechamento: {$fechamento->format('Y-m-d H:i:s')}");
$this->info("Status desejado (loja aberta?): " . ($statusDesejado ? 'Sim' : 'Não'));


        if ($shop->loja_aberta !== $statusDesejado) {
            $shop->loja_aberta = $statusDesejado;
            $shop->save();
        }
    
    }
}
}
