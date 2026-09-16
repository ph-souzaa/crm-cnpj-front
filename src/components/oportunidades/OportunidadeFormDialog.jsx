import { useEffect, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ETAPAS, ETAPAS_POR_ID } from '../../constants/etapas';
import { useDebounce } from '../../hooks/useDebounce';
import { empresasService } from '../../services/empresasService';
import { oportunidadesService } from '../../services/oportunidadesService';

function estadoInicial(oportunidade, etapaInicial) {
  const etapa = oportunidade?.etapa ?? etapaInicial ?? 'prospeccao';
  return {
    titulo: oportunidade?.titulo ?? '',
    valor: oportunidade?.valor ?? '',
    etapa,
    probabilidade: oportunidade?.probabilidade ?? ETAPAS_POR_ID[etapa].probabilidade,
    previsao_fechamento: oportunidade?.previsao_fechamento ?? '',
  };
}

/**
 * Cria ou edita uma oportunidade.
 * - `oportunidade`: quando informada, o diálogo edita (PUT); senão, cria (POST).
 * - `empresaFixa`: empresa já definida (página de detalhe); sem ela, o usuário escolhe na lista.
 */
export default function OportunidadeFormDialog({ aberto, oportunidade, empresaFixa, etapaInicial, aoFechar, aoSalvar }) {
  const editando = Boolean(oportunidade);
  const [form, setForm] = useState(estadoInicial(oportunidade, etapaInicial));
  const [empresa, setEmpresa] = useState(null);
  const [busca, setBusca] = useState('');
  const [opcoes, setOpcoes] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const buscaAtrasada = useDebounce(busca, 300);
  const precisaEscolherEmpresa = !editando && !empresaFixa;

  useEffect(() => {
    if (aberto) {
      setForm(estadoInicial(oportunidade, etapaInicial));
      setEmpresa(null);
      setErro('');
    }
  }, [aberto, oportunidade, etapaInicial]);

  useEffect(() => {
    if (!aberto || !precisaEscolherEmpresa) return;
    let ativo = true;
    empresasService
      .listar({ busca: buscaAtrasada, tamanho: 20, ordenar: 'razao_social' })
      .then((pagina) => ativo && setOpcoes(pagina.itens))
      .catch(() => ativo && setOpcoes([]));
    return () => {
      ativo = false;
    };
  }, [aberto, precisaEscolherEmpresa, buscaAtrasada]);

  const alterar = (campo) => (evento) => setForm({ ...form, [campo]: evento.target.value });

  const alterarEtapa = (evento) => {
    const etapa = evento.target.value;
    setForm({ ...form, etapa, probabilidade: ETAPAS_POR_ID[etapa].probabilidade });
  };

  const salvar = async (evento) => {
    evento.preventDefault();
    setSalvando(true);
    setErro('');
    const dados = {
      titulo: form.titulo.trim(),
      valor: Number(form.valor) || 0,
      etapa: form.etapa,
      probabilidade: form.probabilidade,
      previsao_fechamento: form.previsao_fechamento || null,
    };
    try {
      const salva = editando
        ? await oportunidadesService.atualizar(oportunidade.id, dados)
        : await oportunidadesService.criar({ ...dados, empresa_id: empresaFixa?.id ?? empresa?.id });
      aoSalvar(salva, editando);
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const podeSalvar = form.titulo.trim().length >= 3 && (!precisaEscolherEmpresa || empresa);

  return (
    <Dialog open={aberto} onClose={salvando ? undefined : aoFechar} maxWidth="sm" fullWidth>
      <form onSubmit={salvar}>
        <DialogTitle>{editando ? 'Editar oportunidade' : 'Nova oportunidade'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {erro && <Alert severity="error">{erro}</Alert>}
            {precisaEscolherEmpresa ? (
              <Autocomplete
                options={opcoes}
                value={empresa}
                onChange={(_e, valor) => setEmpresa(valor)}
                onInputChange={(_e, valor) => setBusca(valor)}
                filterOptions={(x) => x}
                getOptionLabel={(opcao) => opcao.nome_fantasia || opcao.razao_social}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                noOptionsText="Nenhuma empresa encontrada. Cadastre-a em Empresas."
                renderInput={(params) => <TextField {...params} label="Empresa" required />}
              />
            ) : (
              <TextField
                label="Empresa"
                value={
                  oportunidade?.empresa_nome ?? (empresaFixa?.nome_fantasia || empresaFixa?.razao_social) ?? ''
                }
                disabled
              />
            )}
            <TextField
              label="Título"
              placeholder="Ex.: Licenças do ERP"
              value={form.titulo}
              onChange={alterar('titulo')}
              required
              slotProps={{ htmlInput: { minLength: 3, maxLength: 150 } }}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Valor"
                type="number"
                value={form.valor}
                onChange={alterar('valor')}
                fullWidth
                slotProps={{
                  htmlInput: { min: 0, step: '0.01' },
                  input: { startAdornment: <InputAdornment position="start">R$</InputAdornment> },
                }}
              />
              <TextField select label="Etapa" value={form.etapa} onChange={alterarEtapa} fullWidth>
                {ETAPAS.map((etapa) => (
                  <MenuItem key={etapa.id} value={etapa.id}>
                    {etapa.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <TextField
              label="Previsão de fechamento"
              type="date"
              value={form.previsao_fechamento}
              onChange={alterar('previsao_fechamento')}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <div>
              <Typography variant="body2" color="text.secondary">
                Probabilidade de fechamento: <strong>{form.probabilidade}%</strong>
              </Typography>
              <Slider
                value={form.probabilidade}
                onChange={(_e, valor) => setForm({ ...form, probabilidade: valor })}
                step={5}
                min={0}
                max={100}
                valueLabelDisplay="auto"
              />
            </div>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={aoFechar} disabled={salvando}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={!podeSalvar || salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
