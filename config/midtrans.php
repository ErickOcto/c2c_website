<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Midtrans Server Key
    |--------------------------------------------------------------------------
    |
    | Your Midtrans server key. Used for server-side API calls such as
    | creating transactions and verifying webhook signatures.
    |
    */
    'server_key' => env('MIDTRANS_SERVER_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Midtrans Client Key
    |--------------------------------------------------------------------------
    |
    | Your Midtrans client key. Used on the frontend for Snap.js.
    |
    */
    'client_key' => env('MIDTRANS_CLIENT_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Production Mode
    |--------------------------------------------------------------------------
    |
    | Set to true for production. When false, Midtrans uses sandbox mode.
    |
    */
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),

    /*
    |--------------------------------------------------------------------------
    | Sanitized
    |--------------------------------------------------------------------------
    |
    | Enable input sanitization for the Midtrans API.
    |
    */
    'is_sanitized' => env('MIDTRANS_IS_SANITIZED', true),

    /*
    |--------------------------------------------------------------------------
    | 3DS
    |--------------------------------------------------------------------------
    |
    | Enable 3D Secure for card payments.
    |
    */
    'is_3ds' => env('MIDTRANS_IS_3DS', true),

];
