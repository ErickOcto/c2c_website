<?php

namespace Modules\Shipping\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\Shipping\Services\RajaongkirService;

class ShippingController extends Controller
{
    public function __construct(
        private RajaongkirService $rajaongkirService,
    ) {}

    /**
     * Get all provinces.
     */
    public function provinces(): JsonResponse
    {
        $provinces = $this->rajaongkirService->getProvinces();

        return response()->json(['provinces' => $provinces]);
    }

    /**
     * Get cities, optionally filtered by province.
     */
    public function cities(Request $request): JsonResponse
    {
        $provinceId = $request->query('province_id')
            ? (int) $request->query('province_id')
            : null;

        $cities = $this->rajaongkirService->getCities($provinceId);

        return response()->json(['cities' => $cities]);
    }
}
