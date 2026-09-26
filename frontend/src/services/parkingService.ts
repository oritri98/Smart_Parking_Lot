// parkingService.ts
// Real API calls to Laravel / PHP Backend
// Endpoint: GET /api/v1/parking-status?basement=B1|B2

import type { ParkingZone, ParkingSlot } from '../types';
import { apiClient } from './apiClient';
import { parkingZones, studentSlots, facultySlots, guestSlots } from '../data/mockData';

export const parkingService = {
  async getParkingZones(basement?: 'B1' | 'B2'): Promise<ParkingZone[]> {
    try {
      const response = await apiClient.get<ParkingZone[]>('/parking-status', {
        params: basement ? { basement } : undefined,
      });
      return response.data;
    } catch {
      if (basement) return parkingZones.filter(z => z.basement === basement);
      return parkingZones;
    }
  },

  async getZoneById(zoneId: string): Promise<ParkingZone | undefined> {
    try {
      const response = await apiClient.get<ParkingZone>(`/parking-status/${zoneId}`);
      return response.data;
    } catch {
      return parkingZones.find(z => z.id === zoneId);
    }
  },

  async getParkingSlots(zoneId: string): Promise<ParkingSlot[]> {
    try {
      const response = await apiClient.get<ParkingSlot[]>('/parking-slots', {
        params: { zoneId },
      });
      return response.data;
    } catch {
      const map: Record<string, ParkingSlot[]> = {
        'student-b1': studentSlots,
        'faculty-b2': facultySlots,
        'guest-b2': guestSlots,
      };
      return map[zoneId] ?? [];
    }
  },

  async refreshStatus(): Promise<ParkingZone[]> {
    try {
      const response = await apiClient.post<{ message: string; zones: ParkingZone[] }>('/parking-status/refresh');
      return response.data.zones;
    } catch {
      return parkingZones.map(z => ({ ...z, lastUpdated: new Date() }));
    }
  },
};
