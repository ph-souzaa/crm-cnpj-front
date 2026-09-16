import { useEffect, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { empresasService } from '../../services/empresasService';

const CAMPOS = ['nome_fantasia', 'telefone', 'email', 'segmento', 'observacoes'];

function paraFormulario(empresa) {
  return Object.fromEntries(CAMPOS.map((campo) => [campo, empresa?.[campo] ?? '']));
}

export default function EmpresaEditDialog({ empresa, aoFechar, aoSalvar }) {
  const [form, setForm] = useState(paraFormulario(empresa));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    setForm(paraFormulario(empresa));
    setErro('');
  }, [empresa]);

  const alterar = (campo) => (evento) => setForm({ ...form, [campo]: evento.target.value });

  const salvar = async (evento) => {
    evento.preventDefault();
    setSalvando(true);
    setErro('');
    try {
      const dados = Object.fromEntries(Object.entries(form).map(([campo, valor]) => [campo, valor.trim() || null]));
      aoSalvar(await empresasService.atualizar(empresa.id, dados));
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={Boolean(empresa)} onClose={salvando ? undefined : aoFechar} maxWidth="sm" fullWidth>
      <form onSubmit={salvar}>
        <DialogTitle>Editar {empresa?.razao_social}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {erro && <Alert severity="error">{erro}</Alert>}
            <TextField label="Nome fantasia" value={form.nome_fantasia} onChange={alterar('nome_fantasia')} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Telefone" value={form.telefone} onChange={alterar('telefone')} fullWidth />
              <TextField label="E-mail" type="email" value={form.email} onChange={alterar('email')} fullWidth />
            </Stack>
            <TextField label="Segmento" value={form.segmento} onChange={alterar('segmento')} />
            <TextField label="Observações" value={form.observacoes} onChange={alterar('observacoes')} multiline minRows={3} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={aoFechar} disabled={salvando}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
