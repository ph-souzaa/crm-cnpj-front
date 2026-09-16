const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

function extrairMensagem(corpo, status) {
  if (!corpo) return `Erro ${status} ao comunicar com a API.`;
  if (typeof corpo.detail === 'string') return corpo.detail;
  if (Array.isArray(corpo.detail)) {
    return corpo.detail.map((erro) => erro.msg?.replace(/^Value error, /, '')).join(' ');
  }
  return `Erro ${status} ao comunicar com a API.`;
}

export async function request(caminho, { method = 'GET', params, body } = {}) {
  const query = params
    ? `?${new URLSearchParams(
        Object.entries(params).filter(([, valor]) => valor !== undefined && valor !== null && valor !== ''),
      )}`
    : '';

  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}${query}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se ela está em execução.');
  }

  if (resposta.status === 204) return null;
  const corpo = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    const erro = new Error(extrairMensagem(corpo, resposta.status));
    erro.status = resposta.status;
    throw erro;
  }
  return corpo;
}
