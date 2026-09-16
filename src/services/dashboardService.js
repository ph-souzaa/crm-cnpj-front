import { request } from './apiClient';

export const dashboardService = {
  resumo: () => request('/dashboard/resumo'),
};
