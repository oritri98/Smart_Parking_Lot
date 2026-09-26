<?php

namespace App\Http\Controllers;

use App\Services\IpmsDataStore;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IpmsApiController extends Controller
{
    public function root(): JsonResponse
    {
        return response()->json([
            'service'   => 'AUST Intelligent Parking Management System (AUST-IPMS) Backend',
            'version'   => '1.0.0',
            'status'    => 'Operational',
            'campus'    => 'Ahsanullah University of Science and Technology (AUST)',
            'location'  => '141 & 142 Love Road, Tejgaon Industrial Area, Dhaka-1208, Bangladesh',
            'framework' => 'Laravel 12 / PHP 8.2',
            'docsUrl'   => '/docs',
        ]);
    }

    // ────────────────────────────────────────────────────────
    // PARKING
    // ────────────────────────────────────────────────────────
    public function getParkingStatus(Request $request): JsonResponse
    {
        $basement = $request->query('basement');
        return response()->json(IpmsDataStore::getZones($basement));
    }

    public function getZoneById(string $zoneId): JsonResponse
    {
        $zone = IpmsDataStore::getZoneById($zoneId);
        if (!$zone) {
            return response()->json(['detail' => 'Zone not found'], 404);
        }
        return response()->json($zone);
    }

    public function getParkingSlots(Request $request): JsonResponse
    {
        $zoneId = $request->query('zoneId');
        return response()->json(IpmsDataStore::getSlots($zoneId));
    }

    public function refreshParkingStatus(): JsonResponse
    {
        $zones = IpmsDataStore::refreshZones();
        return response()->json([
            'message' => 'Parking status refreshed successfully',
            'zones'   => $zones,
        ]);
    }

    // ────────────────────────────────────────────────────────
    // ANALYTICS
    // ────────────────────────────────────────────────────────
    public function getDashboardStats(): JsonResponse
    {
        return response()->json(IpmsDataStore::getDashboardStats());
    }

    public function getHourlyData(): JsonResponse
    {
        return response()->json(IpmsDataStore::getHourlyData());
    }

    public function getDailyData(): JsonResponse
    {
        return response()->json(IpmsDataStore::getDailyData());
    }

    public function getWeeklyComparison(): JsonResponse
    {
        return response()->json(IpmsDataStore::getWeeklyComparison());
    }

    public function predictDemand(): JsonResponse
    {
        return response()->json([
            'predictedOccupancyRate' => 89.4,
            'peakTimeWindow'         => '09:30 AM - 11:15 AM',
            'recommendedAction'      => 'Advise student overflow to Annex slots',
            'confidence'             => 0.94,
        ]);
    }

    // ────────────────────────────────────────────────────────
    // VEHICLES & LPR POLICY
    // ────────────────────────────────────────────────────────
    public function vehicleEntry(Request $request): JsonResponse
    {
        $plate = $request->input('plateNumber') ?? $request->input('plate_number') ?? $request->json('plateNumber');
        if (!$plate) {
            return response()->json(['detail' => 'plateNumber is required'], 422);
        }

        $category    = $request->input('ownerCategory') ?? $request->input('owner_category') ?? $request->json('ownerCategory');
        $vehicleType = $request->input('vehicleType') ?? $request->input('vehicle_type') ?? $request->json('vehicleType');

        $record = IpmsDataStore::addVehicleEntry($plate, $category, $vehicleType);

        return response()->json([
            'message' => 'Vehicle entry registered',
            'record'  => $record,
        ]);
    }

    public function vehicleExit(Request $request): JsonResponse
    {
        $plate = $request->input('plateNumber') ?? $request->input('plate_number') ?? $request->json('plateNumber');
        if (!$plate) {
            return response()->json(['detail' => 'plateNumber is required'], 422);
        }

        $record = IpmsDataStore::recordVehicleExit($plate);
        if (!$record) {
            return response()->json(['detail' => 'Active vehicle record not found'], 404);
        }

        return response()->json([
            'message' => 'Vehicle exit recorded',
            'record'  => $record,
        ]);
    }

    public function getVehicles(): JsonResponse
    {
        return response()->json(IpmsDataStore::getVehicles());
    }

    public function getVehicleByPlate(string $plateNumber): JsonResponse
    {
        $record = IpmsDataStore::getVehicleByPlate($plateNumber);
        if (!$record) {
            return response()->json(['detail' => 'Vehicle not found'], 404);
        }
        return response()->json($record);
    }

    // ────────────────────────────────────────────────────────
    // CAMERAS
    // ────────────────────────────────────────────────────────
    public function getCameras(): JsonResponse
    {
        return response()->json(IpmsDataStore::getCameras());
    }

    public function getCamera(string $cameraId): JsonResponse
    {
        $cam = IpmsDataStore::getCameraById($cameraId);
        if (!$cam) {
            return response()->json(['detail' => 'Camera not found'], 404);
        }
        return response()->json($cam);
    }

    // ────────────────────────────────────────────────────────
    // AUTHENTICATION
    // Credentials are stored ONLY as bcrypt hashes in .env
    // No plaintext passwords appear anywhere in source code.
    // ────────────────────────────────────────────────────────

    /**
     * Generate a HMAC-SHA256 signed session token.
     * Payload: base64( email "|" expiry_unix_timestamp )
     * Signature: HMAC-SHA256( payload, APP_KEY + "_ipms_session" )
     */
    private function generateToken(string $email, int $lifetimeDays = 7): string
    {
        $expiry  = time() + ($lifetimeDays * 86400);
        $payload = base64_encode($email . '|' . $expiry);
        $secret  = config('app.key') . '_ipms_session';
        $sig     = hash_hmac('sha256', $payload, $secret);
        return $payload . '.' . $sig;
    }

    /**
     * Validate a signed session token.
     * Returns authenticated email on success, or null if invalid / expired.
     */
    private function validateToken(string $token): ?string
    {
        $parts = explode('.', $token, 2);
        if (count($parts) !== 2) {
            return null;
        }

        [$payload, $providedSig] = $parts;
        $secret      = config('app.key') . '_ipms_session';
        $expectedSig = hash_hmac('sha256', $payload, $secret);

        // Constant-time comparison prevents timing-attack on signature
        if (!hash_equals($expectedSig, $providedSig)) {
            return null;
        }

        $decoded  = base64_decode($payload, true);
        $segments = explode('|', $decoded, 2);
        if (count($segments) !== 2) {
            return null;
        }

        [$email, $expiry] = $segments;

        if (time() > (int) $expiry) {
            return null; // Session expired
        }

        return $email;
    }

    /**
     * POST /api/v1/auth/login
     * Body: { "email": "...", "password": "..." }
     */
    public function login(Request $request): JsonResponse
    {
        $email    = strtolower(trim($request->input('email', '')));
        $password = $request->input('password', '');

        if (!$email || !$password) {
            return response()->json(['detail' => 'Email and password are required.'], 422);
        }

        // Load credentials from .env (bcrypt hashes — never plaintext in source)
        $adminEmail = strtolower(trim(env('IPMS_ADMIN_EMAIL', '')));
        $adminHash  = env('IPMS_ADMIN_HASH', '');

        // Verify email + bcrypt hash
        if ($email !== $adminEmail || !password_verify($password, $adminHash)) {
            // Artificial delay to prevent user-enumeration via response timing
            usleep(300000); // 300 ms
            return response()->json(['detail' => 'Invalid credentials. Access denied.'], 401);
        }

        $lifetimeDays = (int) env('IPMS_SESSION_LIFETIME_DAYS', 7);
        $token        = $this->generateToken($email, $lifetimeDays);

        IpmsDataStore::addAdminLog(
            'Admin Auth',
            $email,
            'Successful authentication from ' . ($request->ip() ?? 'unknown') . '. Session valid for ' . $lifetimeDays . ' days.'
        );

        return response()->json([
            'accessToken' => $token,
            'tokenType'   => 'Bearer',
            'expiresIn'   => $lifetimeDays * 86400,
            'user'        => [
                'id'          => 'u-admin-001',
                'name'        => env('IPMS_ADMIN_NAME', 'System Administrator'),
                'email'       => $email,
                'role'        => 'admin',
                'department'  => env('IPMS_ADMIN_DEPT', 'ICT Center — AUST'),
                'employeeId'  => env('IPMS_ADMIN_EMP_ID', 'ICT-ADMIN-001'),
                'phone'       => '+880-2-8870422',
                'joinedDate'  => '2024-01-01',
                'lastLogin'   => now()->toIso8601String(),
                'institution' => 'Ahsanullah University of Science and Technology',
            ],
        ]);
    }

    /**
     * POST /api/v1/auth/register  — stub endpoint
     */
    public function register(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Registration received for validation by Proctor Office',
            'status'  => 'Pending Verification',
        ]);
    }

    /**
     * POST /api/v1/auth/logout
     */
    public function logout(): JsonResponse
    {
        return response()->json(['message' => 'Logged out successfully.']);
    }

    /**
     * GET /api/v1/auth/me
     * Validates the Bearer token and returns the authenticated user's profile.
     */
    public function getCurrentUser(Request $request): JsonResponse
    {
        $authHeader = $request->header('Authorization', '');
        $token      = str_starts_with($authHeader, 'Bearer ')
            ? substr($authHeader, 7)
            : '';

        if (!$token) {
            return response()->json(['detail' => 'No authentication token provided.'], 401);
        }

        $email = $this->validateToken($token);
        if (!$email) {
            return response()->json(['detail' => 'Token invalid or session expired. Please re-authenticate.'], 401);
        }

        return response()->json([
            'id'          => 'u-admin-001',
            'name'        => env('IPMS_ADMIN_NAME', 'System Administrator'),
            'email'       => $email,
            'role'        => 'admin',
            'department'  => env('IPMS_ADMIN_DEPT', 'ICT Center — AUST'),
            'employeeId'  => env('IPMS_ADMIN_EMP_ID', 'ICT-ADMIN-001'),
            'phone'       => '+880-2-8870422',
            'joinedDate'  => '2024-01-01',
            'lastLogin'   => now()->toIso8601String(),
            'institution' => 'Ahsanullah University of Science and Technology',
        ]);
    }

    // ────────────────────────────────────────────────────────
    // NOTIFICATIONS
    // ────────────────────────────────────────────────────────
    public function getNotifications(): JsonResponse
    {
        return response()->json(IpmsDataStore::getNotifications());
    }

    public function markNotificationRead(string $id): JsonResponse
    {
        $notif = IpmsDataStore::markNotificationRead($id);
        if (!$notif) {
            return response()->json(['detail' => 'Notification not found'], 404);
        }
        return response()->json($notif);
    }

    // ────────────────────────────────────────────────────────
    // ADMIN
    // ────────────────────────────────────────────────────────
    public function getAdminUsers(): JsonResponse
    {
        return response()->json(IpmsDataStore::getAdminUsers());
    }

    public function getAdminLogs(): JsonResponse
    {
        return response()->json(IpmsDataStore::getAdminLogs());
    }

    public function updateZone(Request $request, string $id): JsonResponse
    {
        $zone = IpmsDataStore::updateZone($id, $request->all());
        if (!$zone) {
            return response()->json(['detail' => 'Zone not found'], 404);
        }
        return response()->json($zone);
    }
}
