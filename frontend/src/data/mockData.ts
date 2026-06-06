import type { ParkingZone, DashboardStats, HourlyData, DailyData, WeeklyComparison, CameraFeed, ParkingSlot, Notification } from '../types';

// ──────────────────────────────────────────────────────────
// PARKING ZONES — Total 220 slots across B1 and B2
// ──────────────────────────────────────────────────────────
export const parkingZones: ParkingZone[] = [
  {
    id: 'student-b1',
    name: 'Student Parking Zone',
    basement: 'B1',
    category: 'Student',
    totalSlots: 140,
    occupiedSlots: 118,
    availableSlots: 22,
    occupancyPercentage: 84,
    status: 'Limited',
    lastUpdated: new Date(),
    description: 'Primary student vehicle parking zone located in Basement 1. Accessible via B1 main ramp.',
    floor: 'Basement 1',
  },
  {
    id: 'faculty-b2',
    name: 'Faculty Parking Zone',
    basement: 'B2',
    category: 'Faculty',
    totalSlots: 50,
    occupiedSlots: 33,
    availableSlots: 17,
    occupancyPercentage: 66,
    status: 'Available',
    lastUpdated: new Date(),
    description: 'Designated faculty and staff vehicle parking zone in Basement 2.',
    floor: 'Basement 2',
  },
  {
    id: 'guest-b2',
    name: 'Guest & Visitor Parking Zone',
    basement: 'B2',
    category: 'Guest',
    totalSlots: 30,
    occupiedSlots: 21,
    availableSlots: 9,
    occupancyPercentage: 70,
    status: 'Available',
    lastUpdated: new Date(),
    description: 'Guest and visitor vehicle parking zone located in Basement 2. Managed by campus security.',
    floor: 'Basement 2',
  },
];

// ──────────────────────────────────────────────────────────
// DASHBOARD STATS
// ──────────────────────────────────────────────────────────
export const dashboardStats: DashboardStats = {
  totalSlots: 220,
  availableSlots: 48,
  occupiedSlots: 172,
  occupancyRate: 78.2,
  peakHour: '9:30 AM – 11:00 AM',
  predictedDemand: 87,
  isSimulated: true,
  operatingDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
  totalVehiclesToday: 194,
  averageUtilization: 74.5,
  activeZones: 3,
};

// ──────────────────────────────────────────────────────────
// HOURLY OCCUPANCY (Sunday–Thursday, 7:30 AM – 9:00 PM)
// ──────────────────────────────────────────────────────────
export const hourlyOccupancyData: HourlyData[] = [
  { hour: '7:30', student: 12, faculty: 8, guest: 5, total: 25 },
  { hour: '8:00', student: 28, faculty: 18, guest: 10, total: 56 },
  { hour: '8:30', student: 52, faculty: 28, guest: 14, total: 94 },
  { hour: '9:00', student: 88, faculty: 38, guest: 18, total: 144 },
  { hour: '9:30', student: 118, faculty: 44, guest: 22, total: 184 },
  { hour: '10:00', student: 128, faculty: 46, guest: 24, total: 198 },
  { hour: '10:30', student: 132, faculty: 47, guest: 25, total: 204 },
  { hour: '11:00', student: 130, faculty: 46, guest: 24, total: 200 },
  { hour: '11:30', student: 120, faculty: 42, guest: 20, total: 182 },
  { hour: '12:00', student: 108, faculty: 38, guest: 18, total: 164 },
  { hour: '12:30', student: 102, faculty: 36, guest: 16, total: 154 },
  { hour: '13:00', student: 118, faculty: 44, guest: 22, total: 184 },
  { hour: '13:30', student: 126, faculty: 46, guest: 23, total: 195 },
  { hour: '14:00', student: 122, faculty: 45, guest: 21, total: 188 },
  { hour: '14:30', student: 110, faculty: 40, guest: 18, total: 168 },
  { hour: '15:00', student: 98, faculty: 35, guest: 15, total: 148 },
  { hour: '15:30', student: 88, faculty: 30, guest: 12, total: 130 },
  { hour: '16:00', student: 74, faculty: 24, guest: 10, total: 108 },
  { hour: '16:30', student: 60, faculty: 18, guest: 8, total: 86 },
  { hour: '17:00', student: 44, faculty: 12, guest: 6, total: 62 },
  { hour: '17:30', student: 32, faculty: 8, guest: 4, total: 44 },
  { hour: '18:00', student: 20, faculty: 4, guest: 3, total: 27 },
  { hour: '18:30', student: 12, faculty: 2, guest: 2, total: 16 },
  { hour: '19:00', student: 6, faculty: 1, guest: 1, total: 8 },
  { hour: '19:30', student: 3, faculty: 0, guest: 1, total: 4 },
  { hour: '20:00', student: 1, faculty: 0, guest: 0, total: 1 },
];

// ──────────────────────────────────────────────────────────
// DAILY DATA (Sunday–Thursday)
// ──────────────────────────────────────────────────────────
export const dailyUsageData: DailyData[] = [
  { day: 'Sunday', student: 82, faculty: 68, guest: 55, total: 74, date: '2026-06-01' },
  { day: 'Monday', student: 88, faculty: 72, guest: 60, total: 78, date: '2026-06-02' },
  { day: 'Tuesday', student: 90, faculty: 74, guest: 62, total: 80, date: '2026-06-03' },
  { day: 'Wednesday', student: 86, faculty: 70, guest: 58, total: 76, date: '2026-06-04' },
  { day: 'Thursday', student: 68, faculty: 52, guest: 45, total: 60, date: '2026-06-05' },
];

// ──────────────────────────────────────────────────────────
// WEEKLY COMPARISON
// ──────────────────────────────────────────────────────────
export const weeklyComparisonData: WeeklyComparison[] = [
  { week: 'Week 1', thisWeek: 78, lastWeek: 72, predicted: 80 },
  { week: 'Week 2', thisWeek: 82, lastWeek: 75, predicted: 83 },
  { week: 'Week 3', thisWeek: 76, lastWeek: 80, predicted: 78 },
  { week: 'Week 4', thisWeek: 84, lastWeek: 78, predicted: 86 },
];

// ──────────────────────────────────────────────────────────
// CAMERA FEEDS
// ──────────────────────────────────────────────────────────
export const cameraFeeds: CameraFeed[] = [
  { id: 'cam-001', name: 'B1 Entry Gate', location: 'Basement 1 — Main Entry', basement: 'B1', status: 'Offline', detectionStatus: 'Pending Deployment', position: 'Entry' },
  { id: 'cam-002', name: 'B1 Zone A — North', location: 'Basement 1 — Zone A North', basement: 'B1', status: 'Offline', detectionStatus: 'Pending Deployment', position: 'Interior' },
  { id: 'cam-003', name: 'B1 Zone A — South', location: 'Basement 1 — Zone A South', basement: 'B1', status: 'Offline', detectionStatus: 'Pending Deployment', position: 'Interior' },
  { id: 'cam-004', name: 'B2 Entry Gate', location: 'Basement 2 — Main Entry', basement: 'B2', status: 'Offline', detectionStatus: 'Pending Deployment', position: 'Entry' },
  { id: 'cam-005', name: 'B2 Faculty Area', location: 'Basement 2 — Faculty Zone', basement: 'B2', status: 'Offline', detectionStatus: 'Pending Deployment', position: 'Interior' },
  { id: 'cam-006', name: 'B2 Guest Area', location: 'Basement 2 — Guest Zone', basement: 'B2', status: 'Offline', detectionStatus: 'Pending Deployment', position: 'Interior' },
  { id: 'cam-007', name: 'Main Gate — Exterior', location: 'Campus Main Gate', basement: 'Main', status: 'Offline', detectionStatus: 'Pending Deployment', position: 'Exterior' },
  { id: 'cam-008', name: 'B1 Exit Gate', location: 'Basement 1 — Exit', basement: 'B1', status: 'Offline', detectionStatus: 'Pending Deployment', position: 'Exit' },
];

// ──────────────────────────────────────────────────────────
// SAMPLE PARKING SLOTS (B1 Student Zone — 140 slots)
// ──────────────────────────────────────────────────────────
const generateSlots = (
  zoneId: string,
  total: number,
  occupied: number
): ParkingSlot[] => {
  return Array.from({ length: total }, (_, i) => ({
    id: `${zoneId}-${i + 1}`,
    slotNumber: `${zoneId.toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
    zoneId,
    status: i < occupied ? 'Occupied' : 'Available',
  }));
};

export const studentSlots: ParkingSlot[] = generateSlots('S', 140, 118);
export const facultySlots: ParkingSlot[] = generateSlots('F', 50, 33);
export const guestSlots: ParkingSlot[] = generateSlots('G', 30, 21);

// ──────────────────────────────────────────────────────────
// MOCK NOTIFICATIONS
// ──────────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  {
    id: 'n-001',
    type: 'alert',
    title: 'Student Zone Nearly Full',
    message: 'B1 Student Parking Zone is at 84% capacity. Only 22 slots remaining.',
    timestamp: new Date(),
    isRead: false,
    category: 'parking',
    zone: 'B1',
  },
  {
    id: 'n-002',
    type: 'warning',
    title: 'Peak Hour Approaching',
    message: 'Predicted high traffic between 9:30 AM – 11:00 AM. Expect limited availability.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    isRead: false,
    category: 'parking',
  },
  {
    id: 'n-003',
    type: 'info',
    title: 'Maintenance Notice — B2 Entry',
    message: 'Scheduled maintenance on B2 entry barrier system on Thursday after 3:00 PM.',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    isRead: true,
    category: 'maintenance',
    zone: 'B2',
  },
  {
    id: 'n-004',
    type: 'info',
    title: "Proctor's Office Announcement",
    message: 'All faculty vehicles must display updated AUST parking stickers by next week.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: true,
    category: 'proctor',
  },
  {
    id: 'n-005',
    type: 'success',
    title: 'System Update Complete',
    message: 'AUST-IPMS dashboard updated successfully. Real-time monitoring features pending deployment.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isRead: true,
    category: 'announcement',
  },
];

// ──────────────────────────────────────────────────────────
// OPERATING SCHEDULE
// ──────────────────────────────────────────────────────────
export const operatingSchedule = {
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
  openTime: '7:30 AM',
  closeTime: '9:00 PM',
  peakHours: [
    { label: 'Morning Peak', time: '9:30 AM – 11:00 AM' },
    { label: 'Afternoon Peak', time: '1:00 PM – 2:30 PM' },
  ],
  offPeak: [
    { label: 'Early Morning', time: 'Before 8:00 AM' },
    { label: 'Evening', time: 'After 7:00 PM' },
  ],
  lowActivityNotes: 'Thursday afternoon typically sees reduced activity as many faculty leave early.',
};
