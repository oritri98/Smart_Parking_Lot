// analyticsService.ts
// Real API calls to Laravel / PHP Backend
// Endpoint: GET /api/v1/analytics/*

import type { DashboardStats, HourlyData, DailyData, WeeklyComparison } from '../types';
import { apiClient } from './apiClient';
import { dashboardStats, hourlyOccupancyData, dailyUsageData, weeklyComparisonData } from '../data/mockData';

export const analyticsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const res = await apiClient.get<DashboardStats>('/analytics/dashboard');
      return res.data;
    } catch {
      return dashboardStats;
    }
  },

  async getHourlyData(): Promise<HourlyData[]> {
    try {
      const res = await apiClient.get<HourlyData[]>('/analytics/hourly');
      return res.data;
    } catch {
      return hourlyOccupancyData;
    }
  },

  async getDailyData(): Promise<DailyData[]> {
    try {
      const res = await apiClient.get<DailyData[]>('/analytics/daily');
      return res.data;
    } catch {
      return dailyUsageData;
    }
  },

  async getWeeklyComparison(): Promise<WeeklyComparison[]> {
    try {
      const res = await apiClient.get<WeeklyComparison[]>('/analytics/weekly-comparison');
      return res.data;
    } catch {
      return weeklyComparisonData;
    }
  },

  async getPredictedDemand(_targetDate: string): Promise<{ value: number; confidence: number; isSimulated: boolean }> {
    try {
      const res = await apiClient.post<{ predictedOccupancyRate: number; confidence: number }>('/analytics/predict');
      return {
        value: res.data.predictedOccupancyRate,
        confidence: res.data.confidence,
        isSimulated: false,
      };
    } catch {
      return { value: 87, confidence: 0.78, isSimulated: true };
    }
  },
};
