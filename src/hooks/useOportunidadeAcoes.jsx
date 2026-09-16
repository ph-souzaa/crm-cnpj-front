import { useState } from 'react';
import ConfirmDialog from '../components/common/ConfirmDialog';
import OportunidadeFormDialog from '../components/oportunidades/OportunidadeFormDialog';
import { useNotificacao } from '../contexts/NotificationContext';
import { oportunidadesService } from '../services/oportunidadesService';

/**
 * Centraliza criar/editar/excluir oportunidades (diálogos + chamadas à API),
 * usado pelo Funil e pelo detalhe da empresa.
 */
export function useOportunidadeAcoes({ empresaFixa, aoAlterar }) {
  const notificar = useNotificacao();
  const [formulario, setFormulario] = useState({ aberto: false, oportunidade: null, etapaInicial: null });
  const [paraExcluir, setParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  const criar = (etapaInicial = null) => setFormulario({ aberto: true, oportunidade: null, etapaInicial });
  const editar = (oportunidade) => setFormulario({ aberto: true, oportunidade, etapaInicial: null });
  const fecharFormulario = () => setFormulario((atual) => ({ ...atual, aberto: false }));

  const aoSalvar = (_salva, editando) => {
    fecharFormulario();
    notificar.sucesso(editando ? 'Oportunidade atualizada.' : 'Oportunidade criada.');
    aoAlterar();
  };

  const confirmarExclusao = async () => {
    setExcluindo(true);
    try {
      await oportunidadesService.excluir(paraExcluir.id);
      notificar.sucesso('Oportunidade excluída.');
      setParaExcluir(null);
      aoAlterar();
    } catch (e) {
      notificar.erro(e.message);
    } finally {
      setExcluindo(false);
    }
  };

  const dialogos = (
    <>
      <OportunidadeFormDialog
        aberto={formulario.aberto}
        oportunidade={formulario.oportunidade}
        etapaInicial={formulario.etapaInicial}
        empresaFixa={empresaFixa}
        aoFechar={fecharFormulario}
        aoSalvar={aoSalvar}
      />
      <ConfirmDialog
        aberto={Boolean(paraExcluir)}
        titulo="Excluir oportunidade"
        mensagem={`Deseja excluir "${paraExcluir?.titulo}"? Esta ação não pode ser desfeita.`}
        carregando={excluindo}
        aoConfirmar={confirmarExclusao}
        aoFechar={() => setParaExcluir(null)}
      />
    </>
  );

  return { criar, editar, excluir: setParaExcluir, dialogos };
}
