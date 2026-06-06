// vehicleService.ts
// TODO: Implement vehicle management when backend + LPR is deployed (Future Expansion)
// Endpoints: POST /api/v1/vehicles/entry | POST /api/v1/vehicles/exit | GET /api/v1/vehicles/:plateNumber

import type { Vehicle } from '../types';

export const vehicleService = {
  // TODO: POST /api/v1/vehicles/entry — log vehicle entry (triggered by LPR camera)
  async recordEntry(_plateNumber: string, _basement: 'B1' | 'B2'): Promise<never> {
    throw new Error('Vehicle entry system not yet deployed.');
  },

  // TODO: POST /api/v1/vehicles/exit
  async recordExit(_plateNumber: string): Promise<never> {
    throw new Error('Vehicle exit system not yet deployed.');
  },

  // TODO: GET /api/v1/vehicles/:plateNumber
  // If vehicle not found in DB → classify as Guest (never Unknown)
  async getVehicleByPlate(_plateNumber: string): Promise<Vehicle> {
    // Unregistered vehicles default to Guest category as per AUST policy
    return {
      plateNumber: _plateNumber,
      ownerCategory: 'Guest',
      registrationStatus: 'Unregistered',
      assignedZone: 'Guest',
      basement: 'B2',
    };
  },

  // TODO: GET /api/v1/vehicles — list all registered vehicles (admin only)
  async getAllVehicles(): Promise<Vehicle[]> {
    return [];
  },
};

// TODO: notificationService.ts
// Endpoints: GET /api/v1/notifications | PATCH /api/v1/notifications/:id/read
export const notificationService = {
  async getNotifications() { return []; },
  async markAsRead(_id: string) { return; },
};
