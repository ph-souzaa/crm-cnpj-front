const PESOS_PRIMEIRO_DV = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_SEGUNDO_DV = [6, ...PESOS_PRIMEIRO_DV];

export function limparCnpj(valor = '') {
  return String(valor).replace(/\D/g, '');
}

export function formatarCnpj(valor = '') {
  const digitos = limparCnpj(valor).slice(0, 14);
  return digitos
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function calcularDigito(base, pesos) {
  const resto = base.split('').reduce((soma, d, i) => soma + Number(d) * pesos[i], 0) % 11;
  return resto < 2 ? '0' : String(11 - resto);
}

export function validarCnpj(valor = '') {
  const cnpj = limparCnpj(valor);
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  const primeiro = calcularDigito(cnpj.slice(0, 12), PESOS_PRIMEIRO_DV);
  const segundo = calcularDigito(cnpj.slice(0, 12) + primeiro, PESOS_SEGUNDO_DV);
  return cnpj.slice(-2) === primeiro + segundo;
}
