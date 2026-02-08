export type PasswordRuleId = 'minLength' | 'uppercase' | 'lowercase' | 'digit' | 'special';

export const PASSWORD_RULES = [
  { id: 'minLength', test: (v: string) => v.length >= 8, error: 'Мінімум 8 символів' },
  { id: 'uppercase', test: (v: string) => /[A-ZА-ЯІЇЄ]/.test(v), error: 'Принаймні одна велика літера' },
  { id: 'lowercase', test: (v: string) => /[a-zа-яіїє]/.test(v), error: 'Принаймні одна мала літера' },
  { id: 'digit', test: (v: string) => /\d/.test(v), error: 'Принаймні одна цифра' },
  { id: 'special', test: (v: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v), error: 'Принаймні один спеціальний символ' },
];

export function validatePassword(password: string) {
  const failedRule = PASSWORD_RULES.find(rule => !rule.test(password));
  return failedRule ? { valid: false, error: failedRule.error } : { valid: true };
}