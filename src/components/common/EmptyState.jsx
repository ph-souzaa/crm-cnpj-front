import { Box, Typography } from '@mui/material';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';

export default function EmptyState({ titulo, descricao, acao, icone }) {
  return (
    <Box sx={{ textAlign: 'center', py: 6, px: 2, color: 'text.secondary' }}>
      <Box sx={{ fontSize: 48, color: 'primary.light', mb: 1 }}>{icone ?? <InboxRoundedIcon fontSize="inherit" />}</Box>
      <Typography variant="h6" color="text.primary">
        {titulo}
      </Typography>
      {descricao && <Typography sx={{ mt: 0.5, mb: 2 }}>{descricao}</Typography>}
      {acao}
    </Box>
  );
}
