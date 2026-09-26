<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class IpmsDataStore
{
    private const ZONES_KEY = 'ipms_zones';
    private const SLOTS_KEY = 'ipms_slots';
    private const VEHICLES_KEY = 'ipms_vehicles';
    private const NOTIFICATIONS_KEY = 'ipms_notifications';
    private const ADMIN_LOGS_KEY = 'ipms_admin_logs';

    public static function init(): void
    {
        if (!Cache::has(self::ZONES_KEY)) {
            Cache::forever(self::ZONES_KEY, [
                [
                    'id' => 'student-b1',
                    'name' => 'Student Parking Zone',
                    'basement' => 'B1',
                    'category' => 'Student',
                    'totalSlots' => 140,
                    'occupiedSlots' => 118,
                    'availableSlots' => 22,
                    'occupancyPercentage' => 84.0,
                    'status' => 'Limited',
                    'lastUpdated' => Carbon::now()->toIso8601String(),
                    'description' => 'Primary student vehicle parking zone located in Basement 1. Accessible via B1 main ramp.',
                    'floor' => 'Basement 1',
                ],
                [
                    'id' => 'faculty-b2',
                    'name' => 'Faculty Parking Zone',
                    'basement' => 'B2',
                    'category' => 'Faculty',
                    'totalSlots' => 50,
                    'occupiedSlots' => 33,
                    'availableSlots' => 17,
                    'occupancyPercentage' => 66.0,
                    'status' => 'Available',
                    'lastUpdated' => Carbon::now()->toIso8601String(),
                    'description' => 'Designated faculty and staff vehicle parking zone in Basement 2.',
                    'floor' => 'Basement 2',
                ],
                [
                    'id' => 'guest-b2',
                    'name' => 'Guest & Visitor Parking Zone',
                    'basement' => 'B2',
                    'category' => 'Guest',
                    'totalSlots' => 30,
                    'occupiedSlots' => 21,
                    'availableSlots' => 9,
                    'occupancyPercentage' => 70.0,
                    'status' => 'Available',
                    'lastUpdated' => Carbon::now()->toIso8601String(),
                    'description' => 'Guest and visitor vehicle parking zone located in Basement 2. Managed by campus security.',
                    'floor' => 'Basement 2',
                ],
            ]);
        }

        if (!Cache::has(self::SLOTS_KEY)) {
            $generateSlots = function ($prefix, $zoneId, $total, $occupied) {
                $slots = [];
                for ($i = 1; $i <= $total; $i++) {
                    $isOccupied = $i <= $occupied;
                    $slots[] = [
                        'id' => strtolower($prefix) . '-' . $i,
                        'slotNumber' => strtoupper($prefix) . '-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                        'zoneId' => $zoneId,
                        'status' => $isOccupied ? 'Occupied' : 'Available',
                        'vehiclePlate' => $isOccupied ? 'DHK-METRO-' . (1000 + $i) : null,
                        'occupiedSince' => $isOccupied ? Carbon::now()->toIso8601String() : null,
                    ];
                }
                return $slots;
            };

            Cache::forever(self::SLOTS_KEY, [
                'student-b1' => $generateSlots('S', 'student-b1', 140, 118),
                'faculty-b2' => $generateSlots('F', 'faculty-b2', 50, 33),
                'guest-b2' => $generateSlots('G', 'guest-b2', 30, 21),
            ]);
        }

        if (!Cache::has(self::VEHICLES_KEY)) {
            Cache::forever(self::VEHICLES_KEY, [
                [
                    'plateNumber' => 'DHAKA-METRO-GA-11-2233',
                    'ownerCategory' => 'Faculty',
                    'registrationStatus' => 'Registered',
                    'assignedZone' => 'Faculty',
                    'basement' => 'B2',
                    'vehicleType' => 'Car',
                    'entryTime' => Carbon::now()->toIso8601String(),
                    'exitTime' => null,
                ],
                [
                    'plateNumber' => 'DHAKA-METRO-KHA-44-5566',
                    'ownerCategory' => 'Student',
                    'registrationStatus' => 'Registered',
                    'assignedZone' => 'Student',
                    'basement' => 'B1',
                    'vehicleType' => 'Motorcycle',
                    'entryTime' => Carbon::now()->toIso8601String(),
                    'exitTime' => null,
                ],
            ]);
        }

        if (!Cache::has(self::NOTIFICATIONS_KEY)) {
            Cache::forever(self::NOTIFICATIONS_KEY, [
                [
                    'id' => 'n-001',
                    'type' => 'alert',
                    'title' => 'Student Zone Nearly Full',
                    'message' => 'B1 Student Parking Zone is at 84% capacity. Only 22 slots remaining.',
                    'timestamp' => Carbon::now()->toIso8601String(),
                    'isRead' => false,
                    'category' => 'parking',
                    'zone' => 'B1',
                ],
                [
                    'id' => 'n-002',
                    'type' => 'warning',
                    'title' => 'Peak Hour Approaching',
                    'message' => 'Predicted high traffic between 9:30 AM – 11:00 AM. Expect limited availability.',
                    'timestamp' => Carbon::now()->toIso8601String(),
                    'isRead' => false,
                    'category' => 'parking',
                ],
                [
                    'id' => 'n-003',
                    'type' => 'info',
                    'title' => 'Maintenance Notice — B2 Entry',
                    'message' => 'Scheduled maintenance on B2 entry barrier system on Thursday after 3:00 PM.',
                    'timestamp' => Carbon::now()->subHour()->toIso8601String(),
                    'isRead' => true,
                    'category' => 'maintenance',
                    'zone' => 'B2',
                ],
                [
                    'id' => 'n-004',
                    'type' => 'info',
                    'title' => "Proctor's Office Announcement",
                    'message' => 'All faculty vehicles must display updated AUST parking stickers by next week.',
                    'timestamp' => Carbon::now()->subHours(2)->toIso8601String(),
                    'isRead' => true,
                    'category' => 'proctor',
                ],
                [
                    'id' => 'n-005',
                    'type' => 'success',
                    'title' => 'System Update Complete',
                    'message' => 'AUST-IPMS dashboard updated successfully.',
                    'timestamp' => Carbon::now()->subDay()->toIso8601String(),
                    'isRead' => true,
                    'category' => 'announcement',
                ],
            ]);
        }

        if (!Cache::has(self::ADMIN_LOGS_KEY)) {
            Cache::forever(self::ADMIN_LOGS_KEY, [
                [
                    'id' => 'log-001',
                    'action' => 'System Started',
                    'operator' => 'system',
                    'timestamp' => Carbon::now()->toIso8601String(),
                    'details' => 'AUST-IPMS Laravel backend service initialized.',
                ],
                [
                    'id' => 'log-002',
                    'action' => 'LPR Engine Heartbeat',
                    'operator' => 'service',
                    'timestamp' => Carbon::now()->toIso8601String(),
                    'details' => 'Gate camera feed online.',
                ],
            ]);
        }
    }

    public static function getZones(?string $basement = null): array
    {
        self::init();
        $zones = Cache::get(self::ZONES_KEY, []);
        if ($basement) {
            return array_values(array_filter($zones, function ($z) use ($basement) {
                return strcasecmp($z['basement'], $basement) === 0;
            }));
        }
        return $zones;
    }

    public static function getZoneById(string $zoneId): ?array
    {
        self::init();
        $zones = Cache::get(self::ZONES_KEY, []);
        foreach ($zones as $zone) {
            if ($zone['id'] === $zoneId) {
                return $zone;
            }
        }
        return null;
    }

    public static function updateZone(string $zoneId, array $data): ?array
    {
        self::init();
        $zones = Cache::get(self::ZONES_KEY, []);
        $updatedZone = null;
        foreach ($zones as &$zone) {
            if ($zone['id'] === $zoneId) {
                if (isset($data['totalSlots'])) $zone['totalSlots'] = (int)$data['totalSlots'];
                if (isset($data['occupiedSlots'])) $zone['occupiedSlots'] = (int)$data['occupiedSlots'];
                if (isset($data['status'])) $zone['status'] = $data['status'];
                $zone['availableSlots'] = max(0, $zone['totalSlots'] - $zone['occupiedSlots']);
                $zone['occupancyPercentage'] = $zone['totalSlots'] > 0
                    ? round(($zone['occupiedSlots'] / $zone['totalSlots']) * 100, 1)
                    : 0;
                $zone['lastUpdated'] = Carbon::now()->toIso8601String();
                $updatedZone = $zone;
                break;
            }
        }
        if ($updatedZone) {
            Cache::forever(self::ZONES_KEY, $zones);
        }
        return $updatedZone;
    }

    public static function refreshZones(): array
    {
        self::init();
        $zones = Cache::get(self::ZONES_KEY, []);
        $now = Carbon::now()->toIso8601String();
        foreach ($zones as &$z) {
            $z['lastUpdated'] = $now;
        }
        Cache::forever(self::ZONES_KEY, $zones);
        return $zones;
    }

    public static function getSlots(?string $zoneId = null): array
    {
        self::init();
        $slotsMap = Cache::get(self::SLOTS_KEY, []);
        if ($zoneId) {
            return $slotsMap[$zoneId] ?? [];
        }
        $allSlots = [];
        foreach ($slotsMap as $slots) {
            foreach ($slots as $s) {
                $allSlots[] = $s;
            }
        }
        return $allSlots;
    }

    public static function getDashboardStats(): array
    {
        $zones = self::getZones();
        $totalSlots = array_sum(array_column($zones, 'totalSlots'));
        $occupiedSlots = array_sum(array_column($zones, 'occupiedSlots'));
        $availableSlots = $totalSlots - $occupiedSlots;
        $occupancyRate = $totalSlots > 0 ? round(($occupiedSlots / $totalSlots) * 100, 1) : 0;

        return [
            'totalSlots' => $totalSlots,
            'availableSlots' => $availableSlots,
            'occupiedSlots' => $occupiedSlots,
            'occupancyRate' => $occupancyRate,
            'peakHour' => '9:30 AM – 11:00 AM',
            'predictedDemand' => 87,
            'isSimulated' => false,
            'operatingDays' => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            'totalVehiclesToday' => 194,
            'averageUtilization' => 74.5,
            'activeZones' => count($zones),
        ];
    }

    public static function getHourlyData(): array
    {
        return [
            ['hour' => '7:30', 'student' => 12, 'faculty' => 8, 'guest' => 5, 'total' => 25],
            ['hour' => '8:00', 'student' => 28, 'faculty' => 18, 'guest' => 10, 'total' => 56],
            ['hour' => '8:30', 'student' => 52, 'faculty' => 28, 'guest' => 14, 'total' => 94],
            ['hour' => '9:00', 'student' => 88, 'faculty' => 38, 'guest' => 18, 'total' => 144],
            ['hour' => '9:30', 'student' => 118, 'faculty' => 44, 'guest' => 22, 'total' => 184],
            ['hour' => '10:00', 'student' => 128, 'faculty' => 46, 'guest' => 24, 'total' => 198],
            ['hour' => '10:30', 'student' => 132, 'faculty' => 47, 'guest' => 25, 'total' => 204],
            ['hour' => '11:00', 'student' => 130, 'faculty' => 46, 'guest' => 24, 'total' => 200],
            ['hour' => '11:30', 'student' => 120, 'faculty' => 42, 'guest' => 20, 'total' => 182],
            ['hour' => '12:00', 'student' => 108, 'faculty' => 38, 'guest' => 18, 'total' => 164],
            ['hour' => '12:30', 'student' => 102, 'faculty' => 36, 'guest' => 16, 'total' => 154],
            ['hour' => '13:00', 'student' => 118, 'faculty' => 44, 'guest' => 22, 'total' => 184],
            ['hour' => '13:30', 'student' => 126, 'faculty' => 46, 'guest' => 23, 'total' => 195],
            ['hour' => '14:00', 'student' => 122, 'faculty' => 45, 'guest' => 21, 'total' => 188],
            ['hour' => '14:30', 'student' => 110, 'faculty' => 40, 'guest' => 18, 'total' => 168],
            ['hour' => '15:00', 'student' => 98, 'faculty' => 35, 'guest' => 15, 'total' => 148],
            ['hour' => '15:30', 'student' => 88, 'faculty' => 30, 'guest' => 12, 'total' => 130],
            ['hour' => '16:00', 'student' => 74, 'faculty' => 24, 'guest' => 10, 'total' => 108],
            ['hour' => '16:30', 'student' => 60, 'faculty' => 18, 'guest' => 8, 'total' => 86],
            ['hour' => '17:00', 'student' => 44, 'faculty' => 12, 'guest' => 6, 'total' => 62],
            ['hour' => '17:30', 'student' => 32, 'faculty' => 8, 'guest' => 4, 'total' => 44],
            ['hour' => '18:00', 'student' => 20, 'faculty' => 4, 'guest' => 3, 'total' => 27],
            ['hour' => '18:30', 'student' => 12, 'faculty' => 2, 'guest' => 2, 'total' => 16],
            ['hour' => '19:00', 'student' => 6, 'faculty' => 1, 'guest' => 1, 'total' => 8],
            ['hour' => '19:30', 'student' => 3, 'faculty' => 0, 'guest' => 1, 'total' => 4],
            ['hour' => '20:00', 'student' => 1, 'faculty' => 0, 'guest' => 0, 'total' => 1],
        ];
    }

    public static function getDailyData(): array
    {
        return [
            ['day' => 'Sunday', 'student' => 82, 'faculty' => 68, 'guest' => 55, 'total' => 74, 'date' => '2026-06-01'],
            ['day' => 'Monday', 'student' => 88, 'faculty' => 72, 'guest' => 60, 'total' => 78, 'date' => '2026-06-02'],
            ['day' => 'Tuesday', 'student' => 90, 'faculty' => 74, 'guest' => 62, 'total' => 80, 'date' => '2026-06-03'],
            ['day' => 'Wednesday', 'student' => 86, 'faculty' => 70, 'guest' => 58, 'total' => 76, 'date' => '2026-06-04'],
            ['day' => 'Thursday', 'student' => 68, 'faculty' => 52, 'guest' => 45, 'total' => 60, 'date' => '2026-06-05'],
        ];
    }

    public static function getWeeklyComparison(): array
    {
        return [
            ['week' => 'Week 1', 'thisWeek' => 78, 'lastWeek' => 72, 'predicted' => 80],
            ['week' => 'Week 2', 'thisWeek' => 82, 'lastWeek' => 75, 'predicted' => 83],
            ['week' => 'Week 3', 'thisWeek' => 76, 'lastWeek' => 80, 'predicted' => 78],
            ['week' => 'Week 4', 'thisWeek' => 84, 'lastWeek' => 78, 'predicted' => 86],
        ];
    }

    public static function getVehicles(): array
    {
        self::init();
        return Cache::get(self::VEHICLES_KEY, []);
    }

    public static function getVehicleByPlate(string $plate): ?array
    {
        self::init();
        $vehicles = Cache::get(self::VEHICLES_KEY, []);
        foreach ($vehicles as $v) {
            if (strcasecmp($v['plateNumber'], $plate) === 0) {
                return $v;
            }
        }
        return null;
    }

    public static function addVehicleEntry(string $plateNumber, ?string $ownerCategory, ?string $vehicleType): array
    {
        self::init();
        // AUST Classification Policy:
        // Registered Student -> B1 Student Zone
        // Registered Faculty -> B2 Faculty Zone
        // Unregistered / Guest -> B2 Guest Zone. Never "Unknown"!
        $cat = ucfirst(strtolower($ownerCategory ?? 'Guest'));
        if (!in_array($cat, ['Student', 'Faculty', 'Guest'])) {
            $cat = 'Guest';
        }

        $assignedZone = $cat;
        $basement = $cat === 'Student' ? 'B1' : 'B2';
        $regStatus = in_array($cat, ['Student', 'Faculty']) ? 'Registered' : 'Unregistered';

        $record = [
            'plateNumber' => strtoupper($plateNumber),
            'ownerCategory' => $cat,
            'registrationStatus' => $regStatus,
            'assignedZone' => $assignedZone,
            'basement' => $basement,
            'vehicleType' => $vehicleType ?: 'Car',
            'entryTime' => Carbon::now()->toIso8601String(),
            'exitTime' => null,
        ];

        $vehicles = Cache::get(self::VEHICLES_KEY, []);
        array_unshift($vehicles, $record);
        Cache::forever(self::VEHICLES_KEY, $vehicles);

        self::addAdminLog(
            'Vehicle Entry: ' . $record['plateNumber'],
            'LPR_GATE',
            "Allocated to {$basement} {$assignedZone} Zone."
        );

        return $record;
    }

    public static function recordVehicleExit(string $plateNumber): ?array
    {
        self::init();
        $vehicles = Cache::get(self::VEHICLES_KEY, []);
        $found = null;
        foreach ($vehicles as &$v) {
            if (strcasecmp($v['plateNumber'], $plateNumber) === 0 && empty($v['exitTime'])) {
                $v['exitTime'] = Carbon::now()->toIso8601String();
                $found = $v;
                break;
            }
        }
        if ($found) {
            Cache::forever(self::VEHICLES_KEY, $vehicles);
            self::addAdminLog(
                'Vehicle Exit: ' . strtoupper($plateNumber),
                'LPR_GATE',
                'Barrier open. Vehicle exited parking facility.'
            );
        }
        return $found;
    }

    public static function getCameras(): array
    {
        return [
            ['id' => 'cam-001', 'name' => 'B1 Entry Gate', 'location' => 'Basement 1 — Main Entry', 'basement' => 'B1', 'status' => 'Online', 'detectionStatus' => 'Active', 'position' => 'Entry'],
            ['id' => 'cam-002', 'name' => 'B1 Zone A — North', 'location' => 'Basement 1 — Zone A North', 'basement' => 'B1', 'status' => 'Online', 'detectionStatus' => 'Active', 'position' => 'Interior'],
            ['id' => 'cam-003', 'name' => 'B1 Zone A — South', 'location' => 'Basement 1 — Zone A South', 'basement' => 'B1', 'status' => 'Online', 'detectionStatus' => 'Active', 'position' => 'Interior'],
            ['id' => 'cam-004', 'name' => 'B2 Entry Gate', 'location' => 'Basement 2 — Main Entry', 'basement' => 'B2', 'status' => 'Online', 'detectionStatus' => 'Active', 'position' => 'Entry'],
            ['id' => 'cam-005', 'name' => 'B2 Faculty Area', 'location' => 'Basement 2 — Faculty Zone', 'basement' => 'B2', 'status' => 'Online', 'detectionStatus' => 'Active', 'position' => 'Interior'],
            ['id' => 'cam-006', 'name' => 'B2 Guest Area', 'location' => 'Basement 2 — Guest Zone', 'basement' => 'B2', 'status' => 'Online', 'detectionStatus' => 'Active', 'position' => 'Interior'],
            ['id' => 'cam-007', 'name' => 'Main Gate — Exterior', 'location' => 'Campus Main Gate', 'basement' => 'Main', 'status' => 'Online', 'detectionStatus' => 'Active', 'position' => 'Exterior'],
            ['id' => 'cam-008', 'name' => 'B1 Exit Gate', 'location' => 'Basement 1 — Exit', 'basement' => 'B1', 'status' => 'Online', 'detectionStatus' => 'Active', 'position' => 'Exit'],
        ];
    }

    public static function getCameraById(string $id): ?array
    {
        foreach (self::getCameras() as $cam) {
            if ($cam['id'] === $id) {
                return $cam;
            }
        }
        return null;
    }

    public static function getNotifications(): array
    {
        self::init();
        return Cache::get(self::NOTIFICATIONS_KEY, []);
    }

    public static function markNotificationRead(string $id): ?array
    {
        self::init();
        $notifs = Cache::get(self::NOTIFICATIONS_KEY, []);
        $updated = null;
        foreach ($notifs as &$n) {
            if ($n['id'] === $id) {
                $n['isRead'] = true;
                $updated = $n;
                break;
            }
        }
        if ($updated) {
            Cache::forever(self::NOTIFICATIONS_KEY, $notifs);
        }
        return $updated;
    }

    public static function getAdminUsers(): array
    {
        return [
            ['id' => 'u-001', 'name' => 'Prof. Dr. Campus Proctor', 'role' => 'Proctor', 'email' => 'proctor@aust.edu'],
            ['id' => 'u-002', 'name' => 'Security Chief Officer', 'role' => 'Security', 'email' => 'security@aust.edu'],
            ['id' => 'u-003', 'name' => 'Lead System Architect', 'role' => 'Admin', 'email' => 'architect@aust.edu'],
        ];
    }

    public static function getAdminLogs(): array
    {
        self::init();
        return Cache::get(self::ADMIN_LOGS_KEY, []);
    }

    public static function addAdminLog(string $action, string $operator, string $details): void
    {
        self::init();
        $logs = Cache::get(self::ADMIN_LOGS_KEY, []);
        $logs[] = [
            'id' => 'log-' . str_pad((count($logs) + 1), 3, '0', STR_PAD_LEFT),
            'action' => $action,
            'operator' => $operator,
            'timestamp' => Carbon::now()->toIso8601String(),
            'details' => $details,
        ];
        Cache::forever(self::ADMIN_LOGS_KEY, $logs);
    }
}
