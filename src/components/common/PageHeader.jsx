import { Box, Typography } from '@mui/material';

export default function PageHeader({ titulo, subtitulo, acoes }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h4" component="h1">
          {titulo}
        </Typography>
        {subtitulo && (
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitulo}
          </Typography>
        )}
      </Box>
      {acoes && <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{acoes}</Box>}
    </Box>
  );
}
