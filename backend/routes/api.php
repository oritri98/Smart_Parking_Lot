<?php

use App\Http\Controllers\IpmsApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Parking
    Route::get('/parking-status', [IpmsApiController::class, 'getParkingStatus']);
    Route::get('/parking-status/{zoneId}', [IpmsApiController::class, 'getZoneById']);
    Route::get('/parking-slots', [IpmsApiController::class, 'getParkingSlots']);
    Route::post('/parking-status/refresh', [IpmsApiController::class, 'refreshParkingStatus']);

    // Analytics
    Route::get('/analytics/dashboard', [IpmsApiController::class, 'getDashboardStats']);
    Route::get('/analytics/hourly', [IpmsApiController::class, 'getHourlyData']);
    Route::get('/analytics/daily', [IpmsApiController::class, 'getDailyData']);
    Route::get('/analytics/weekly-comparison', [IpmsApiController::class, 'getWeeklyComparison']);
    Route::post('/analytics/predict', [IpmsApiController::class, 'predictDemand']);

    // Vehicles
    Route::post('/vehicles/entry', [IpmsApiController::class, 'vehicleEntry']);
    Route::post('/vehicles/exit', [IpmsApiController::class, 'vehicleExit']);
    Route::get('/vehicles', [IpmsApiController::class, 'getVehicles']);
    Route::get('/vehicles/{plateNumber}', [IpmsApiController::class, 'getVehicleByPlate']);

    // Cameras
    Route::get('/cameras', [IpmsApiController::class, 'getCameras']);
    Route::get('/cameras/{id}', [IpmsApiController::class, 'getCamera']);

    // Authentication
    Route::post('/auth/login', [IpmsApiController::class, 'login']);
    Route::post('/auth/register', [IpmsApiController::class, 'register']);
    Route::post('/auth/logout', [IpmsApiController::class, 'logout']);
    Route::get('/auth/me', [IpmsApiController::class, 'getCurrentUser']);

    // Notifications
    Route::get('/notifications', [IpmsApiController::class, 'getNotifications']);
    Route::patch('/notifications/{id}/read', [IpmsApiController::class, 'markNotificationRead']);

    // Admin
    Route::get('/admin/users', [IpmsApiController::class, 'getAdminUsers']);
    Route::get('/admin/logs', [IpmsApiController::class, 'getAdminLogs']);
    Route::post('/admin/zones/{id}/update', [IpmsApiController::class, 'updateZone']);
});
