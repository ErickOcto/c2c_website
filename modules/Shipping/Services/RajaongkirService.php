<?php

namespace Modules\Shipping\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RajaongkirService
{
    private string $apiKey;

    private string $baseUrl;

    /** @var array<int, string> */
    private array $couriers;

    public function __construct()
    {
        $this->apiKey = config('rajaongkir.api_key');
        $this->baseUrl = rtrim(config('rajaongkir.base_url'), '/');
        $this->couriers = config('rajaongkir.couriers');
    }

    /**
     * Fetch all provinces from Rajaongkir Komerce API.
     * Endpoint: GET /destination/province
     *
     * @return array<int, array{province_id: string, province: string}>
     */
    public function getProvinces(): array
    {
        $cacheKey = 'rajaongkir_provinces';
        $cached = Cache::get($cacheKey);

        if ($cached) {
            return $cached;
        }

        $response = Http::withHeaders([
            'key' => $this->apiKey,
        ])->get("{$this->baseUrl}/destination/province");

        if ($response->failed() || empty($response->json('data'))) {
            Log::error('Rajaongkir: Failed to fetch provinces', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [];
        }

        $results = collect($response->json('data', []))->map(function ($item) {
            return [
                'province_id' => $item['id'],
                'province' => $item['name'],
            ];
        })->all();
        
        Cache::put($cacheKey, $results, 60 * 60 * 24);

        return $results;
    }

    /**
     * Fetch cities for a given province.
     * Endpoint: GET /destination/city/{province_id}
     *
     * @return array<int, array{city_id: string, province_id: string, province: string, type: string, city_name: string, postal_code: string}>
     */
    public function getCities(?int $provinceId = null): array
    {
        $cacheKey = "rajaongkir_cities_{$provinceId}";
        $cached = Cache::get($cacheKey);

        if ($cached) {
            return $cached;
        }

        $url = $provinceId !== null
            ? "{$this->baseUrl}/destination/city/{$provinceId}"
            : "{$this->baseUrl}/destination/city";

        $response = Http::withHeaders([
            'key' => $this->apiKey,
        ])->get($url);

        if ($response->failed() || empty($response->json('data'))) {
            Log::error('Rajaongkir: Failed to fetch cities', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [];
        }

        $results = collect($response->json('data', []))->map(function ($item) use ($provinceId) {
            return [
                'city_id' => $item['id'],
                'province_id' => $provinceId ?? 0,
                'city_name' => $item['name'],
                'type' => '', // API v1 doesn't separate type
                'postal_code' => $item['zip_code'] ?? '',
            ];
        })->all();
        
        Cache::put($cacheKey, $results, 60 * 60 * 24);

        return $results;
    }

    /**
     * Calculate shipping cost between two cities.
     * Endpoint: POST /calculate/domestic-cost
     *
     * @return array<int, array{code: string, name: string, costs: array<int, array{service: string, description: string, cost: array<int, array{value: int, etd: string, note: string}>}>}>
     */
    public function calculateCost(int $origin, int $destination, int $weight, string $courier): array
    {
        $response = Http::withHeaders([
            'key' => $this->apiKey,
        ])->asForm()->post("{$this->baseUrl}/calculate/domestic-cost", [
            'origin' => $origin,
            'destination' => $destination,
            'weight' => $weight,
            'courier' => $courier,
        ]);

        if ($response->failed() || empty($response->json('data'))) {
            Log::error('Rajaongkir: Failed to calculate cost', [
                'status' => $response->status(),
                'body' => $response->body(),
                'params' => compact('origin', 'destination', 'weight', 'courier'),
            ]);

            return [];
        }

        // Map the new Komerce format to the expected old format structure
        $data = $response->json('data', []);
        
        if (empty($data)) return [];

        $costs = collect($data)->map(function ($service) {
            return [
                'service' => $service['service'] ?? '',
                'description' => $service['description'] ?? '',
                'cost' => [
                    [
                        'value' => $service['cost'] ?? 0,
                        'etd' => $service['etd'] ?? '',
                        'note' => '',
                    ]
                ]
            ];
        })->all();

        return [
            [
                'code' => strtolower($data[0]['code'] ?? $courier),
                'name' => $data[0]['name'] ?? strtoupper($courier),
                'costs' => $costs,
            ]
        ];
    }

    /**
     * Calculate shipping cost for all available couriers.
     *
     * @return array<string, array<int, array{service: string, description: string, cost: array<int, array{value: int, etd: string, note: string}>}>>
     */
    public function calculateCostAllCouriers(int $origin, int $destination, int $weight): array
    {
        $results = [];

        foreach ($this->couriers as $courier) {
            $courierResults = $this->calculateCost($origin, $destination, $weight, $courier);

            foreach ($courierResults as $result) {
                $results[$result['code']] = $result['costs'];
            }
        }

        return $results;
    }
}
