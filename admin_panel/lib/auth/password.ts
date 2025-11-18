export type PasswordRuleId =
  | 'minLength'
  | 'uppercase'
  | 'lowercase'
  | 'digit'
  | 'special';

export type PasswordRule = {
  id: PasswordRuleId;
  test: (value: string) => boolean;
  description: string;
  error: string;
};

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: 'minLength',
    test: value => value.length >= 8,
    description: 'Мінімум 8 символів',
    error: 'Пароль повинен містити мінімум 8 символів',
  },
  {
    id: 'uppercase',
    test: value => /[A-ZА-ЯІЇЄ]/.test(value),
    description: 'Принаймні одна велика літера (A-Z, А-Я)',
    error: 'Пароль повинен містити принаймні одну велику літеру',
  },
  {
    id: 'lowercase',
    test: value => /[a-zа-яіїє]/.test(value),
    description: 'Принаймні одна мала літера (a-z, а-я)',
    error: 'Пароль повинен містити принаймні одну малу літеру',
  },
  {
    id: 'digit',
    test: value => /\d/.test(value),
    description: 'Принаймні одна цифра (0-9)',
    error: 'Пароль повинен містити принаймні одну цифру',
  },
  {
    id: 'special',
    test: value => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
    description: 'Принаймні один спеціальний символ (!@#$%^&*()_+-=[]{}|;:,.<>?)',
    error: 'Пароль повинен містити принаймні один спеціальний символ (!@#$%^&*()_+-=[]{}|;:,.<>?)',
  },
];

export type PasswordValidationResult =
  | { valid: true }
  | { valid: false; failedRule: PasswordRule; error: string };

export function validatePassword(password: string): PasswordValidationResult {
  const failedRule = PASSWORD_RULES.find(rule => !rule.test(password));

  if (!failedRule) {
    return { valid: true };
  }

  return {
    valid: false,
    failedRule,
    error: failedRule.error,
  };
}

export const PASSWORD_REQUIREMENTS = PASSWORD_RULES.map(rule => rule.description);

