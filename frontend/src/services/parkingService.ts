// parkingService.ts
// TODO: Replace mock data with real API calls when backend is deployed
// Endpoint: GET /api/v1/parking-status?basement=B1|B2|all

import type { ParkingZone, ParkingSlot } from '../types';
import { parkingZones, studentSlots, facultySlots, guestSlots } from '../data/mockData';

export const parkingService = {
  // TODO: axios.get('/api/v1/parking-status')
  async getParkingZones(basement?: 'B1' | 'B2'): Promise<ParkingZone[]> {
    await new Promise(r => setTimeout(r, 500)); // Simulate network latency
    if (basement) return parkingZones.filter(z => z.basement === basement);
    return parkingZones;
  },

  // TODO: axios.get(`/api/v1/parking-zones/${zoneId}`)
  async getZoneById(zoneId: string): Promise<ParkingZone | undefined> {
    await new Promise(r => setTimeout(r, 300));
    return parkingZones.find(z => z.id === zoneId);
  },

  // TODO: axios.get(`/api/v1/parking-slots?zoneId=${zoneId}`)
  async getParkingSlots(zoneId: string): Promise<ParkingSlot[]> {
    await new Promise(r => setTimeout(r, 400));
    const map: Record<string, ParkingSlot[]> = {
      'student-b1': studentSlots,
      'faculty-b2': facultySlots,
      'guest-b2': guestSlots,
    };
    return map[zoneId] ?? [];
  },

  // TODO: POST /api/v1/parking-status/refresh
  async refreshStatus(): Promise<ParkingZone[]> {
    await new Promise(r => setTimeout(r, 800));
    return parkingZones.map(z => ({ ...z, lastUpdated: new Date() }));
  },
};
