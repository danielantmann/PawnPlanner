import { api } from '@/src/lib/axios';
import { DashboardTodayResponse, DashboardWeeklyResponse } from '../types/dashboard.types';

export const getDashboardTodayApi = async () => {
  const { data } = await api.get<DashboardTodayResponse>('/dashboards/today');
  return data;
};

export const getDashboardWeeklyApi = async () => {
  const { data } = await api.get<DashboardWeeklyResponse>('/dashboards/weekly');
  return data;
};
