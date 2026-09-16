import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import PageHeader from '../components/common/PageHeader';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmpresaTable from '../components/empresas/EmpresaTable';
import EmpresaFormDialog from '../components/empresas/EmpresaFormDialog';
import EmpresaEditDialog from '../components/empresas/EmpresaEditDialog';
import { SITUACOES, UFS } from '../constants/filtros';
import { useNotificacao } from '../contexts/NotificationContext';
import { useDebounce } from '../hooks/useDebounce';
import { empresasService } from '../services/empresasService';

export default function EmpresasPage() {
  const notificar = useNotificacao();
  const [filtros, setFiltros] = useState({ busca: '', uf: '', situacao: '', ordenar: '-criado_em', pagina: 1, tamanho: 10 });
  const buscaAtrasada = useDebounce(filtros.busca);
  const [pagina, setPagina] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [novaAberta, setNovaAberta] = useState(false);
  const [emEdicao, setEmEdicao] = useState(null);
  const [paraExcluir, setParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [sincronizandoId, setSincronizandoId] = useState(null);

  const { uf, situacao, ordenar, pagina: numeroPagina, tamanho } = filtros;

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      setPagina(
        await empresasService.listar({ busca: buscaAtrasada, uf, situacao, ordenar, pagina: numeroPagina, tamanho }),
      );
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [buscaAtrasada, uf, situacao, ordenar, numeroPagina, tamanho]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const alterarFiltro = (campo) => (evento) => setFiltros({ ...filtros, [campo]: evento.target.value, pagina: 1 });

  const aoCriar = (empresa) => {
    notificar.sucesso(`${empresa.razao_social} cadastrada com sucesso.`);
    setFiltros({ ...filtros, pagina: 1 });
    carregar();
  };

  const aoEditar = (empresa) => {
    setEmEdicao(null);
    notificar.sucesso(`${empresa.razao_social} atualizada.`);
    carregar();
  };

  const sincronizar = async (empresa) => {
    setSincronizandoId(empresa.id);
    try {
      const atualizada = await empresasService.sincronizar(empresa.id);
      notificar.sucesso(`Dados de ${atualizada.razao_social} atualizados pela BrasilAPI.`);
      carregar();
    } catch (e) {
      notificar.erro(e.message);
    } finally {
      setSincronizandoId(null);
    }
  };

  const excluir = async () => {
    setExcluindo(true);
    try {
      await empresasService.excluir(paraExcluir.id);
      notificar.sucesso('Empresa excluída.');
      setParaExcluir(null);
      if (pagina?.itens.length === 1 && numeroPagina > 1) {
        setFiltros({ ...filtros, pagina: numeroPagina - 1 });
      } else {
        carregar();
      }
    } catch (e) {
      notificar.erro(e.message);
    } finally {
      setExcluindo(false);
    }
  };

  const temFiltro = Boolean(filtros.busca || uf || situacao);
  const vazio = !carregando && !erro && pagina?.total === 0;

  return (
    <>
      <PageHeader
        titulo="Empresas"
        subtitulo="Carteira de clientes. Os dados cadastrais vêm da BrasilAPI."
        acoes={
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setNovaAberta(true)}>
            Nova empresa
          </Button>
        }
      />

      <Paper sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' } }}>
          <TextField
            placeholder="Buscar por razão social, nome fantasia ou CNPJ"
            value={filtros.busca}
            onChange={alterarFiltro('busca')}
            size="small"
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
          <TextField select label="UF" value={uf} onChange={alterarFiltro('uf')} size="small">
            <MenuItem value="">Todas</MenuItem>
            {UFS.map((sigla) => (
              <MenuItem key={sigla} value={sigla}>
                {sigla}
              </MenuItem>
            ))}
          </TextField>
          <TextField select label="Situação" value={situacao} onChange={alterarFiltro('situacao')} size="small">
            <MenuItem value="">Todas</MenuItem>
            {SITUACOES.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {erro && (
          <Alert severity="error" sx={{ mx: 2, mb: 2 }} action={<Button color="inherit" onClick={carregar}>Tentar de novo</Button>}>
            {erro}
          </Alert>
        )}

        {vazio ? (
          <EmptyState
            icone={<BusinessRoundedIcon fontSize="inherit" />}
            titulo={temFiltro ? 'Nenhuma empresa encontrada' : 'Nenhuma empresa cadastrada'}
            descricao={temFiltro ? 'Ajuste a busca ou os filtros.' : 'Cadastre sua primeira empresa informando apenas o CNPJ.'}
            acao={
              !temFiltro && (
                <Button variant="contained" onClick={() => setNovaAberta(true)}>
                  Cadastrar empresa
                </Button>
              )
            }
          />
        ) : (
          <EmpresaTable
            pagina={pagina}
            carregando={carregando}
            ordenar={ordenar}
            sincronizandoId={sincronizandoId}
            aoOrdenar={(valor) => setFiltros({ ...filtros, ordenar: valor, pagina: 1 })}
            aoMudarPagina={(valor) => setFiltros({ ...filtros, pagina: valor })}
            aoMudarTamanho={(valor) => setFiltros({ ...filtros, tamanho: valor, pagina: 1 })}
            aoEditar={setEmEdicao}
            aoSincronizar={sincronizar}
            aoExcluir={setParaExcluir}
          />
        )}
      </Paper>

      <EmpresaFormDialog aberto={novaAberta} aoFechar={() => setNovaAberta(false)} aoSalvar={aoCriar} />
      <EmpresaEditDialog empresa={emEdicao} aoFechar={() => setEmEdicao(null)} aoSalvar={aoEditar} />
      <ConfirmDialog
        aberto={Boolean(paraExcluir)}
        titulo="Excluir empresa"
        mensagem={`Deseja excluir ${paraExcluir?.razao_social}? As oportunidades dela também serão removidas.`}
        carregando={excluindo}
        aoConfirmar={excluir}
        aoFechar={() => setParaExcluir(null)}
      />
    </>
  );
}
