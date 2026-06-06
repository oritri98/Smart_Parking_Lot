// TypeScript interfaces for AUST-IPMS

export interface ParkingZone {
  id: string;
  name: string;
  basement: 'B1' | 'B2';
  category: 'Student' | 'Faculty' | 'Guest';
  totalSlots: number;
  occupiedSlots: number;
  availableSlots: number;
  occupancyPercentage: number;
  status: 'Available' | 'Limited' | 'Full';
  lastUpdated: Date;
  description?: string;
  floor?: string;
}

export interface Vehicle {
  plateNumber: string;
  ownerCategory: 'Student' | 'Faculty' | 'Guest';
  registrationStatus: 'Registered' | 'Unregistered';
  assignedZone: 'Student' | 'Faculty' | 'Guest';
  basement: 'B1' | 'B2';
  vehicleType?: string;
  entryTime?: Date;
  exitTime?: Date;
}

export interface DashboardStats {
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  occupancyRate: number;
  peakHour: string;
  predictedDemand: number;
  isSimulated: boolean;
  operatingDays: string[];
  totalVehiclesToday: number;
  averageUtilization: number;
  activeZones: number;
}

export interface HourlyData {
  hour: string;
  student: number;
  faculty: number;
  guest: number;
  total: number;
}

export interface DailyData {
  day: string;
  student: number;
  faculty: number;
  guest: number;
  total: number;
  date?: string;
}

export interface WeeklyComparison {
  week: string;
  thisWeek: number;
  lastWeek: number;
  predicted: number;
}

export interface CameraFeed {
  id: string;
  name: string;
  location: string;
  basement: 'B1' | 'B2' | 'Main';
  status: 'Online' | 'Offline' | 'Pending';
  detectionStatus: 'Active' | 'Inactive' | 'Pending Deployment';
  lastPing?: Date;
  position?: string;
}

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  zoneId: string;
  status: 'Available' | 'Occupied' | 'Reserved' | 'Maintenance';
  vehiclePlate?: string;
  occupiedSince?: Date;
}

export interface Notification {
  id: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  category: 'parking' | 'security' | 'maintenance' | 'announcement' | 'proctor';
  zone?: string;
}

export interface NavLink {
  label: string;
  path: string;
  icon?: string;
  isDropdown?: boolean;
  children?: NavLink[];
  badge?: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'active' | 'coming-soon' | 'planned';
}

export interface TimelinePhase {
  phase: number;
  title: string;
  description: string;
  features: string[];
  status: 'completed' | 'in-progress' | 'planned';
  targetDate?: string;
}

export interface RoadmapItem {
  id: string;
  phase: number;
  title: string;
  items: string[];
  badge?: string;
  color?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ParkingRule {
  id: string;
  category: 'Student' | 'Faculty' | 'Guest' | 'General' | 'Safety' | 'Emergency';
  rules: string[];
  icon?: string;
}

export interface ZoneStat {
  label: string;
  value: string | number;
  change?: number;
  isSimulated?: boolean;
}
