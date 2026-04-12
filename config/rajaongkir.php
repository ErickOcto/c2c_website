<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Rajaongkir API Key
    |--------------------------------------------------------------------------
    |
    | Your Rajaongkir "Shipping Cost" API key from the Komerce dashboard.
    | This is the key for checking shipping rates (cek ongkir), provinces,
    | and cities. Do NOT use the "Shipping Delivery" key here.
    |
    | Get your key at: https://collaborator.komerce.id/
    |
    */
    'api_key' => env('RAJAONGKIR_API_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Base URL
    |--------------------------------------------------------------------------
    |
    | The Rajaongkir API has migrated to the Komerce platform.
    | Use: https://rajaongkir.komerce.id/api/v1
    |
    */
    'base_url' => env('RAJAONGKIR_BASE_URL', 'https://rajaongkir.komerce.id/api/v1'),

    /*
    |--------------------------------------------------------------------------
    | Available Couriers
    |--------------------------------------------------------------------------
    |
    | The couriers available for shipping cost calculations.
    | Common: jne, pos, tiki, jnt, sicepat, anteraja
    |
    */
    'couriers' => explode(',', env('RAJAONGKIR_COURIERS', 'jne,pos,tiki')),

];
