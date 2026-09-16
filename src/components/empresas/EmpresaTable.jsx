import { useNavigate } from 'react-router-dom';
import {
  Box,
  Chip,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SituacaoChip from '../common/SituacaoChip';
import { formatarCnpj } from '../../utils/cnpj';

function CabecalhoOrdenavel({ campo, rotulo, ordenar, aoOrdenar }) {
  const ativo = ordenar.replace('-', '') === campo;
  const direcao = ordenar.startsWith('-') ? 'desc' : 'asc';
  return (
    <TableSortLabel
      active={ativo}
      direction={ativo ? direcao : 'asc'}
      onClick={() => aoOrdenar(ativo && direcao === 'asc' ? `-${campo}` : campo)}
    >
      {rotulo}
    </TableSortLabel>
  );
}

export default function EmpresaTable({
  pagina,
  carregando,
  ordenar,
  sincronizandoId,
  aoOrdenar,
  aoMudarPagina,
  aoMudarTamanho,
  aoEditar,
  aoSincronizar,
  aoExcluir,
}) {
  const navigate = useNavigate();
  const itens = pagina?.itens ?? [];

  return (
    <>
      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>
                <CabecalhoOrdenavel campo="razao_social" rotulo="Empresa" ordenar={ordenar} aoOrdenar={aoOrdenar} />
              </TableCell>
              <TableCell>CNPJ</TableCell>
              <TableCell>Cidade / UF</TableCell>
              <TableCell>Situação</TableCell>
              <TableCell>Segmento</TableCell>
              <TableCell align="center">Oport.</TableCell>
              <TableCell>
                <CabecalhoOrdenavel campo="criado_em" rotulo="Cadastro" ordenar={ordenar} aoOrdenar={aoOrdenar} />
              </TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carregando && itens.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : itens.map((empresa) => (
                  <TableRow
                    key={empresa.id}
                    hover
                    onClick={() => navigate(`/empresas/${empresa.id}`)}
                    sx={{ cursor: 'pointer', opacity: carregando ? 0.5 : 1 }}
                  >
                    <TableCell sx={{ maxWidth: 280 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {empresa.nome_fantasia || empresa.razao_social}
                      </Typography>
                      {empresa.nome_fantasia && (
                        <Typography variant="caption" color="text.secondary" noWrap component="div">
                          {empresa.razao_social}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatarCnpj(empresa.cnpj)}</TableCell>
                    <TableCell>{[empresa.municipio, empresa.uf].filter(Boolean).join(' / ')}</TableCell>
                    <TableCell>
                      <SituacaoChip situacao={empresa.situacao_cadastral} />
                    </TableCell>
                    <TableCell>{empresa.segmento && <Chip size="small" label={empresa.segmento} />}</TableCell>
                    <TableCell align="center">{empresa.total_oportunidades}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {new Date(empresa.criado_em).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => aoEditar(empresa)}>
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Atualizar dados pela BrasilAPI">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => aoSincronizar(empresa)}
                            disabled={sincronizandoId === empresa.id}
                          >
                            <SyncRoundedIcon
                              fontSize="small"
                              sx={
                                sincronizandoId === empresa.id
                                  ? { animation: 'girar 1s linear infinite', '@keyframes girar': { to: { transform: 'rotate(-360deg)' } } }
                                  : undefined
                              }
                            />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton size="small" color="error" onClick={() => aoExcluir(empresa)}>
                          <DeleteRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <TablePagination
          component="div"
          count={pagina?.total ?? 0}
          page={Math.max((pagina?.pagina ?? 1) - 1, 0)}
          rowsPerPage={pagina?.tamanho ?? 10}
          rowsPerPageOptions={[5, 10, 25]}
          onPageChange={(_e, novaPagina) => aoMudarPagina(novaPagina + 1)}
          onRowsPerPageChange={(e) => aoMudarTamanho(Number(e.target.value))}
          labelRowsPerPage="Por página"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      </Box>
    </>
  );
}
