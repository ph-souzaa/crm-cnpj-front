import { Avatar, Box, Paper, Skeleton, Typography } from '@mui/material';

export default function KpiCard({ titulo, valor, descricao, icone, cor = 'primary.main', carregando }) {
  return (
    <Paper sx={{ p: 2.5, height: '100%', display: 'flex', gap: 2, alignItems: 'center' }}>
      <Avatar sx={{ bgcolor: cor, width: 48, height: 48 }}>{icone}</Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary">
          {titulo}
        </Typography>
        <Typography variant="h5" noWrap>
          {carregando ? <Skeleton width={90} /> : valor}
        </Typography>
        {descricao && (
          <Typography variant="caption" color="text.secondary">
            {descricao}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
