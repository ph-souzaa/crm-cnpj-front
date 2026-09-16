import { request } from './apiClient';

export const empresasService = {
  listar: (params) => request('/empresas', { params }),
  obter: (id) => request(`/empresas/${id}`),
  previaCnpj: (cnpj) => request(`/cnpj/${cnpj}`),
  criar: (dados) => request('/empresas', { method: 'POST', body: dados }),
  atualizar: (id, dados) => request(`/empresas/${id}`, { method: 'PUT', body: dados }),
  sincronizar: (id) => request(`/empresas/${id}/sincronizar`, { method: 'POST' }),
  excluir: (id) => request(`/empresas/${id}`, { method: 'DELETE' }),
};
