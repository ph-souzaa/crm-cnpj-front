import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Paper, Skeleton, Typography } from '@mui/material';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import PercentRoundedIcon from '@mui/icons-material/PercentRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import KpiCard from '../components/common/KpiCard';
import PageHeader from '../components/common/PageHeader';
import EmptyState from '../components/common/EmptyState';
import { ETAPAS_POR_ID } from '../constants/etapas';
import { dashboardService } from '../services/dashboardService';
import { formatarMoeda, formatarMoedaCompacta } from '../utils/formatters';

const CORES_UF = ['#4f46e5', '#0ea5e9', '#16a34a', '#f59e0b', '#db2777', '#64748b'];

function agruparUfs(porUf) {
  const principais = porUf.slice(0, 5);
  const outras = porUf.slice(5).reduce((soma, item) => soma + item.quantidade, 0);
  return outras ? [...principais, { uf: 'Outras', quantidade: outras }] : principais;
}

function Grafico({ titulo, subtitulo, carregando, vazio, children }) {
  return (
    <Paper sx={{ p: 2.5, height: 380, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6">{titulo}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {subtitulo}
      </Typography>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        {carregando ? (
          <Skeleton variant="rounded" height="100%" />
        ) : vazio ? (
          <EmptyState titulo="Sem dados ainda" icone={<InsightsRoundedIcon fontSize="inherit" />} />
        ) : (
          children
        )}
      </Box>
    </Paper>
  );
}

export default function DashboardPage() {
  const [resumo, setResumo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      setResumo(await dashboardService.resumo());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const dadosEtapas = (resumo?.por_etapa ?? []).map((item) => ({
    ...item,
    nome: ETAPAS_POR_ID[item.etapa].label,
    cor: ETAPAS_POR_ID[item.etapa].cor,
  }));
  const dadosUf = agruparUfs(resumo?.por_uf ?? []);
  const semOportunidades = !resumo?.total_oportunidades;

  return (
    <>
      <PageHeader
        titulo="Dashboard"
        subtitulo="Visão geral da carteira de clientes e do funil de vendas"
        acoes={
          <Button variant="contained" component={RouterLink} to="/empresas">
            Cadastrar empresa
          </Button>
        }
      />

      {erro && (
        <Alert severity="error" sx={{ mb: 3 }} action={<Button color="inherit" onClick={carregar}>Tentar de novo</Button>}>
          {erro}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, mb: 3 }}>
        <KpiCard
          titulo="Empresas na carteira"
          valor={resumo?.total_empresas ?? 0}
          descricao={`${resumo?.total_oportunidades ?? 0} ${resumo?.total_oportunidades === 1 ? 'oportunidade' : 'oportunidades'}`}
          icone={<BusinessRoundedIcon />}
          carregando={carregando}
        />
        <KpiCard
          titulo="Pipeline em aberto"
          valor={formatarMoeda(resumo?.valor_pipeline)}
          descricao="Prospecção até negociação"
          icone={<TrendingUpRoundedIcon />}
          cor="#0ea5e9"
          carregando={carregando}
        />
        <KpiCard
          titulo="Vendas ganhas"
          valor={formatarMoeda(resumo?.valor_ganho)}
          icone={<EmojiEventsRoundedIcon />}
          cor="#16a34a"
          carregando={carregando}
        />
        <KpiCard
          titulo="Taxa de conversão"
          valor={`${(resumo?.taxa_conversao ?? 0).toLocaleString('pt-BR')}%`}
          descricao="Ganhas ÷ fechadas"
          icone={<PercentRoundedIcon />}
          cor="#f59e0b"
          carregando={carregando}
        />
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' } }}>
        <Grafico
          titulo="Valor por etapa do funil"
          subtitulo="Soma dos valores das oportunidades em cada etapa"
          carregando={carregando}
          vazio={semOportunidades}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosEtapas} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatarMoedaCompacta} tick={{ fontSize: 12 }} width={80} />
              <Tooltip
                formatter={(valor, _nome, item) => [`${formatarMoeda(valor)} (${item.payload.quantidade} oport.)`, 'Valor']}
                cursor={{ fill: 'rgba(79,70,229,0.06)' }}
              />
              <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                {dadosEtapas.map((item) => (
                  <Cell key={item.etapa} fill={item.cor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Grafico>

        <Grafico
          titulo="Empresas por estado"
          subtitulo="Distribuição geográfica (dados da BrasilAPI)"
          carregando={carregando}
          vazio={dadosUf.length === 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* A animação inicial do Pie (Recharts 2.15) não chega a desenhar os setores */}
              <Pie
                data={dadosUf}
                dataKey="quantidade"
                nameKey="uf"
                innerRadius="50%"
                outerRadius="80%"
                paddingAngle={3}
                isAnimationActive={false}
              >
                {dadosUf.map((item, indice) => (
                  <Cell key={item.uf} fill={CORES_UF[indice % CORES_UF.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(valor) => [`${valor} empresa(s)`, 'Total']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Grafico>
      </Box>
    </>
  );
}
