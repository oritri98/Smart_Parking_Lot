// analyticsService.ts
// TODO: Replace mock data with real API calls when ML/analytics backend is deployed
// Endpoint: GET /api/v1/analytics/dashboard

import type { DashboardStats, HourlyData, DailyData, WeeklyComparison } from '../types';
import { dashboardStats, hourlyOccupancyData, dailyUsageData, weeklyComparisonData } from '../data/mockData';

export const analyticsService = {
  // TODO: axios.get('/api/v1/analytics/dashboard')
  async getDashboardStats(): Promise<DashboardStats> {
    await new Promise(r => setTimeout(r, 600));
    return dashboardStats;
  },

  // TODO: axios.get('/api/v1/analytics/hourly?date=YYYY-MM-DD')
  async getHourlyData(): Promise<HourlyData[]> {
    await new Promise(r => setTimeout(r, 400));
    return hourlyOccupancyData;
  },

  // TODO: axios.get('/api/v1/analytics/daily?week=current')
  async getDailyData(): Promise<DailyData[]> {
    await new Promise(r => setTimeout(r, 400));
    return dailyUsageData;
  },

  // TODO: axios.get('/api/v1/analytics/weekly-comparison')
  async getWeeklyComparison(): Promise<WeeklyComparison[]> {
    await new Promise(r => setTimeout(r, 400));
    return weeklyComparisonData;
  },

  // TODO: POST /api/v1/analytics/predict — ML prediction endpoint
  // Returns: { predictedOccupancy: number, confidence: number, isSimulated: true }
  async getPredictedDemand(_targetDate: string): Promise<{ value: number; confidence: number; isSimulated: boolean }> {
    await new Promise(r => setTimeout(r, 800));
    return { value: 87, confidence: 0.78, isSimulated: true };
  },
};
