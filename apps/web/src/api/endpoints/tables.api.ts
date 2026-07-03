import { apiClient } from '../client';

export const tablesApi = {
  getTables: () =>
    apiClient.get('/api/v1/tables').then((res) => res.data.data.tables),
};