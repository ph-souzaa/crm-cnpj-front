import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function ConfirmDialog({ aberto, titulo, mensagem, textoConfirmar = 'Excluir', carregando, aoConfirmar, aoFechar }) {
  return (
    <Dialog open={aberto} onClose={carregando ? undefined : aoFechar} maxWidth="xs" fullWidth>
      <DialogTitle>{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText>{mensagem}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={aoFechar} disabled={carregando}>
          Cancelar
        </Button>
        <Button onClick={aoConfirmar} color="error" variant="contained" disabled={carregando}>
          {carregando ? 'Excluindo...' : textoConfirmar}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
