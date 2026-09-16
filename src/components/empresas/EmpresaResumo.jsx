import { Box, Stack, Typography } from '@mui/material';
import SituacaoChip from '../common/SituacaoChip';
import { formatarCnpj } from '../../utils/cnpj';
import { formatarData, formatarTelefone } from '../../utils/formatters';

function Campo({ rotulo, valor }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {rotulo}
      </Typography>
      <Typography variant="body2">{valor || '—'}</Typography>
    </Box>
  );
}

export default function EmpresaResumo({ empresa }) {
  return (
    <Stack spacing={1.5}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h6">{empresa.razao_social}</Typography>
        <SituacaoChip situacao={empresa.situacao_cadastral} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
        <Campo rotulo="CNPJ" valor={formatarCnpj(empresa.cnpj)} />
        <Campo rotulo="Nome fantasia" valor={empresa.nome_fantasia} />
        <Campo rotulo="Atividade principal (CNAE)" valor={empresa.cnae_descricao} />
        <Campo rotulo="Natureza jurídica" valor={empresa.natureza_juridica} />
        <Campo rotulo="Porte" valor={empresa.porte} />
        <Campo rotulo="Início das atividades" valor={formatarData(empresa.data_inicio_atividade)} />
        <Campo rotulo="Endereço" valor={empresa.logradouro} />
        <Campo rotulo="Cidade / UF" valor={[empresa.municipio, empresa.uf].filter(Boolean).join(' / ')} />
        <Campo rotulo="Telefone" valor={formatarTelefone(empresa.telefone)} />
        <Campo rotulo="E-mail" valor={empresa.email} />
      </Box>
    </Stack>
  );
}
