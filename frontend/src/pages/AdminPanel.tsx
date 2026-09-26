import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Users, Camera, Bell, Cpu, Lock,
  ParkingCircle, Activity, AlertTriangle, CheckCircle,
  Car, MapPin, RefreshCw, Edit3, X, Plus,
  Server, Clock, Trash2, Maximize2,
  Info, FileText, Download, Search,
  ToggleLeft, ToggleRight, LogOut, Zap, Volume2, VolumeX,
  AlertOctagon, Check, Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { parkingService } from '../services/parkingService';
import { analyticsService } from '../services/analyticsService';
import type { ParkingZone, Notification, DashboardStats, CameraFeed } from '../types';
import { mockNotifications, cameraFeeds } from '../data/mockData';

// ─── AUDIO FEEDBACK UTILITY (Synthesized Web Audio) ──────────────────────────
class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playBeep(freq = 880, duration = 0.04, type: OscillatorType = 'sine') {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio not permitted or supported — safely ignore
    }
  }

  playSuccess() {
    this.playBeep(523.25, 0.06);
    setTimeout(() => this.playBeep(659.25, 0.08), 50);
  }

  playAlert() {
    this.playBeep(440, 0.08, 'sawtooth');
    setTimeout(() => this.playBeep(330, 0.1, 'sawtooth'), 80);
  }
}

const sfx = new SoundFX();

// ─── TYPES & DATA MODELS ─────────────────────────────────────────────────────
type Tab = 'dashboard' | 'zones' | 'vehicles' | 'cameras' | 'notifications' | 'users' | 'system' | 'logs';

interface VehicleRecord {
  id: string;
  plate: string;
  owner: string;
  category: 'Student' | 'Faculty' | 'Staff' | 'Guest' | 'Official';
  department: string;
  status: 'Authorized' | 'Temporary' | 'Blacklisted' | 'VIP';
  lastSeenZone?: string;
  lastSeenTime?: string;
  type: 'Sedan' | 'SUV' | 'Motorcycle' | 'Minivan' | 'Bus';
}

interface AuditLog {
  id: number;
  time: string;
  action: string;
  user: string;
  detail: string;
  level: 'info' | 'success' | 'warning' | 'error';
}

const INITIAL_VEHICLES: VehicleRecord[] = [
  { id: 'v-1', plate: 'DHAKA-METRO-GA-11-2233', owner: 'Prof. Dr. M. A. Karim', category: 'Faculty', department: 'CSE Department', status: 'Authorized', lastSeenZone: 'B2 Faculty Zone', lastSeenTime: '09:15 AM', type: 'Sedan' },
  { id: 'v-2', plate: 'DHAKA-METRO-KHA-44-5566', owner: 'Tanvir Hossain (200204012)', category: 'Student', department: 'EEE Department', status: 'Authorized', lastSeenZone: 'B1 Student Zone', lastSeenTime: '08:44 AM', type: 'Sedan' },
  { id: 'v-3', plate: 'CHATTA-METRO-GHA-77-8899', owner: 'Campus Security Patrol #01', category: 'Official', department: 'Campus Safety Division', status: 'VIP', lastSeenZone: 'Campus Entry Gate', lastSeenTime: '07:30 AM', type: 'SUV' },
  { id: 'v-4', plate: 'DHAKA-METRO-LA-99-0011', owner: 'Guest — Accreditation Board', category: 'Guest', department: 'Office of the Vice-Chancellor', status: 'Temporary', lastSeenZone: 'B2 Guest Zone', lastSeenTime: '10:02 AM', type: 'Sedan' },
  { id: 'v-5', plate: 'DHAKA-METRO-HA-33-4411', owner: 'AUST Transport Pool Bus #3', category: 'Official', department: 'Transport Administration', status: 'VIP', lastSeenZone: 'Transport Pool', lastSeenTime: '06:45 AM', type: 'Bus' },
  { id: 'v-6', plate: 'DHAKA-METRO-JA-88-9922', owner: 'Unauthorized Vehicle', category: 'Guest', department: 'External Visitor', status: 'Blacklisted', lastSeenZone: 'B1 Ramp Entrance', lastSeenTime: 'Yesterday', type: 'SUV' },
];

const INITIAL_USERS = [
  { id: 'u-1', name: 'System Administrator', role: 'Admin', email: 'admin@aust.edu', dept: 'ICT Center — AUST', status: 'Active', lastLogin: 'Just now', color: '#c084fc' },
  { id: 'u-2', name: 'Prof. Dr. Campus Proctor', role: 'Proctor', email: 'proctor@aust.edu', dept: 'Office of the Proctor', status: 'Active', lastLogin: '2026-09-25 08:32', color: '#f87171' },
  { id: 'u-3', name: 'Chief Security Officer', role: 'Security', email: 'security@aust.edu', dept: 'Campus Safety Division', status: 'Active', lastLogin: '2026-09-25 07:50', color: '#fb923c' },
  { id: 'u-4', name: 'LPR Gate Operator (B1)', role: 'Gate Operator', email: 'gate.operator@aust.edu', dept: 'Campus Safety Division', status: 'Active', lastLogin: '2026-09-25 06:30', color: '#38bdf8' },
  { id: 'u-5', name: 'Network Monitor', role: 'Operator', email: 'monitor@aust.edu', dept: 'ICT Center — AUST', status: 'Active', lastLogin: '2026-09-25 08:00', color: '#4ade80' },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 1, time: '09:22:14', action: 'Zone Update', user: 'admin@aust.edu', detail: 'B1 Student Zone: occupancy checked (118/140)', level: 'info' },
  { id: 2, time: '09:15:03', action: 'LPR Auto-Entry', user: 'LPR_GATE_01', detail: 'DHAKA-METRO-GA-11-2233 entered B2 Faculty Zone (Conf: 98.6%)', level: 'success' },
  { id: 3, time: '09:08:41', action: 'Admin Auth', user: 'admin@aust.edu', detail: 'Successful token authentication from 127.0.0.1 (ICT Center)', level: 'success' },
  { id: 4, time: '08:55:22', action: 'Broadcast', user: 'system', detail: 'Peak-Hour Traffic advisory dispatched across B1 & B2', level: 'warning' },
  { id: 5, time: '08:44:10', action: 'LPR Auto-Exit', user: 'LPR_GATE_02', detail: 'DHAKA-METRO-KHA-44-5566 cleared exit ramp B1', level: 'info' },
  { id: 6, time: '08:30:00', action: 'System Init', user: 'system', detail: 'AUST-IPMS Laravel backend initialized with 220 total slots', level: 'success' },
  { id: 7, time: '08:22:18', action: 'Surveillance Ping', user: 'watchdog', detail: 'All 8 CCTV camera feeds responding (avg 18ms latency)', level: 'success' },
  { id: 8, time: '07:45:00', action: 'Blocked Vehicle', user: 'gate_barrier', detail: 'Blacklisted plate DHAKA-METRO-JA-88-9922 denied entry at B1 gate', level: 'error' },
];

// Helper: CSV Download
function downloadCSV(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper: JSON Download
function downloadJSON(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function AdminPanel() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Tabs & core entities
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [zones, setZones] = useState<ParkingZone[]>([]);
  const [_stats, setStats] = useState<DashboardStats | null>(null);
  const [vehicles, setVehicles] = useState<VehicleRecord[]>(INITIAL_VEHICLES);
  const [cameras, setCameras] = useState(cameraFeeds);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Modals & controls
  const [editingZone, setEditingZone] = useState<ParkingZone | null>(null);
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [isRegisteringVehicle, setIsRegisteringVehicle] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [focusedCamera, setFocusedCamera] = useState<typeof cameraFeeds[0] | null>(null);

  // System & Simulator state
  const [yoloOverlay, setYoloOverlay] = useState(true);
  const [mlEnabled, setMlEnabled] = useState(true);
  const [lprEnabled, setLprEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeModel, setActiveModel] = useState('yolov8x_aust_parking.pt');
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);

  // LPR Scanner Simulator form
  const [simPlate, setSimPlate] = useState('DHAKA-METRO-GA-11-2233');
  const [simGate, setSimGate] = useState<'Entry' | 'Exit'>('Entry');
  const [simZoneId, setSimZoneId] = useState('student-b1');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ plate: string; conf: number; status: string; zone: string; time: string } | null>(null);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'error'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Clock ticker (Dhaka UTC+6)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync sound setting
  useEffect(() => {
    sfx.enabled = soundEnabled;
  }, [soundEnabled]);

  // Auth gate
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/aust-ipms-admin', { state: { from: '/admin' } });
      return;
    }
    loadData();
  }, [isLoggedIn, navigate]);

  // Auto-refresh data
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadData = async () => {
    try {
      const [zonesData, statsData] = await Promise.all([
        parkingService.getParkingZones(),
        analyticsService.getDashboardStats(),
      ]);
      setZones(zonesData);
      setStats(statsData);
    } catch {
      // Fallback
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (type === 'success') sfx.playSuccess();
    else if (type === 'error') sfx.playAlert();
    else sfx.playBeep(600, 0.05);

    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const addAuditLog = (action: string, detail: string, level: AuditLog['level'] = 'info') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newLog: AuditLog = {
      id: Date.now(),
      time: timeStr,
      action,
      user: user?.email || 'admin@aust.edu',
      detail,
      level,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    sfx.playBeep(700, 0.05);
    try {
      const refreshed = await parkingService.refreshStatus();
      setZones(refreshed);
      showToast('Telemetry refreshed from AUST campus nodes.', 'success');
      addAuditLog('Manual Refresh', 'Telemetry and slot availability refreshed from sensor network', 'info');
    } finally {
      setIsRefreshing(false);
    }
  };

  // ─── ZONE ACTIONS ──────────────────────────────────────────────────────────
  const handleZoneSave = (id: string, data: { name: string; totalSlots: number; occupiedSlots: number; status: string; floor: string }) => {
    setZones(prev => prev.map(z => {
      if (z.id !== id) return z;
      const occupied = Math.min(data.occupiedSlots, data.totalSlots);
      const available = data.totalSlots - occupied;
      const pct = Math.round((occupied / data.totalSlots) * 100);
      return {
        ...z,
        name: data.name,
        totalSlots: data.totalSlots,
        occupiedSlots: occupied,
        availableSlots: available,
        occupancyPercentage: pct,
        status: data.status as ParkingZone['status'],
        floor: data.floor,
        lastUpdated: new Date(),
      };
    }));
    setEditingZone(null);
    showToast(`Zone [${data.name}] configuration saved.`, 'success');
    addAuditLog('Zone Modified', `Updated ${data.name}: ${data.occupiedSlots}/${data.totalSlots} slots, status: ${data.status}`, 'success');
  };

  const handleAddZone = (newZone: { name: string; floor: string; category: string; totalSlots: number; occupiedSlots: number }) => {
    const id = `zone-${Date.now().toString().slice(-4)}`;
    const total = Number(newZone.totalSlots);
    const occupied = Number(newZone.occupiedSlots);
    const available = total - occupied;
    const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
    const status: ParkingZone['status'] = pct >= 90 ? 'Full' : pct >= 70 ? 'Limited' : 'Available';

    const created: ParkingZone = {
      id,
      name: newZone.name,
      basement: newZone.floor.includes('1') ? 'B1' : 'B2',
      category: newZone.category as ParkingZone['category'],
      totalSlots: total,
      occupiedSlots: occupied,
      availableSlots: available,
      occupancyPercentage: pct,
      status,
      lastUpdated: new Date(),
      description: `AUST Campus parking zone located on ${newZone.floor}.`,
      floor: newZone.floor,
    };

    setZones(prev => [...prev, created]);
    setIsAddingZone(false);
    showToast(`New Zone [${newZone.name}] provisioned.`, 'success');
    addAuditLog('Zone Created', `Created zone ${newZone.name} on ${newZone.floor} with ${total} slots`, 'success');
  };

  const handleDeleteZone = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to decommission zone "${name}"? This action is logged.`)) return;
    setZones(prev => prev.filter(z => z.id !== id));
    showToast(`Zone [${name}] has been decommissioned.`, 'info');
    addAuditLog('Zone Deleted', `Decommissioned zone ${name} (ID: ${id})`, 'warning');
  };

  const handleQuickAdjustSlots = (zoneId: string, delta: number) => {
    setZones(prev => prev.map(z => {
      if (z.id !== zoneId) return z;
      const newOccupied = Math.max(0, Math.min(z.totalSlots, z.occupiedSlots + delta));
      const available = z.totalSlots - newOccupied;
      const pct = Math.round((newOccupied / z.totalSlots) * 100);
      const status: ParkingZone['status'] = pct >= 90 ? 'Full' : pct >= 70 ? 'Limited' : 'Available';
      return {
        ...z,
        occupiedSlots: newOccupied,
        availableSlots: available,
        occupancyPercentage: pct,
        status,
        lastUpdated: new Date(),
      };
    }));
    sfx.playBeep(delta > 0 ? 550 : 450, 0.04);
  };

  // ─── LPR SIMULATOR ACTIONS ─────────────────────────────────────────────────
  const handleRunLprScan = () => {
    if (!simPlate.trim()) {
      showToast('Enter a valid license plate string.', 'error');
      return;
    }

    setIsScanning(true);
    sfx.playBeep(720, 0.08, 'square');

    setTimeout(() => {
      setIsScanning(false);
      const matchedVeh = vehicles.find(v => v.plate.toLowerCase() === simPlate.trim().toLowerCase());
      const isBlacklisted = matchedVeh?.status === 'Blacklisted';
      const conf = Math.floor(Math.random() * 5) + 95; // 95 - 99%

      if (isBlacklisted) {
        setScanResult({
          plate: simPlate.toUpperCase(),
          conf,
          status: 'ALERT: BLACKLISTED / ACCESS DENIED',
          zone: 'Barrier Locked',
          time: new Date().toLocaleTimeString(),
        });
        showToast(`CRITICAL: Blacklisted vehicle ${simPlate} attempted entry!`, 'error');
        addAuditLog('Security Alert', `Blacklisted vehicle ${simPlate} blocked at ${simGate} barrier`, 'error');
        return;
      }

      // Delta slot
      const delta = simGate === 'Entry' ? 1 : -1;
      const targetZone = zones.find(z => z.id === simZoneId) || zones[0];

      if (targetZone) {
        handleQuickAdjustSlots(targetZone.id, delta);
      }

      const statusText = simGate === 'Entry' ? 'AUTHORIZED ENTRY' : 'AUTHORIZED EXIT';
      setScanResult({
        plate: simPlate.toUpperCase(),
        conf,
        status: statusText,
        zone: targetZone ? targetZone.name : 'Basement Zone',
        time: new Date().toLocaleTimeString(),
      });

      showToast(`LPR ${simGate}: ${simPlate} confirmed (${conf}% conf)`, 'success');
      addAuditLog(`LPR ${simGate}`, `${simPlate} recognized at ${simGate} gate → ${targetZone?.name}`, 'success');

      // Update vehicle last seen if exists
      setVehicles(prev => prev.map(v => {
        if (v.plate.toLowerCase() === simPlate.trim().toLowerCase()) {
          return { ...v, lastSeenZone: targetZone?.name, lastSeenTime: new Date().toLocaleTimeString() };
        }
        return v;
      }));
    }, 1100);
  };

  // ─── VEHICLE ACTIONS ───────────────────────────────────────────────────────
  const handleRegisterVehicle = (newVeh: Omit<VehicleRecord, 'id'>) => {
    const id = `v-${Date.now().toString().slice(-4)}`;
    const created: VehicleRecord = { id, ...newVeh };
    setVehicles(prev => [created, ...prev]);
    setIsRegisteringVehicle(false);
    showToast(`Vehicle [${newVeh.plate}] registered to ${newVeh.owner}.`, 'success');
    addAuditLog('Vehicle Registered', `Added ${newVeh.plate} (${newVeh.category}) for ${newVeh.owner}`, 'info');
  };

  const handleToggleVehicleStatus = (id: string) => {
    setVehicles(prev => prev.map(v => {
      if (v.id !== id) return v;
      const nextStatus: VehicleRecord['status'] = v.status === 'Authorized' ? 'Blacklisted' : 'Authorized';
      addAuditLog('Vehicle Status Changed', `${v.plate} status changed to ${nextStatus}`, nextStatus === 'Blacklisted' ? 'error' : 'info');
      return { ...v, status: nextStatus };
    }));
    showToast('Vehicle clearance status updated.', 'info');
  };

  const handleExportVehiclesCSV = () => {
    const headers = 'ID,Plate Number,Owner,Category,Department,Status,Vehicle Type,Last Seen Zone,Last Seen Time\n';
    const rows = vehicles.map(v => `"${v.id}","${v.plate}","${v.owner}","${v.category}","${v.department}","${v.status}","${v.type}","${v.lastSeenZone || 'N/A'}","${v.lastSeenTime || 'N/A'}"`).join('\n');
    downloadCSV(`AUST-IPMS-Vehicle-Registry-${new Date().toISOString().slice(0, 10)}.csv`, headers + rows);
    showToast('Vehicle registry CSV exported.', 'success');
    addAuditLog('Export Data', 'Vehicle registry exported as CSV', 'info');
  };

  // ─── CAMERA ACTIONS ────────────────────────────────────────────────────────
  const handleToggleCameraStatus = (id: string) => {
    setCameras(prev => prev.map(c => {
      if (c.id !== id) return c;
      const newStatus = c.status === 'Online' ? 'Offline' : 'Online';
      const newDet: CameraFeed['detectionStatus'] = newStatus === 'Online' ? 'Active' : 'Inactive';
      addAuditLog('Camera Toggle', `Camera ${c.name} switched to ${newStatus}`, newStatus === 'Online' ? 'info' : 'warning');
      return { ...c, status: newStatus, detectionStatus: newDet };
    }));
    showToast('Surveillance node status toggled.', 'info');
  };

  const handlePingCamera = (name: string) => {
    const latency = Math.floor(Math.random() * 12) + 8; // 8-20ms
    showToast(`Pinged ${name}: Response OK in ${latency}ms (Zero frame drops)`, 'success');
  };

  // ─── NOTIFICATION ACTIONS ──────────────────────────────────────────────────
  const handleBroadcast = (data: { title: string; message: string; category: Notification['category']; urgency: 'normal' | 'priority' | 'urgent' }) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      type: data.urgency === 'urgent' ? 'alert' : data.urgency === 'priority' ? 'warning' : 'info',
      title: data.title,
      message: data.message,
      timestamp: new Date(),
      isRead: false,
      category: data.category,
      urgency: data.urgency,
    };
    setNotifications(prev => [newNotif, ...prev]);
    setIsBroadcasting(false);
    showToast(`Campus alert broadcasted: "${data.title}"`, 'success');
    addAuditLog('Broadcast Sent', `Alert sent to campus users: ${data.title} (${data.category.toUpperCase()})`, 'warning');
  };

  const handleDismissNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification removed.', 'info');
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read.', 'info');
  };

  // ─── USER MANAGEMENT ACTIONS ───────────────────────────────────────────────
  const handleAddUser = (newUser: { name: string; email: string; dept: string; role: string }) => {
    const created = {
      id: `u-${Date.now().toString().slice(-3)}`,
      name: newUser.name,
      role: newUser.role,
      email: newUser.email,
      dept: newUser.dept,
      status: 'Active',
      lastLogin: 'Never',
      color: newUser.role === 'Admin' ? '#c084fc' : newUser.role === 'Proctor' ? '#f87171' : '#fb923c',
    };
    setUsers(prev => [...prev, created]);
    setIsAddingUser(false);
    showToast(`Operator account for ${newUser.name} provisioned.`, 'success');
    addAuditLog('User Created', `Added ${newUser.role} user: ${newUser.email}`, 'info');
  };

  const handleToggleUserStatus = (id: string, name: string) => {
    if (id === 'u-1') {
      showToast('Cannot suspend root System Administrator account.', 'error');
      return;
    }
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
      addAuditLog('User Status Changed', `User ${u.email} status changed to ${nextStatus}`, 'warning');
      return { ...u, status: nextStatus };
    }));
    showToast(`Account status for ${name} updated.`, 'info');
  };

  // ─── SYSTEM & BACKUP ACTIONS ───────────────────────────────────────────────
  const handleExportSystemBackup = () => {
    const backupData = {
      system: 'AUST-IPMS',
      version: '2.4.0-Production',
      exportedAt: new Date().toISOString(),
      institution: 'Ahsanullah University of Science and Technology',
      zones,
      cameras,
      vehicles,
      users,
      auditLogs,
      settings: {
        mlEnabled,
        lprEnabled,
        activeModel,
        confidenceThreshold,
        maintenanceMode,
      },
    };
    downloadJSON(`AUST-IPMS-FullBackup-${new Date().toISOString().slice(0, 10)}.json`, backupData);
    showToast('Full system configuration backup downloaded.', 'success');
    addAuditLog('System Backup', 'Exported complete database and system configuration JSON', 'success');
  };

  const handleClearCache = () => {
    sfx.playBeep(600, 0.05);
    setTimeout(() => {
      showToast('Redis & Application Cache purged successfully.', 'success');
      addAuditLog('Cache Cleared', 'Admin purged Redis query and telemetry cache', 'info');
    }, 600);
  };

  const handleExportAuditLogsCSV = () => {
    const headers = 'ID,Time,Action,Operator,Details,Severity\n';
    const rows = auditLogs.map(l => `"${l.id}","${l.time}","${l.action}","${l.user}","${l.detail.replace(/"/g, '""')}","${l.level}"`).join('\n');
    downloadCSV(`AUST-IPMS-AuditLogs-${new Date().toISOString().slice(0, 10)}.csv`, headers + rows);
    showToast('Audit log records exported as CSV.', 'success');
  };

  const handleEmergencyLockdown = () => {
    if (!window.confirm('WARNING: Initiate Emergency Gate Lockdown? All barriers will drop and entry will be restricted.')) return;
    setMaintenanceMode(true);
    showToast('EMERGENCY LOCKDOWN INITIATED — Gates Closed', 'error');
    addAuditLog('Emergency Lockdown', 'Operator initiated manual gate barrier lockdown across all zones', 'error');
  };

  // Aggregates
  const totalSlots = zones.reduce((s, z) => s + z.totalSlots, 0);
  const totalOccupied = zones.reduce((s, z) => s + z.occupiedSlots, 0);
  const totalAvailable = totalSlots - totalOccupied;
  const overallRate = totalSlots > 0 ? Math.round((totalOccupied / totalSlots) * 100) : 0;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const TABS: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Command HUD', icon: <Activity size={15} /> },
    { id: 'zones', label: 'Zones', icon: <ParkingCircle size={15} />, badge: zones.length },
    { id: 'vehicles', label: 'LPR & Vehicles', icon: <Car size={15} />, badge: vehicles.length },
    { id: 'cameras', label: 'Surveillance', icon: <Camera size={15} />, badge: cameras.length },
    { id: 'notifications', label: 'Broadcasts', icon: <Bell size={15} />, badge: unreadCount },
    { id: 'users', label: 'Access Control', icon: <Users size={15} /> },
    { id: 'system', label: 'AI & Diagnostics', icon: <Cpu size={15} /> },
    { id: 'logs', label: 'Audit Trail', icon: <FileText size={15} /> },
  ];

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center p-8 rounded-3xl max-w-sm w-full"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)' }}>
            <Lock size={26} style={{ color: '#f87171' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>Access Restricted</h2>
          <p className="text-xs mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Authorized administrator credentials required to access the central IPMS control center.
          </p>
          <button
            onClick={() => navigate('/aust-ipms-admin', { state: { from: '/admin' } })}
            className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #be185d)', color: 'white' }}
          >
            Authenticate via Secure Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-20 relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>

      {/* Cyberpunk ambient grid & glow background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.15), transparent 70%)' }} />
        <div className="absolute top-1/2 right-10 w-96 h-96 rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.12), transparent 70%)' }} />
      </div>

      {/* Maintenance Mode Global Banner */}
      {maintenanceMode && (
        <div className="bg-red-500/20 border-b border-red-500/40 text-red-300 px-4 py-2.5 text-xs font-semibold flex items-center justify-between z-30 relative">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertOctagon size={16} className="animate-pulse flex-shrink-0" />
            <span>SYSTEM LOCKDOWN / MAINTENANCE MODE ACTIVE — Entry gates restricted. Barrier automatic pass is paused.</span>
            <button
              onClick={() => { setMaintenanceMode(false); showToast('Maintenance mode lifted. Gates restored.', 'success'); }}
              className="ml-auto px-3 py-1 bg-red-500/30 hover:bg-red-500/50 rounded-lg text-white font-bold transition-all"
            >
              Lift Lockdown
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 z-50 px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-2xl backdrop-blur-xl"
            style={{
              background: toast.type === 'success' ? 'rgba(16,185,129,0.2)' : toast.type === 'error' ? 'rgba(239,68,68,0.25)' : 'rgba(6,182,212,0.2)',
              border: `1px solid ${toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#06b6d4'}`,
              color: toast.type === 'success' ? '#6ee7b7' : toast.type === 'error' ? '#fca5a5' : '#67e8f9',
            }}
          >
            {toast.type === 'success' ? <CheckCircle size={15} /> : toast.type === 'error' ? <AlertTriangle size={15} /> : <Info size={15} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">

        {/* ── TOP TELEMETRY HUD BAR ─────────────────────────────────────── */}
        <div className="rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(192,132,252,0.2), rgba(236,72,153,0.15))', border: '1px solid rgba(192,132,252,0.3)' }}>
              <Shield size={20} style={{ color: '#c084fc' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                  AUST-IPMS Central Command
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>
                  Node DHAKA-01 · v2.4
                </span>
              </div>
              <p className="text-xs flex items-center gap-2 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Operator: <span style={{ color: 'var(--text-secondary)' }}>{user?.name}</span> ({user?.role.toUpperCase()})
                &nbsp;·&nbsp;{user?.department}
              </p>
            </div>
          </div>

          {/* Right Live Controls */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Logout */}
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-soft)' }}
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>

        {/* ── TAB NAVIGATION BAR ─────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); sfx.playBeep(650, 0.03); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all relative flex-shrink-0 cursor-pointer"
              style={activeTab === tab.id
                ? {
                    background: 'linear-gradient(135deg, rgba(192,132,252,0.18), rgba(34,211,238,0.12))',
                    color: 'var(--text-primary)',
                    border: '1px solid rgba(192,132,252,0.4)',
                    boxShadow: '0 4px 15px rgba(192,132,252,0.12)',
                  }
                : {
                    background: 'var(--bg-surface)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-soft)',
                  }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold"
                  style={{
                    background: tab.id === 'notifications' && unreadCount > 0 ? '#ef4444' : 'var(--bg-elevated)',
                    color: tab.id === 'notifications' && unreadCount > 0 ? 'white' : 'var(--accent)',
                    border: '1px solid var(--border-soft)',
                  }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* ══════════════════════════════════════════════════════════════
              TAB 1: COMMAND HUD (DASHBOARD)
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">

              {/* KPI Matrix Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Campus Capacity', value: totalSlots, sub: 'B1 + B2 Total Allocated', color: '#22d3ee', icon: <ParkingCircle size={18} />, trend: '+0% expansion' },
                  { label: 'Occupied Vehicles', value: totalOccupied, sub: `${overallRate}% campus utilization`, color: '#f87171', icon: <Car size={18} />, trend: 'Active intake' },
                  { label: 'Available Slots', value: totalAvailable, sub: 'Immediate availability', color: '#4ade80', icon: <CheckCircle size={18} />, trend: 'B1: 22 · B2: 26' },
                  { label: 'Active Zones', value: zones.length, sub: 'All zones operational', color: '#c084fc', icon: <MapPin size={18} />, trend: 'Healthy sensor mesh' },
                ].map((kpi) => (
                  <div key={kpi.label} className="card p-5 relative overflow-hidden group hover:scale-[1.01] transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${kpi.color}15`, color: kpi.color, border: `1px solid ${kpi.color}30` }}>
                        {kpi.icon}
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                        {kpi.trend}
                      </span>
                    </div>
                    <p className="text-3xl font-extrabold mb-0.5" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                      {kpi.value}
                    </p>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{kpi.label}</p>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: kpi.color }}>{kpi.sub}</p>
                  </div>
                ))}
              </div>

              {/* Live Interactive Zone HUD */}
              <div className="rounded-3xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-base font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                      Live Zone Utilization & Quick Controls
                    </h2>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Adjust vehicle occupancy on the fly or dispatch emergency capacity overrides
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddingZone(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                      style={{ background: 'var(--accent)', color: 'white' }}
                    >
                      <Plus size={13} /> Add Zone
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {zones.map(zone => (
                    <div key={zone.id} className="p-4 rounded-2xl relative"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{zone.name}</p>
                          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{zone.floor} · {zone.category}</p>
                        </div>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          zone.status === 'Available' ? 'text-green-400 bg-green-400/10 border border-green-400/30' :
                          zone.status === 'Limited' ? 'text-orange-400 bg-orange-400/10 border border-orange-400/30' :
                          'text-red-400 bg-red-400/10 border border-red-400/30'
                        }`}>
                          {zone.status}
                        </span>
                      </div>

                      {/* Bar meter */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                          <span>{zone.occupiedSlots} / {zone.totalSlots} slots</span>
                          <span className="font-bold" style={{ color: zone.occupancyPercentage > 85 ? '#f87171' : '#4ade80' }}>
                            {zone.occupancyPercentage}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${zone.occupancyPercentage}%`,
                              background: zone.occupancyPercentage > 85 ? 'linear-gradient(90deg, #f87171, #ef4444)' :
                                zone.occupancyPercentage > 70 ? 'linear-gradient(90deg, #fb923c, #f97316)' :
                                'linear-gradient(90deg, #22d3ee, #4ade80)',
                            }} />
                        </div>
                      </div>

                      {/* Quick Adjust Buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleQuickAdjustSlots(zone.id, -1)}
                            title="Decrement 1 vehicle"
                            className="px-2 py-1 rounded-lg text-xs font-mono font-bold hover:bg-white/10 transition-all"
                            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-soft)' }}
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleQuickAdjustSlots(zone.id, 1)}
                            title="Increment 1 vehicle"
                            className="px-2 py-1 rounded-lg text-xs font-mono font-bold hover:bg-white/10 transition-all"
                            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-soft)' }}
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleQuickAdjustSlots(zone.id, 5)}
                            title="Increment 5 vehicles (batch inrush)"
                            className="px-2 py-1 rounded-lg text-xs font-mono font-bold hover:bg-white/10 transition-all"
                            style={{ color: 'var(--accent)', border: '1px solid var(--border-soft)' }}
                          >
                            +5
                          </button>
                        </div>

                        <button
                          onClick={() => setEditingZone(zone)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all"
                          style={{ color: 'var(--accent)', background: 'var(--accent-soft)', border: '1px solid var(--border-soft)' }}
                        >
                          <Edit3 size={11} /> Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LPR Quick Test Panel & AI Controls */}
              <div className="grid lg:grid-cols-3 gap-6">

                {/* Live LPR Scanner Simulator on Dashboard */}
                <div className="lg:col-span-2 rounded-3xl p-6"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Zap size={18} style={{ color: '#fbbf24' }} />
                      <h3 className="font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                        Automated LPR Gate Simulator
                      </h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold"
                      style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
                      Real-time OCR Engine
                    </span>
                  </div>

                  <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Simulate entry and exit scans with automated plate recognition, barrier activation, and zone slot tallying.
                  </p>

                  <div className="grid sm:grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        License Plate
                      </label>
                      <input
                        type="text"
                        value={simPlate}
                        onChange={e => setSimPlate(e.target.value.toUpperCase())}
                        placeholder="DHAKA-METRO-GA-11-2233"
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase outline-none"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        Gate Action
                      </label>
                      <select
                        value={simGate}
                        onChange={e => setSimGate(e.target.value as 'Entry' | 'Exit')}
                        className="w-full px-3 py-2 rounded-xl text-xs font-semibold outline-none"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', color: 'var(--text-primary)' }}
                      >
                        <option value="Entry">B1 Ramp Main Entry</option>
                        <option value="Exit">B1 Ramp North Exit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        Target Zone
                      </label>
                      <select
                        value={simZoneId}
                        onChange={e => setSimZoneId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-semibold outline-none"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', color: 'var(--text-primary)' }}
                      >
                        {zones.map(z => (
                          <option key={z.id} value={z.id}>{z.name} ({z.availableSlots} free)</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>Preset Plates:</span>
                    {['DHAKA-METRO-GA-11-2233', 'DHAKA-METRO-KHA-44-5566', 'CHATTA-METRO-GHA-77-8899', 'DHAKA-METRO-JA-88-9922'].map(p => (
                      <button
                        key={p}
                        onClick={() => setSimPlate(p)}
                        className="text-[10px] font-mono px-2 py-1 rounded-lg hover:border-cyan-400 transition-all cursor-pointer"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', color: 'var(--text-secondary)' }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleRunLprScan}
                      disabled={isScanning}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                      style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', color: 'white' }}
                    >
                      {isScanning ? <RefreshCw size={13} className="animate-spin" /> : <Zap size={13} />}
                      {isScanning ? 'Running OCR Ingestion…' : `Scan & Process ${simGate}`}
                    </button>

                    {scanResult && (
                      <div className="flex-1 px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between"
                        style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)', color: '#4ade80' }}>
                        <span>MATCH: {scanResult.plate} · {scanResult.status} ({scanResult.conf}%)</span>
                        <span className="text-[10px] text-gray-400">{scanResult.time}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* System Toggles & Heartbeat */}
                <div className="rounded-3xl p-6 space-y-4"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                  <h3 className="font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                    Inference & Automation Core
                  </h3>

                  <div className="p-3 rounded-2xl flex items-center justify-between"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)' }}>
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>YOLO Detection Stream</p>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Overlay model boxes on cameras</p>
                    </div>
                    <button onClick={() => { setYoloOverlay(y => !y); showToast(yoloOverlay ? 'Bounding boxes hidden' : 'Bounding boxes enabled', 'info'); }}>
                      {yoloOverlay ? <ToggleRight size={26} style={{ color: '#4ade80' }} /> : <ToggleLeft size={26} style={{ color: 'var(--text-muted)' }} />}
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl flex items-center justify-between"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)' }}>
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>ML Predictive Auto-Tuning</p>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Calibrated for academic timetable</p>
                    </div>
                    <button onClick={() => { setMlEnabled(m => !m); showToast(mlEnabled ? 'ML auto-tuning paused' : 'ML auto-tuning active', 'info'); }}>
                      {mlEnabled ? <ToggleRight size={26} style={{ color: '#c084fc' }} /> : <ToggleLeft size={26} style={{ color: 'var(--text-muted)' }} />}
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl flex items-center justify-between"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)' }}>
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>LPR Gate Barrier Sync</p>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Auto open on authorized match</p>
                    </div>
                    <button onClick={() => { setLprEnabled(l => !l); showToast(lprEnabled ? 'LPR barrier sync paused' : 'LPR barrier sync active', 'info'); }}>
                      {lprEnabled ? <ToggleRight size={26} style={{ color: '#22d3ee' }} /> : <ToggleLeft size={26} style={{ color: 'var(--text-muted)' }} />}
                    </button>
                  </div>

                  {/* Active Weights Card */}
                  <div className="p-3 rounded-2xl text-xs space-y-1.5"
                    style={{ background: 'rgba(192,132,252,0.06)', border: '1px solid rgba(192,132,252,0.2)' }}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-purple-300">Model Deployment</span>
                      <span className="text-[10px] font-mono text-purple-400">READY</span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Target model weights: <code className="text-purple-300 font-mono">backend/models/yolo_parking.pt</code>
                    </p>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 2: ZONES MANAGEMENT (FULL CRUD)
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'zones' && (
            <motion.div key="zones" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                    Campus Parking Zones
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Create, edit, decommission, and reconfigure physical parking zones across B1 and B2
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsAddingZone(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                    style={{ background: 'var(--accent)', color: 'white' }}
                  >
                    <Plus size={14} /> Provision New Zone
                  </button>
                </div>
              </div>

              {/* Zones Table Card */}
              <div className="rounded-3xl overflow-hidden"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/5" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                        <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Zone Identifier</th>
                        <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Location</th>
                        <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Category</th>
                        <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Capacity</th>
                        <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Occupancy</th>
                        <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Status</th>
                        <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {zones.map(z => (
                        <tr key={z.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-bold" style={{ color: 'var(--text-primary)' }}>
                            <div className="flex items-center gap-2">
                              <ParkingCircle size={15} style={{ color: 'var(--accent)' }} />
                              {z.name}
                            </div>
                          </td>
                          <td className="py-3.5 px-4" style={{ color: 'var(--text-secondary)' }}>
                            {z.floor} ({z.basement})
                          </td>
                          <td className="py-3.5 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                            {z.category}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                            {z.totalSlots} slots
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{z.occupiedSlots} ({z.occupancyPercentage}%)</span>
                              <div className="w-16 h-1.5 rounded-full overflow-hidden bg-black/40">
                                <div className="h-full rounded-full"
                                  style={{
                                    width: `${z.occupancyPercentage}%`,
                                    background: z.occupancyPercentage > 85 ? '#f87171' : '#4ade80'
                                  }} />
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              z.status === 'Available' ? 'text-green-400 bg-green-400/10 border border-green-400/30' :
                              z.status === 'Limited' ? 'text-orange-400 bg-orange-400/10 border border-orange-400/30' :
                              'text-red-400 bg-red-400/10 border border-red-400/30'
                            }`}>
                              {z.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingZone(z)}
                                className="p-1.5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                                style={{ color: 'var(--accent)' }}
                                title="Edit zone"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteZone(z.id, z.name)}
                                className="p-1.5 rounded-lg hover:bg-red-500/20 transition-all cursor-pointer"
                                style={{ color: '#f87171' }}
                                title="Decommission zone"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 3: LPR & VEHICLE REGISTRY
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'vehicles' && (
            <motion.div key="vehicles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                    Vehicle Registry & Access Ledger
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Whitelist authorized campus vehicles, flag blacklisted license plates, and export audit records
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleExportVehiclesCSV}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)', color: 'var(--text-primary)' }}
                  >
                    <Download size={13} /> Export CSV
                  </button>
                  <button
                    onClick={() => setIsRegisteringVehicle(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                    style={{ background: 'var(--accent)', color: 'white' }}
                  >
                    <Plus size={14} /> Register Vehicle
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by license plate, driver name, department, or status…"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              {/* Vehicles Table */}
              <div className="rounded-3xl overflow-hidden"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/5" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                        <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">License Plate</th>
                        <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Vehicle Owner</th>
                        <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Affiliation</th>
                        <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Type</th>
                        <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Access Status</th>
                        <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Last Gate Sighting</th>
                        <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-right">Clearance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {vehicles.filter(v => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return v.plate.toLowerCase().includes(q) || v.owner.toLowerCase().includes(q) || v.department.toLowerCase().includes(q) || v.status.toLowerCase().includes(q);
                      }).map(v => (
                        <tr key={v.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                            <span className="px-2 py-1 rounded-md text-[11px]" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-soft)' }}>
                              {v.plate}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {v.owner}
                          </td>
                          <td className="py-3.5 px-4" style={{ color: 'var(--text-secondary)' }}>
                            <span className="font-medium">{v.category}</span> · {v.department}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                            {v.type}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              v.status === 'Authorized' ? 'text-green-400 bg-green-400/10 border border-green-400/30' :
                              v.status === 'VIP' ? 'text-purple-400 bg-purple-400/10 border border-purple-400/30' :
                              v.status === 'Temporary' ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-400/30' :
                              'text-red-400 bg-red-400/10 border border-red-400/30'
                            }`}>
                              {v.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4" style={{ color: 'var(--text-muted)' }}>
                            {v.lastSeenZone ? `${v.lastSeenZone} (${v.lastSeenTime})` : 'No recent sightings'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleToggleVehicleStatus(v.id)}
                              className="text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                              style={{
                                background: v.status === 'Blacklisted' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                                color: v.status === 'Blacklisted' ? '#4ade80' : '#f87171',
                                border: `1px solid ${v.status === 'Blacklisted' ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                              }}
                            >
                              {v.status === 'Blacklisted' ? 'Whitelist' : 'Blacklist'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 4: SURVEILLANCE & STREAM CONTROL
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'cameras' && (
            <motion.div key="cameras" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                    CCTV Surveillance Matrix & Computer Vision
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    8 distributed RTSP/HLS basement camera nodes with simulated real-time YOLO bounding box telemetry
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setYoloOverlay(y => !y); showToast(yoloOverlay ? 'Bounding boxes hidden' : 'Bounding boxes enabled', 'info'); }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                    style={{
                      background: yoloOverlay ? 'rgba(192,132,252,0.2)' : 'var(--bg-surface)',
                      border: '1px solid rgba(192,132,252,0.4)',
                      color: yoloOverlay ? '#c084fc' : 'var(--text-muted)'
                    }}
                  >
                    <Sliders size={13} /> {yoloOverlay ? 'AI Bounding Boxes: ON' : 'AI Bounding Boxes: OFF'}
                  </button>
                </div>
              </div>

              {/* 8-Camera Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cameras.map((cam, idx) => (
                  <div key={cam.id} className="rounded-2xl overflow-hidden relative group"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>

                    {/* Simulated Camera Video Frame */}
                    <div className="relative h-44 bg-black flex items-center justify-center overflow-hidden">
                      {/* Grid background / scanlines */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent pointer-events-none" />
                      <div className="absolute inset-0 opacity-15"
                        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

                      {/* Animated scanline */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-12 w-full animate-pulse" />

                      {/* Live Camera Overlays */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-white">
                        <span className={`w-1.5 h-1.5 rounded-full ${cam.status === 'Online' ? 'bg-red-500 animate-ping' : 'bg-gray-500'}`} />
                        <span className="font-bold">{cam.id.toUpperCase()}</span>
                      </div>

                      <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-cyan-400">
                        1080p · 30 FPS
                      </div>

                      {/* Simulated YOLO Detection Bounding Boxes */}
                      {yoloOverlay && (
                        <>
                          <div className="absolute top-8 left-6 w-24 h-16 border-2 border-emerald-400/80 rounded flex items-start p-1 pointer-events-none animate-pulse">
                            <span className="bg-emerald-500 text-black text-[8px] font-mono font-bold px-1 rounded">
                              Car 98%
                            </span>
                          </div>
                          <div className="absolute bottom-6 right-8 w-20 h-14 border border-cyan-400/80 rounded flex items-start p-1 pointer-events-none">
                            <span className="bg-cyan-500 text-black text-[8px] font-mono font-bold px-1 rounded">
                              Slot #0{idx + 1}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Center Cam Graphic */}
                      <div className="text-center">
                        <Camera size={26} className="mx-auto mb-1 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                        <p className="text-[10px] font-mono text-gray-500">{cam.name}</p>
                      </div>

                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => setFocusedCamera(cam)}
                          className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 transition-all cursor-pointer"
                          title="Enlarge feed"
                        >
                          <Maximize2 size={16} />
                        </button>
                        <button
                          onClick={() => handlePingCamera(cam.name)}
                          className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 transition-all cursor-pointer"
                          title="Test latency ping"
                        >
                          <Activity size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Camera Info Footer */}
                    <div className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>{cam.name}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{cam.location}</p>
                      </div>
                      <button
                        onClick={() => handleToggleCameraStatus(cam.id)}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold cursor-pointer transition-all ${
                          cam.status === 'Online'
                            ? 'text-green-400 bg-green-400/10 border border-green-400/30'
                            : 'text-gray-400 bg-gray-500/10 border border-gray-500/30'
                        }`}
                      >
                        {cam.status}
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 5: NOTIFICATIONS & BROADCASTS
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'notifications' && (
            <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                    Campus Broadcast & Alert Dispatch
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Dispatch real-time parking advisories, security announcements, and maintenance alerts to all connected portal users
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)', color: 'var(--text-secondary)' }}
                  >
                    <Check size={13} /> Mark All Read
                  </button>
                  <button
                    onClick={() => setIsBroadcasting(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                    style={{ background: 'var(--accent)', color: 'white' }}
                  >
                    <Plus size={14} /> New Broadcast
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="space-y-3">
                {notifications.map(notif => (
                  <div key={notif.id} className="p-4 rounded-2xl flex items-start justify-between gap-4 transition-all"
                    style={{
                      background: notif.isRead ? 'var(--bg-surface)' : 'linear-gradient(135deg, rgba(192,132,252,0.06), var(--bg-surface))',
                      border: notif.isRead ? '1px solid var(--border-soft)' : '1px solid rgba(192,132,252,0.3)',
                    }}>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: notif.urgency === 'urgent' ? 'rgba(239,68,68,0.15)' : 'rgba(34,211,238,0.12)',
                          color: notif.urgency === 'urgent' ? '#f87171' : '#22d3ee',
                        }}>
                        <Bell size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{notif.title}</h4>
                          <span className="text-[10px] px-2 py-0.2 rounded-full font-bold uppercase"
                            style={{ background: 'var(--bg-elevated)', color: 'var(--accent)' }}>
                            {notif.category}
                          </span>
                          {notif.urgency === 'urgent' && (
                            <span className="text-[10px] px-2 py-0.2 rounded-full font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{notif.message}</p>
                        <p className="text-[10px] mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>
                          {notif.timestamp instanceof Date ? notif.timestamp.toLocaleString() : String(notif.timestamp)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDismissNotif(notif.id)}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-all text-gray-400 hover:text-red-400 cursor-pointer"
                      title="Dismiss alert"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 6: USER & ACCESS CONTROL
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                    Administrative Access & Operator Governance
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Manage authorized ICT administrators, Proctorial officers, and Gate security terminals
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingUser(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  <Plus size={14} /> Provision Operator Account
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map(u => (
                  <div key={u.id} className="rounded-2xl p-5 relative overflow-hidden"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                          style={{ background: `${u.color}20`, color: u.color, border: `1px solid ${u.color}40` }}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{u.email}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        u.status === 'Active' ? 'text-green-400 bg-green-400/10 border border-green-400/30' : 'text-red-400 bg-red-400/10 border border-red-400/30'
                      }`}>
                        {u.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs mb-4">
                      <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                        <span>Role:</span>
                        <span className="font-bold" style={{ color: u.color }}>{u.role}</span>
                      </div>
                      <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                        <span>Division:</span>
                        <span className="font-medium text-gray-300">{u.dept}</span>
                      </div>
                      <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                        <span>Last Session:</span>
                        <span className="font-mono text-gray-400">{u.lastLogin}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <button
                        onClick={() => handleToggleUserStatus(u.id, u.name)}
                        disabled={u.id === 'u-1'}
                        className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          u.id === 'u-1' ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                        style={{
                          background: u.status === 'Active' ? 'rgba(239,68,68,0.1)' : 'rgba(74,222,128,0.1)',
                          color: u.status === 'Active' ? '#f87171' : '#4ade80',
                          border: `1px solid ${u.status === 'Active' ? 'rgba(239,68,68,0.3)' : 'rgba(74,222,128,0.3)'}`,
                        }}
                      >
                        {u.status === 'Active' ? 'Suspend Account' : 'Reactivate'}
                      </button>

                      <button
                        onClick={() => showToast(`Password reset link dispatched to ${u.email}`, 'info')}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        Reset Credentials
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 7: AI & DIAGNOSTICS & SYSTEM CONFIG
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'system' && (
            <motion.div key="system" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                    System Diagnostics & ML Architecture
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Configure deep learning models, hardware acceleration, and perform institutional database backups
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleClearCache}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)', color: 'var(--text-primary)' }}
                  >
                    <RefreshCw size={13} /> Purge Cache
                  </button>
                  <button
                    onClick={handleExportSystemBackup}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                    style={{ background: 'var(--accent)', color: 'white' }}
                  >
                    <Download size={13} /> Full System Backup (JSON)
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">

                {/* ML Engine Card */}
                <div className="rounded-3xl p-6 space-y-4"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                  <div className="flex items-center gap-2">
                    <Cpu size={18} style={{ color: '#c084fc' }} />
                    <h3 className="font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                      Computer Vision & YOLO Weights
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        Active Neural Network Model
                      </label>
                      <select
                        value={activeModel}
                        onChange={e => { setActiveModel(e.target.value); showToast(`Active model changed to ${e.target.value}`, 'success'); }}
                        className="w-full px-3 py-2.5 rounded-xl text-xs font-mono font-bold outline-none"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', color: 'var(--text-primary)' }}
                      >
                        <option value="yolov8x_aust_parking.pt">yolov8x_aust_parking.pt (High Accuracy · 98.4%)</option>
                        <option value="yolov8n_speed_v2.pt">yolov8n_speed_v2.pt (Edge Optimized · 91.2%)</option>
                        <option value="aust_license_plate_crnn.pt">aust_license_plate_crnn.pt (Plate OCR Specialized)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span style={{ color: 'var(--text-muted)' }}>Confidence Filter Threshold</span>
                        <span className="font-mono font-bold text-cyan-400">{confidenceThreshold}%</span>
                      </div>
                      <input
                        type="range" min={50} max={98} value={confidenceThreshold}
                        onChange={e => setConfidenceThreshold(Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>

                    <div className="p-3.5 rounded-xl space-y-2" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)' }}>
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: 'var(--text-muted)' }}>Hardware Acceleration Target</span>
                        <span className="font-mono text-green-400 font-bold">NVIDIA CUDA GPU (RTX 4090)</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: 'var(--text-muted)' }}>Inference Latency</span>
                        <span className="font-mono text-cyan-400 font-bold">12.4 ms / frame</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: 'var(--text-muted)' }}>Weights File Location</span>
                        <span className="font-mono text-purple-300">backend/models/yolo_parking.pt</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Server Telemetry & Health */}
                <div className="rounded-3xl p-6 space-y-4"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                  <div className="flex items-center gap-2">
                    <Server size={18} style={{ color: '#22d3ee' }} />
                    <h3 className="font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                      Server Architecture Telemetry
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'CPU Utilization', pct: 28, sub: '8 Cores @ 3.4 GHz' },
                      { label: 'System Memory (RAM)', pct: 44, sub: '7.1 GB / 16.0 GB' },
                      { label: 'High-Speed NVMe Storage', pct: 19, sub: '48.2 GB / 256.0 GB' },
                      { label: 'Camera Stream Bandwidth', pct: 36, sub: '24.8 Mbps across 8 nodes' },
                    ].map(item => (
                      <div key={item.label} className="p-3 rounded-xl" style={{ background: 'var(--bg-elevated)' }}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                          <span className="font-mono font-bold" style={{ color: 'var(--accent)' }}>{item.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden bg-black/40 mb-1">
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${item.pct}%`, background: 'var(--accent)' }} />
                        </div>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 8: AUDIT LOGS & SECURITY TRAIL
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'logs' && (
            <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                    Audit Trail & Incident Log
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Immutable digital security records conforming to university ICT policies
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleExportAuditLogsCSV}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)', color: 'var(--text-primary)' }}
                  >
                    <Download size={13} /> Export CSV
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Clear all audit logs from active screen?')) {
                        setAuditLogs([]);
                        showToast('Audit trail display cleared.', 'info');
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer text-red-400 hover:bg-red-500/10"
                    style={{ border: '1px solid rgba(239,68,68,0.3)' }}
                  >
                    <Trash2 size={13} /> Clear
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2">
                {(['all', 'info', 'success', 'warning', 'error'] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setLogFilter(lvl)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                    style={logFilter === lvl
                      ? { background: 'var(--accent)', color: 'white' }
                      : { background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-soft)' }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {/* Logs Table */}
              <div className="rounded-3xl overflow-hidden"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/5" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                        <th className="py-3 px-4 uppercase">Timestamp</th>
                        <th className="py-3 px-4 uppercase">Action</th>
                        <th className="py-3 px-4 uppercase">Operator</th>
                        <th className="py-3 px-4 uppercase">Event Particulars</th>
                        <th className="py-3 px-4 uppercase text-right">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {auditLogs.filter(l => logFilter === 'all' || l.level === logFilter).map(log => (
                        <tr key={log.id} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 px-4 text-gray-400">{log.time}</td>
                          <td className="py-2.5 px-4 font-bold" style={{ color: 'var(--text-primary)' }}>{log.action}</td>
                          <td className="py-2.5 px-4 text-purple-300">{log.user}</td>
                          <td className="py-2.5 px-4 font-sans text-xs text-gray-300">{log.detail}</td>
                          <td className="py-2.5 px-4 text-right">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              log.level === 'success' ? 'text-green-400 bg-green-400/10' :
                              log.level === 'warning' ? 'text-yellow-400 bg-yellow-400/10' :
                              log.level === 'error' ? 'text-red-400 bg-red-400/10' :
                              'text-cyan-400 bg-cyan-400/10'
                            }`}>
                              {log.level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* ── MODALS ─────────────────────────────────────────────────── */}

      {/* 1. Zone Edit Modal */}
      <AnimatePresence>
        {editingZone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditingZone(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl p-6 z-10 space-y-4"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                  Reconfigure Zone: {editingZone.name}
                </h3>
                <button onClick={() => setEditingZone(null)} className="text-gray-400 hover:text-white"><X size={18} /></button>
              </div>

              <form onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget;
                handleZoneSave(editingZone.id, {
                  name: (form.elements.namedItem('zName') as HTMLInputElement).value,
                  floor: (form.elements.namedItem('zFloor') as HTMLInputElement).value,
                  totalSlots: Number((form.elements.namedItem('zTotal') as HTMLInputElement).value),
                  occupiedSlots: Number((form.elements.namedItem('zOccupied') as HTMLInputElement).value),
                  status: (form.elements.namedItem('zStatus') as HTMLSelectElement).value,
                });
              }} className="space-y-3 text-xs">
                <div>
                  <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Zone Name</label>
                  <input name="zName" defaultValue={editingZone.name} required className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Location / Level</label>
                    <input name="zFloor" defaultValue={editingZone.floor} required className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none" />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Status Override</label>
                    <select name="zStatus" defaultValue={editingZone.status} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none">
                      <option value="Available">Available</option>
                      <option value="Limited">Limited</option>
                      <option value="Full">Full</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Total Slots</label>
                    <input name="zTotal" type="number" min={1} max={500} defaultValue={editingZone.totalSlots} required className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Occupied Slots</label>
                    <input name="zOccupied" type="number" min={0} max={editingZone.totalSlots} defaultValue={editingZone.occupiedSlots} required className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none font-mono" />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingZone(null)} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl font-bold text-white cursor-pointer" style={{ background: 'var(--accent)' }}>Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Add Zone Modal */}
      <AnimatePresence>
        {isAddingZone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsAddingZone(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl p-6 z-10 space-y-4"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>Provision New Parking Zone</h3>
                <button onClick={() => setIsAddingZone(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
              </div>

              <form onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget;
                handleAddZone({
                  name: (form.elements.namedItem('newName') as HTMLInputElement).value,
                  floor: (form.elements.namedItem('newFloor') as HTMLInputElement).value,
                  category: (form.elements.namedItem('newCat') as HTMLSelectElement).value,
                  totalSlots: Number((form.elements.namedItem('newTotal') as HTMLInputElement).value),
                  occupiedSlots: Number((form.elements.namedItem('newOccupied') as HTMLInputElement).value),
                });
              }} className="space-y-3 text-xs">
                <div>
                  <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Zone Name</label>
                  <input name="newName" placeholder="e.g. EV Charging Station B1" required className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Location Level</label>
                    <input name="newFloor" defaultValue="Basement 1" required className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none" />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Category</label>
                    <select name="newCat" className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none">
                      <option value="Student">Student</option>
                      <option value="Faculty">Faculty</option>
                      <option value="Guest">Guest / Visitor</option>
                      <option value="Official">Official Staff</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Total Slot Capacity</label>
                    <input name="newTotal" type="number" min={1} defaultValue={25} required className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Initial Occupied</label>
                    <input name="newOccupied" type="number" min={0} defaultValue={0} required className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none font-mono" />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddingZone(false)} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl font-bold text-white cursor-pointer" style={{ background: 'var(--accent)' }}>Create Zone</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Register Vehicle Modal */}
      <AnimatePresence>
        {isRegisteringVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsRegisteringVehicle(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl p-6 z-10 space-y-4"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>Register Campus Vehicle</h3>
                <button onClick={() => setIsRegisteringVehicle(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
              </div>

              <form onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget;
                handleRegisterVehicle({
                  plate: (form.elements.namedItem('vPlate') as HTMLInputElement).value.toUpperCase().trim(),
                  owner: (form.elements.namedItem('vOwner') as HTMLInputElement).value,
                  category: (form.elements.namedItem('vCat') as HTMLSelectElement).value as VehicleRecord['category'],
                  department: (form.elements.namedItem('vDept') as HTMLInputElement).value,
                  type: (form.elements.namedItem('vType') as HTMLSelectElement).value as VehicleRecord['type'],
                  status: (form.elements.namedItem('vStatus') as HTMLSelectElement).value as VehicleRecord['status'],
                });
              }} className="space-y-3 text-xs">
                <div>
                  <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>License Plate Number</label>
                  <input name="vPlate" placeholder="e.g. DHAKA-METRO-GA-11-2233" required className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none font-mono uppercase" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Owner / Driver Name</label>
                  <input name="vOwner" placeholder="e.g. Dr. Kazi Shafiqul Islam" required className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Affiliation</label>
                    <select name="vCat" className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none">
                      <option value="Faculty">Faculty</option>
                      <option value="Student">Student</option>
                      <option value="Staff">Staff</option>
                      <option value="Guest">Guest</option>
                      <option value="Official">Official</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Vehicle Type</label>
                    <select name="vType" className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none">
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Minivan">Minivan</option>
                      <option value="Bus">Bus</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Department / Unit</label>
                    <input name="vDept" defaultValue="CSE Department" required className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none" />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Initial Clearance</label>
                    <select name="vStatus" className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none">
                      <option value="Authorized">Authorized</option>
                      <option value="VIP">VIP</option>
                      <option value="Temporary">Temporary</option>
                      <option value="Blacklisted">Blacklisted</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsRegisteringVehicle(false)} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl font-bold text-white cursor-pointer" style={{ background: 'var(--accent)' }}>Complete Registration</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Broadcast Modal */}
      <AnimatePresence>
        {isBroadcasting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsBroadcasting(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl p-6 z-10 space-y-4"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>Dispatch Campus Broadcast</h3>
                <button onClick={() => setIsBroadcasting(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
              </div>

              <form onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget;
                handleBroadcast({
                  title: (form.elements.namedItem('bTitle') as HTMLInputElement).value,
                  message: (form.elements.namedItem('bMsg') as HTMLTextAreaElement).value,
                  category: (form.elements.namedItem('bCat') as HTMLSelectElement).value as Notification['category'],
                  urgency: (form.elements.namedItem('bUrgency') as HTMLSelectElement).value as 'normal' | 'priority' | 'urgent',
                });
              }} className="space-y-3 text-xs">
                <div>
                  <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Broadcast Headline</label>
                  <input name="bTitle" placeholder="e.g. B1 Student Zone at Peak Capacity" required className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Category</label>
                    <select name="bCat" className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none">
                      <option value="parking">Parking Advisory</option>
                      <option value="security">Security Alert</option>
                      <option value="proctor">Proctor's Office</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="announcement">Announcement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Urgency</label>
                    <select name="bUrgency" className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none">
                      <option value="normal">Normal</option>
                      <option value="priority">Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Message Content</label>
                  <textarea name="bMsg" rows={3} placeholder="Provide details regarding the advisory or emergency instructions…" required className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none" />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsBroadcasting(false)} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl font-bold text-white cursor-pointer" style={{ background: 'var(--accent)' }}>Send Broadcast</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Add User Modal */}
      <AnimatePresence>
        {isAddingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsAddingUser(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl p-6 z-10 space-y-4"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>Provision Operator Account</h3>
                <button onClick={() => setIsAddingUser(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
              </div>

              <form onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget;
                handleAddUser({
                  name: (form.elements.namedItem('uName') as HTMLInputElement).value,
                  email: (form.elements.namedItem('uEmail') as HTMLInputElement).value,
                  dept: (form.elements.namedItem('uDept') as HTMLInputElement).value,
                  role: (form.elements.namedItem('uRole') as HTMLSelectElement).value,
                });
              }} className="space-y-3 text-xs">
                <div>
                  <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                  <input name="uName" placeholder="e.g. Asif Mahmud" required className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Institutional Email</label>
                  <input name="uEmail" type="email" placeholder="e.g. asif.ict@aust.edu" required className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Assigned Role</label>
                    <select name="uRole" className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none">
                      <option value="Operator">Terminal Operator</option>
                      <option value="Security">Campus Security</option>
                      <option value="Proctor">Proctorial Board</option>
                      <option value="Admin">Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Division / Center</label>
                    <input name="uDept" defaultValue="Campus Safety Division" required className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none" />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddingUser(false)} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl font-bold text-white cursor-pointer" style={{ background: 'var(--accent)' }}>Provision Account</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Camera Focus Modal */}
      <AnimatePresence>
        {focusedCamera && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setFocusedCamera(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl rounded-3xl overflow-hidden z-10"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}
            >
              <div className="p-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Camera size={18} style={{ color: 'var(--accent)' }} />
                  <span className="font-bold text-sm text-white">{focusedCamera.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">({focusedCamera.id.toUpperCase()})</span>
                </div>
                <button onClick={() => setFocusedCamera(null)} className="text-gray-400 hover:text-white"><X size={18} /></button>
              </div>

              {/* Large Frame */}
              <div className="h-96 bg-black relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent h-20 w-full animate-pulse" />

                <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 rounded-md text-xs font-mono text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>LIVE SURVEILLANCE FEED</span>
                </div>

                <div className="absolute top-4 right-4 bg-black/80 px-3 py-1 rounded-md text-xs font-mono text-cyan-400">
                  RTSP 1080p @ 30 FPS · H.264
                </div>

                {yoloOverlay && (
                  <div className="absolute inset-10 border-2 border-emerald-400/60 rounded-xl flex items-start p-2 pointer-events-none">
                    <span className="bg-emerald-500 text-black text-xs font-mono font-bold px-2 py-0.5 rounded">
                      YOLOv8 DETECTED: [AUST-RAMP-01 | Car Conf: 99.1%]
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <Camera size={44} className="mx-auto mb-2 text-gray-600" />
                  <p className="text-sm font-mono text-gray-400">{focusedCamera.location}</p>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between text-xs">
                <span className="text-gray-400">{focusedCamera.detectionStatus}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { showToast(`Snapshot captured and stored for ${focusedCamera.name}`, 'success'); }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer"
                  >
                    Take Snapshot
                  </button>
                  <button
                    onClick={() => setFocusedCamera(null)}
                    className="px-4 py-1.5 rounded-xl text-white font-bold cursor-pointer"
                    style={{ background: 'var(--accent)' }}
                  >
                    Close Stream
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
