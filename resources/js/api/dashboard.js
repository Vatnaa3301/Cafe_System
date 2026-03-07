import client from './client';

export const getDashboardStats = () =>
    client.get('/dashboard/stats').then((r) => r.data);

export const getChartData = (period = 'week') =>
    client.get('/dashboard/chart', { params: { period } }).then((r) => r.data.chart_data);
