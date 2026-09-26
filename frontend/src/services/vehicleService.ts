// vehicleService.ts
// Real API calls to Laravel / PHP Backend
// Endpoints: POST /api/v1/vehicles/entry | POST /api/v1/vehicles/exit | GET /api/v1/vehicles/:plateNumber

import type { Vehicle, Notification } from '../types';
import { apiClient } from './apiClient';
import { mockNotifications } from '../data/mockData';

export const vehicleService = {
  async recordEntry(plateNumber: string, basement: 'B1' | 'B2'): Promise<Vehicle> {
    const ownerCategory = basement === 'B1' ? 'Student' : 'Faculty';
    const res = await apiClient.post<{ message: string; record: Vehicle }>('/vehicles/entry', {
      plateNumber,
      ownerCategory,
    });
    return res.data.record;
  },

  async recordExit(plateNumber: string): Promise<Vehicle> {
    const res = await apiClient.post<{ message: string; record: Vehicle }>('/vehicles/exit', {
      plateNumber,
    });
    return res.data.record;
  },

  async getVehicleByPlate(plateNumber: string): Promise<Vehicle> {
    try {
      const res = await apiClient.get<Vehicle>(`/vehicles/${plateNumber}`);
      return res.data;
    } catch {
      return {
        plateNumber,
        ownerCategory: 'Guest',
        registrationStatus: 'Unregistered',
        assignedZone: 'Guest',
        basement: 'B2',
      };
    }
  },

  async getAllVehicles(): Promise<Vehicle[]> {
    try {
      const res = await apiClient.get<Vehicle[]>('/vehicles');
      return res.data;
    } catch {
      return [];
    }
  },
};

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    try {
      const res = await apiClient.get<Notification[]>('/notifications');
      return res.data;
    } catch {
      return mockNotifications;
    }
  },

  async markAsRead(id: string): Promise<void> {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
    } catch {
      // ignore
    }
  },
};
