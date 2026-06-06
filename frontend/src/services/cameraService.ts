// cameraService.ts
// TODO: Replace mock data with real WebSocket/API stream when camera system is deployed
// Endpoint: GET /api/v1/cameras | WS /ws/camera-feed/:cameraId

import type { CameraFeed } from '../types';
import { cameraFeeds } from '../data/mockData';

export const cameraService = {
  // TODO: axios.get('/api/v1/cameras')
  async getCameraFeeds(): Promise<CameraFeed[]> {
    await new Promise(r => setTimeout(r, 500));
    return cameraFeeds;
  },

  // TODO: axios.get(`/api/v1/cameras/${cameraId}`)
  async getCameraById(cameraId: string): Promise<CameraFeed | undefined> {
    await new Promise(r => setTimeout(r, 300));
    return cameraFeeds.find(c => c.id === cameraId);
  },

  // TODO: WebSocket connection for live feed
  // ws://api.aust-ipms.edu.bd/ws/camera-feed/:cameraId
  // connectLiveFeed(cameraId: string, onFrame: (data: Blob) => void): WebSocket

  // TODO: POST /api/v1/cameras/:cameraId/detect — trigger LPR detection
  async triggerDetection(_cameraId: string): Promise<void> {
    throw new Error('Camera detection not yet deployed. Pending hardware integration.');
  },
};
