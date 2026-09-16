import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notificacao, setNotificacao] = useState(null);

  const notificar = useCallback((mensagem, severidade = 'success') => {
    setNotificacao({ mensagem, severidade, chave: Date.now() });
  }, []);

  const valor = useMemo(
    () => ({
      sucesso: (mensagem) => notificar(mensagem, 'success'),
      erro: (mensagem) => notificar(mensagem, 'error'),
      info: (mensagem) => notificar(mensagem, 'info'),
    }),
    [notificar],
  );

  const fechar = (_evento, motivo) => {
    if (motivo !== 'clickaway') setNotificacao(null);
  };

  return (
    <NotificationContext.Provider value={valor}>
      {children}
      <Snackbar
        key={notificacao?.chave}
        open={Boolean(notificacao)}
        autoHideDuration={4500}
        onClose={fechar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {notificacao ? (
          <Alert onClose={fechar} severity={notificacao.severidade} variant="filled" sx={{ width: '100%' }}>
            {notificacao.mensagem}
          </Alert>
        ) : undefined}
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotificacao() {
  const contexto = useContext(NotificationContext);
  if (!contexto) throw new Error('useNotificacao deve ser usado dentro de NotificationProvider');
  return contexto;
}
