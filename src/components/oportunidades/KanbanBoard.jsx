import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Box, Chip, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import OportunidadeCard from './OportunidadeCard';
import { ETAPAS } from '../../constants/etapas';
import { formatarMoedaCompacta } from '../../utils/formatters';

export default function KanbanBoard({ oportunidades, aoMover, aoCriar, aoEditar, aoExcluir }) {
  const porEtapa = Object.fromEntries(ETAPAS.map((etapa) => [etapa.id, []]));
  oportunidades.forEach((oportunidade) => porEtapa[oportunidade.etapa]?.push(oportunidade));

  const soltar = ({ draggableId, source, destination }) => {
    if (!destination || destination.droppableId === source.droppableId) return;
    aoMover(Number(draggableId), destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={soltar}>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: { xs: '85%', sm: '300px' },
          gap: 2,
          overflowX: 'auto',
          pb: 2,
          alignItems: 'start',
        }}
      >
        {ETAPAS.map((etapa) => {
          const itens = porEtapa[etapa.id];
          const total = itens.reduce((soma, o) => soma + o.valor, 0);
          return (
            <Paper key={etapa.id} sx={{ bgcolor: '#eef1f6', p: 1.5, borderTop: `4px solid ${etapa.cor}` }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography fontWeight={700}>{etapa.label}</Typography>
                  <Chip size="small" label={itens.length} />
                </Stack>
                <Tooltip title={`Nova oportunidade em ${etapa.label}`}>
                  <IconButton size="small" onClick={() => aoCriar(etapa.id)}>
                    <AddRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {formatarMoedaCompacta(total)}
              </Typography>
              <Droppable droppableId={etapa.id}>
                {(provided, snapshot) => (
                  <Stack
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    spacing={1}
                    sx={{
                      mt: 1,
                      minHeight: 120,
                      borderRadius: 2,
                      p: 0.5,
                      transition: 'background-color .2s',
                      bgcolor: snapshot.isDraggingOver ? `${etapa.cor}22` : 'transparent',
                      outline: snapshot.isDraggingOver ? `2px dashed ${etapa.cor}` : 'none',
                    }}
                  >
                    {itens.map((oportunidade, indice) => (
                      <Draggable key={oportunidade.id} draggableId={String(oportunidade.id)} index={indice}>
                        {(providedItem, snapshotItem) => (
                          <Box ref={providedItem.innerRef} {...providedItem.draggableProps} {...providedItem.dragHandleProps}>
                            <OportunidadeCard
                              oportunidade={oportunidade}
                              cor={etapa.cor}
                              arrastando={snapshotItem.isDragging}
                              aoEditar={aoEditar}
                              aoExcluir={aoExcluir}
                            />
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Stack>
                )}
              </Droppable>
            </Paper>
          );
        })}
      </Box>
    </DragDropContext>
  );
}
