import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4f46e5' },
    secondary: { main: '#0ea5e9' },
    background: { default: '#f5f7fb', paper: '#ffffff' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { border: '1px solid #e5e7eb' } },
    },
    MuiAppBar: { styleOverrides: { root: { border: 'none' } } },
    MuiDrawer: { styleOverrides: { paper: { border: 'none' } } },
    MuiDialog: { styleOverrides: { paper: { border: 'none' } } },
    MuiMenu: { styleOverrides: { paper: { border: 'none' } } },
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});
