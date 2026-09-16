import { describe, expect, it } from 'vitest';
import { formatarData, formatarMoeda, formatarTelefone } from './formatters';

describe('formatters', () => {
  it('formata moeda em reais', () => {
    expect(formatarMoeda(1500)).toContain('1.500,00');
    expect(formatarMoeda(null)).toContain('0,00');
  });

  it('formata data ISO', () => {
    expect(formatarData('2026-09-16')).toBe('16/09/2026');
    expect(formatarData(null)).toBe('—');
  });

  it('formata telefone com DDD', () => {
    expect(formatarTelefone('1133334444')).toBe('(11) 3333-4444');
    expect(formatarTelefone('11987654321')).toBe('(11) 98765-4321');
    expect(formatarTelefone(null)).toBe('—');
  });
});
