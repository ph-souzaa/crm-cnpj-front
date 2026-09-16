import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  IconButton,
  Link,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import PageHeader from '../components/common/PageHeader';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmpresaResumo from '../components/empresas/EmpresaResumo';
import EmpresaEditDialog from '../components/empresas/EmpresaEditDialog';
import { ETAPAS_POR_ID } from '../constants/etapas';
import { useNotificacao } from '../contexts/NotificationContext';
import { useOportunidadeAcoes } from '../hooks/useOportunidadeAcoes';
import { empresasService } from '../services/empresasService';
import { formatarData, formatarMoeda } from '../utils/formatters';

export default function EmpresaDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const notificar = useNotificacao();
  const [empresa, setEmpresa] = useState(null);
  const [erro, setErro] = useState('');
  const [editando, setEditando] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [ocupado, setOcupado] = useState(false);

  const carregar = useCallback(async () => {
    setErro('');
    try {
      setEmpresa(await empresasService.obter(id));
    } catch (e) {
      setErro(e.message);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const oportunidades = useOportunidadeAcoes({ empresaFixa: empresa, aoAlterar: carregar });

  const sincronizar = async () => {
    setOcupado(true);
    try {
      await empresasService.sincronizar(id);
      notificar.sucesso('Dados atualizados pela BrasilAPI.');
      carregar();
    } catch (e) {
      notificar.erro(e.message);
    } finally {
      setOcupado(false);
    }
  };

  const excluir = async () => {
    setOcupado(true);
    try {
      await empresasService.excluir(id);
      notificar.sucesso('Empresa excluída.');
      navigate('/empresas');
    } catch (e) {
      notificar.erro(e.message);
      setOcupado(false);
    }
  };

  if (erro) {
    return (
      <Alert severity="error" action={<Button color="inherit" component={RouterLink} to="/empresas">Voltar</Button>}>
        {erro}
      </Alert>
    );
  }

  const totalAberto = (empresa?.oportunidades ?? [])
    .filter((o) => !['ganha', 'perdida'].includes(o.etapa))
    .reduce((soma, o) => soma + o.valor, 0);

  return (
    <>
      <Breadcrumbs sx={{ mb: 1 }}>
        <Link component={RouterLink} to="/empresas" underline="hover" color="inherit">
          Empresas
        </Link>
        <Typography color="text.primary">{empresa ? empresa.nome_fantasia || empresa.razao_social : '...'}</Typography>
      </Breadcrumbs>

      <PageHeader
        titulo={empresa ? empresa.nome_fantasia || empresa.razao_social : <Skeleton width={300} />}
        subtitulo={empresa?.segmento && <Chip size="small" label={empresa.segmento} component="span" />}
        acoes={
          empresa && (
            <>
              <Button variant="outlined" startIcon={<SyncRoundedIcon />} onClick={sincronizar} disabled={ocupado}>
                Sincronizar
              </Button>
              <Button variant="outlined" startIcon={<EditRoundedIcon />} onClick={() => setEditando(true)}>
                Editar
              </Button>
              <Button variant="outlined" color="error" startIcon={<DeleteRoundedIcon />} onClick={() => setConfirmarExclusao(true)}>
                Excluir
              </Button>
            </>
          )
        }
      />

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '2fr 3fr' }, alignItems: 'start' }}>
        <Paper sx={{ p: 2.5 }}>
          <Typography variant="overline" color="text.secondary">
            Dados cadastrais (BrasilAPI)
          </Typography>
          {empresa ? <EmpresaResumo empresa={empresa} /> : <Skeleton variant="rounded" height={320} />}
          {empresa?.observacoes && (
            <Box sx={{ mt: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Observações
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {empresa.observacoes}
              </Typography>
            </Box>
          )}
        </Paper>

        <Paper>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2.5, pb: 1 }}>
            <Box>
              <Typography variant="h6">Oportunidades</Typography>
              <Typography variant="body2" color="text.secondary">
                Em aberto: {formatarMoeda(totalAberto)}
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => oportunidades.criar()} disabled={!empresa}>
              Nova
            </Button>
          </Stack>
          {empresa && empresa.oportunidades.length === 0 ? (
            <EmptyState
              icone={<HandshakeRoundedIcon fontSize="inherit" />}
              titulo="Nenhuma oportunidade"
              descricao="Registre a primeira negociação com esta empresa."
            />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell>Etapa</TableCell>
                    <TableCell align="right">Valor</TableCell>
                    <TableCell>Previsão</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(empresa?.oportunidades ?? []).map((oportunidade) => {
                    const etapa = ETAPAS_POR_ID[oportunidade.etapa];
                    return (
                      <TableRow key={oportunidade.id} hover>
                        <TableCell>{oportunidade.titulo}</TableCell>
                        <TableCell>
                          <Chip size="small" label={etapa.label} sx={{ bgcolor: etapa.cor, color: '#fff' }} />
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                          {formatarMoeda(oportunidade.valor)}
                        </TableCell>
                        <TableCell>{formatarData(oportunidade.previsao_fechamento)}</TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                          <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => oportunidades.editar(oportunidade)}>
                              <EditRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir">
                            <IconButton size="small" color="error" onClick={() => oportunidades.excluir(oportunidade)}>
                              <DeleteRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {oportunidades.dialogos}
      <EmpresaEditDialog
        empresa={editando ? empresa : null}
        aoFechar={() => setEditando(false)}
        aoSalvar={() => {
          setEditando(false);
          notificar.sucesso('Empresa atualizada.');
          carregar();
        }}
      />
      <ConfirmDialog
        aberto={confirmarExclusao}
        titulo="Excluir empresa"
        mensagem={`Deseja excluir ${empresa?.razao_social}? As oportunidades dela também serão removidas.`}
        carregando={ocupado}
        aoConfirmar={excluir}
        aoFechar={() => setConfirmarExclusao(false)}
      />
    </>
  );
}
