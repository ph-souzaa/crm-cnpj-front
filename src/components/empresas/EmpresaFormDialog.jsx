import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EmpresaResumo from './EmpresaResumo';
import { empresasService } from '../../services/empresasService';
import { formatarCnpj, limparCnpj, validarCnpj } from '../../utils/cnpj';

const ESTADO_INICIAL = { cnpj: '', segmento: '', observacoes: '' };

export default function EmpresaFormDialog({ aberto, aoFechar, aoSalvar }) {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [previa, setPrevia] = useState(null);
  const [consultando, setConsultando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const cnpjCompleto = limparCnpj(form.cnpj).length === 14;
  const cnpjInvalido = cnpjCompleto && !validarCnpj(form.cnpj);

  const fechar = () => {
    setForm(ESTADO_INICIAL);
    setPrevia(null);
    setErro('');
    aoFechar();
  };

  const alterarCnpj = (evento) => {
    setForm((atual) => ({ ...atual, cnpj: formatarCnpj(evento.target.value) }));
    setPrevia(null);
    setErro('');
  };

  const consultar = async (evento) => {
    evento?.preventDefault();
    if (!validarCnpj(form.cnpj)) return;
    setConsultando(true);
    setErro('');
    try {
      setPrevia(await empresasService.previaCnpj(limparCnpj(form.cnpj)));
    } catch (e) {
      setErro(e.message);
    } finally {
      setConsultando(false);
    }
  };

  const salvar = async () => {
    setSalvando(true);
    setErro('');
    try {
      const empresa = await empresasService.criar({
        cnpj: limparCnpj(form.cnpj),
        segmento: form.segmento || null,
        observacoes: form.observacoes || null,
      });
      aoSalvar(empresa);
      fechar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={aberto} onClose={salvando ? undefined : fechar} maxWidth="md" fullWidth>
      <DialogTitle>Nova empresa</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Box component="form" onSubmit={consultar} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <TextField
              label="CNPJ"
              placeholder="00.000.000/0000-00"
              value={form.cnpj}
              onChange={alterarCnpj}
              autoFocus
              fullWidth
              error={cnpjInvalido}
              helperText={cnpjInvalido ? 'CNPJ inválido: confira os dígitos.' : 'Os dados cadastrais serão buscados na BrasilAPI.'}
              slotProps={{ htmlInput: { inputMode: 'numeric' } }}
            />
            <Button
              type="submit"
              variant="outlined"
              disabled={!cnpjCompleto || cnpjInvalido || consultando}
              startIcon={consultando ? <CircularProgress size={18} /> : <SearchRoundedIcon />}
              sx={{ height: 56, flexShrink: 0 }}
            >
              Consultar
            </Button>
          </Box>

          {erro && <Alert severity="error">{erro}</Alert>}

          {previa && (
            <>
              {previa.ja_cadastrada && <Alert severity="warning">Esta empresa já está cadastrada no CRM.</Alert>}
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <EmpresaResumo empresa={previa} />
              </Paper>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr' }, gap: 2 }}>
                <TextField
                  label="Segmento"
                  placeholder="Ex.: Tecnologia"
                  value={form.segmento}
                  onChange={(e) => setForm({ ...form, segmento: e.target.value })}
                />
                <TextField
                  label="Observações"
                  value={form.observacoes}
                  onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                />
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={fechar} disabled={salvando}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={salvar} disabled={!previa || previa.ja_cadastrada || salvando}>
          {salvando ? 'Salvando...' : 'Salvar empresa'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
