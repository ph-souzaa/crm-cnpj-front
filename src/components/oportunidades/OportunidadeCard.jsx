import { Box, IconButton, LinearProgress, Paper, Stack, Tooltip, Typography } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import { formatarData, formatarMoeda } from '../../utils/formatters';

export default function OportunidadeCard({ oportunidade, cor, arrastando, aoEditar, aoExcluir }) {
  return (
    <Paper
      sx={{
        p: 1.5,
        borderLeft: `4px solid ${cor}`,
        boxShadow: arrastando ? 6 : 0,
        transform: arrastando ? 'rotate(2deg)' : 'none',
        transition: 'box-shadow .2s',
        '&:hover .acoes': { opacity: 1 },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600}>
            {oportunidade.titulo}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap component="div">
            {oportunidade.empresa_nome}
          </Typography>
        </Box>
        <Box className="acoes" sx={{ display: 'flex', opacity: { xs: 1, md: 0 }, transition: 'opacity .2s' }}>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => aoEditar(oportunidade)}>
              <EditRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton size="small" color="error" onClick={() => aoExcluir(oportunidade)}>
              <DeleteRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 1 }}>
        {formatarMoeda(oportunidade.valor)}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
        <LinearProgress
          variant="determinate"
          value={oportunidade.probabilidade}
          sx={{ flexGrow: 1, height: 6, borderRadius: 3, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: cor } }}
        />
        <Typography variant="caption" color="text.secondary">
          {oportunidade.probabilidade}%
        </Typography>
      </Stack>
      {oportunidade.previsao_fechamento && (
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1, color: 'text.secondary' }}>
          <EventRoundedIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption">{formatarData(oportunidade.previsao_fechamento)}</Typography>
        </Stack>
      )}
    </Paper>
  );
}
