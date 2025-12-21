import api from '@/lib/axios';

const reportsService = {
  async export(format: 'csv' | 'excel' | 'pdf', params?: Record<string, any>) {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
    const path = format === 'csv' ? '/reports/export/csv/' : format === 'excel' ? '/reports/export/excel/' : '/reports/export/pdf/';
    try {
      const resp = await api.get(`${path}${qs}`, { responseType: 'blob' });
      return resp.data;
    } catch (e: any) {
      throw e;
    }
  }
};

export default reportsService;
