import { describe, expect, it } from 'vitest';
import { formatarCnpj, limparCnpj, validarCnpj } from './cnpj';

describe('cnpj', () => {
  it('remove a máscara', () => {
    expect(limparCnpj('11.222.333/0001-81')).toBe('11222333000181');
  });

  it('aplica a máscara progressivamente', () => {
    expect(formatarCnpj('11222333000181')).toBe('11.222.333/0001-81');
    expect(formatarCnpj('11222')).toBe('11.222');
    expect(formatarCnpj('112223330001819999')).toBe('11.222.333/0001-81');
  });

  it('valida os dígitos verificadores', () => {
    expect(validarCnpj('11.222.333/0001-81')).toBe(true);
    expect(validarCnpj('19131243000197')).toBe(true);
    expect(validarCnpj('11222333000182')).toBe(false);
    expect(validarCnpj('11111111111111')).toBe(false);
    expect(validarCnpj('123')).toBe(false);
  });
});
