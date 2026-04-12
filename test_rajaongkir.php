<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$service = app(Modules\Shipping\Services\RajaongkirService::class);
echo "KEY: " . config('rajaongkir.api_key') . "\n";
echo "URL: " . config('rajaongkir.base_url') . "\n";
print_r($service->getProvinces());
