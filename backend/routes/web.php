<?php

use App\Http\Controllers\IpmsApiController;
use Illuminate\Support\Facades\Route;

Route::get('/', [IpmsApiController::class, 'root']);
