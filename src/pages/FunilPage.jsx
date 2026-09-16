import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, InputAdornment, Skeleton, TextField } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PageHeader from '../components/common/PageHeader';
import KanbanBoard from '../components/oportunidades/KanbanBoard';
import { ETAPAS_POR_ID } from '../constants/etapas';
import { useNotificacao } from '../contexts/NotificationContext';
import { useOportunidadeAcoes } from '../hooks/useOportunidadeAcoes';
import { oportunidadesService } from '../services/oportunidadesService';

export default function FunilPage() {
  const notificar = useNotificacao();
  const [oportunidades, setOportunidades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [filtro, setFiltro] = useState('');

  const carregar = useCallback(async () => {
    setErro('');
    try {
      setOportunidades(await oportunidadesService.listar());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const acoes = useOportunidadeAcoes({ aoAlterar: carregar });

  const mover = async (id, etapa) => {
    const anteriores = oportunidades;
    const probabilidade = ETAPAS_POR_ID[etapa].probabilidade;
    // Atualização otimista: o card muda de coluna antes da resposta da API.
    setOportunidades((atuais) => atuais.map((o) => (o.id === id ? { ...o, etapa, probabilidade } : o)));
    try {
      const atualizada = await oportunidadesService.atualizar(id, { etapa, probabilidade });
      setOportunidades((atuais) => atuais.map((o) => (o.id === id ? atualizada : o)));
      notificar.sucesso(`"${atualizada.titulo}" movida para ${ETAPAS_POR_ID[etapa].label}.`);
    } catch (e) {
      setOportunidades(anteriores);
      notificar.erro(e.message);
    }
  };

  const filtradas = useMemo(() => {
    const termo = filtro.trim().toLowerCase();
    if (!termo) return oportunidades;
    return oportunidades.filter(
      (o) => o.titulo.toLowerCase().includes(termo) || o.empresa_nome.toLowerCase().includes(termo),
    );
  }, [oportunidades, filtro]);

  return (
    <>
      <PageHeader
        titulo="Funil de vendas"
        subtitulo="Arraste os cards entre as colunas para mudar a etapa da negociação"
        acoes={
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => acoes.criar()}>
            Nova oportunidade
          </Button>
        }
      />

      <TextField
        placeholder="Filtrar por título ou empresa"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        size="small"
        sx={{ mb: 2, width: { xs: '100%', sm: 360 }, bgcolor: 'background.paper' }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }} action={<Button color="inherit" onClick={carregar}>Tentar de novo</Button>}>
          {erro}
        </Alert>
      )}

      {carregando ? (
        <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" width={300} height={400} sx={{ flexShrink: 0 }} />
          ))}
        </Box>
      ) : (
        <KanbanBoard
          oportunidades={filtradas}
          aoMover={mover}
          aoCriar={acoes.criar}
          aoEditar={acoes.editar}
          aoExcluir={acoes.excluir}
        />
      )}

      {acoes.dialogos}
    </>
  );
}
