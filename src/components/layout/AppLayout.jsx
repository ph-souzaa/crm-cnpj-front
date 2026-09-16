import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';

const LARGURA_MENU = 240;

const ITENS_MENU = [
  { rota: '/', rotulo: 'Dashboard', icone: <DashboardRoundedIcon /> },
  { rota: '/empresas', rotulo: 'Empresas', icone: <BusinessRoundedIcon /> },
  { rota: '/funil', rotulo: 'Funil de vendas', icone: <ViewKanbanRoundedIcon /> },
];

function MenuLateral({ aoNavegar }) {
  const { pathname } = useLocation();

  return (
    <Box sx={{ height: '100%', bgcolor: '#111827', color: '#e5e7eb' }}>
      <Toolbar sx={{ gap: 1.5 }}>
        <HubRoundedIcon sx={{ color: '#818cf8' }} />
        <Box>
          <Typography variant="h6" lineHeight={1.1} color="#fff">
            CRM CNPJ
          </Typography>
          <Typography variant="caption" color="#9ca3af">
            Vendas B2B
          </Typography>
        </Box>
      </Toolbar>
      <List sx={{ px: 1.5 }}>
        {ITENS_MENU.map((item) => {
          const ativo = item.rota === '/' ? pathname === '/' : pathname.startsWith(item.rota);
          return (
            <ListItemButton
              key={item.rota}
              component={NavLink}
              to={item.rota}
              onClick={aoNavegar}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: ativo ? '#fff' : '#cbd5e1',
                bgcolor: ativo ? 'rgba(129, 140, 248, 0.22)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icone}</ListItemIcon>
              <ListItemText primary={item.rotulo} />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
        <Chip
          size="small"
          label="Dados cadastrais: BrasilAPI"
          sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#cbd5e1', width: '100%' }}
        />
      </Box>
    </Box>
  );
}

export default function AppLayout() {
  const theme = useTheme();
  const telaGrande = useMediaQuery(theme.breakpoints.up('md'));
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {telaGrande ? (
        <Drawer variant="permanent" sx={{ width: LARGURA_MENU, '& .MuiDrawer-paper': { width: LARGURA_MENU } }}>
          <MenuLateral />
        </Drawer>
      ) : (
        <>
          <AppBar position="fixed" sx={{ bgcolor: '#111827' }}>
            <Toolbar>
              <IconButton color="inherit" edge="start" onClick={() => setMenuAberto(true)} aria-label="Abrir menu">
                <MenuRoundedIcon />
              </IconButton>
              <Typography variant="h6" sx={{ ml: 1 }}>
                CRM CNPJ
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            open={menuAberto}
            onClose={() => setMenuAberto(false)}
            sx={{ '& .MuiDrawer-paper': { width: LARGURA_MENU } }}
          >
            <MenuLateral aoNavegar={() => setMenuAberto(false)} />
          </Drawer>
        </>
      )}
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, md: 4 }, mt: { xs: 7, md: 0 } }}>
        <Outlet />
      </Box>
    </Box>
  );
}
