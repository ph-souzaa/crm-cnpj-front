import { request } from './apiClient';

export const oportunidadesService = {
  listar: (params) => request('/oportunidades', { params }),
  criar: (dados) => request('/oportunidades', { method: 'POST', body: dados }),
  atualizar: (id, dados) => request(`/oportunidades/${id}`, { method: 'PUT', body: dados }),
  excluir: (id) => request(`/oportunidades/${id}`, { method: 'DELETE' }),
};
