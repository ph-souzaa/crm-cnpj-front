const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const moedaCompacta = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatarMoeda(valor) {
  return moeda.format(Number(valor) || 0);
}

export function formatarMoedaCompacta(valor) {
  return moedaCompacta.format(Number(valor) || 0);
}

export function formatarData(iso) {
  if (!iso) return '—';
  const [ano, mes, dia] = String(iso).slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

export function formatarTelefone(valor) {
  const digitos = String(valor ?? '').replace(/\D/g, '');
  if (digitos.length === 10) return digitos.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  if (digitos.length === 11) return digitos.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  return digitos || '—';
}
