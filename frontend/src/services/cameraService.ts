// cameraService.ts
// Integration with Laravel API & FastAPI YOLO ML Vision Microservice

import type { CameraFeed } from '../types';
import { apiClient } from './apiClient';
import { cameraFeeds } from '../data/mockData';

const VISION_API_BASE = import.meta.env.VITE_VISION_API_URL || 'http://127.0.0.1:8001/api/v1/ml';

export interface MLPlateScanResult {
  timestamp: string;
  plate_number: string;
  confidence: number;
  registration_status: string;
  owner_category: string;
  recommended_zone: string;
  assigned_basement: string;
}

export const cameraService = {
  async getCameraFeeds(): Promise<CameraFeed[]> {
    try {
      const res = await apiClient.get<CameraFeed[]>('/cameras');
      return res.data;
    } catch {
      return cameraFeeds;
    }
  },

  async getCameraById(cameraId: string): Promise<CameraFeed | undefined> {
    try {
      const res = await apiClient.get<CameraFeed>(`/cameras/${cameraId}`);
      return res.data;
    } catch {
      return cameraFeeds.find(c => c.id === cameraId);
    }
  },

  /**
   * Send frame or plate string to YOLO Vision microservice for LPR license plate detection
   */
  async scanPlateWithML(simulatedPlate?: string): Promise<MLPlateScanResult | null> {
    try {
      const formData = new FormData();
      if (simulatedPlate) {
        formData.append('simulated_plate', simulatedPlate);
      }
      const response = await fetch(`${VISION_API_BASE}/read-plate`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  },

  async triggerDetection(_cameraId: string): Promise<void> {
    return Promise.resolve();
  },
};

