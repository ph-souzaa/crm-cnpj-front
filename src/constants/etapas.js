export const ETAPAS = [
  { id: 'prospeccao', label: 'Prospecção', cor: '#64748b', probabilidade: 10 },
  { id: 'qualificacao', label: 'Qualificação', cor: '#0ea5e9', probabilidade: 25 },
  { id: 'proposta', label: 'Proposta', cor: '#6366f1', probabilidade: 50 },
  { id: 'negociacao', label: 'Negociação', cor: '#f59e0b', probabilidade: 75 },
  { id: 'ganha', label: 'Ganha', cor: '#16a34a', probabilidade: 100 },
  { id: 'perdida', label: 'Perdida', cor: '#dc2626', probabilidade: 0 },
];

export const ETAPAS_POR_ID = Object.fromEntries(ETAPAS.map((etapa) => [etapa.id, etapa]));
