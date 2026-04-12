<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://rajaongkir.komerce.id/api/v1/destination/city?province_id=5");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["key: Eb83qNB626bdf8b07fb9355fbdlD3TEM"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
echo $response;
