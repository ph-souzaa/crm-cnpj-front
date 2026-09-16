import { Chip } from '@mui/material';

const CORES = {
  ATIVA: 'success',
  SUSPENSA: 'warning',
  INAPTA: 'warning',
  BAIXADA: 'error',
  NULA: 'error',
};

export default function SituacaoChip({ situacao }) {
  if (!situacao) return null;
  return <Chip size="small" label={situacao} color={CORES[situacao] ?? 'default'} variant="outlined" />;
}
