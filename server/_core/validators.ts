/**
 * 🔒 Validators - Funções de validação de documentos brasileiros
 */

/**
 * Valida um CPF brasileiro
 * @param cpf - CPF com ou sem formatação
 * @returns true se o CPF é válido, false caso contrário
 */
export function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Calcula o primeiro dígito verificador
  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  // Calcula o segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

/**
 * Valida um RG brasileiro (formato básico)
 * @param rg - RG com ou sem formatação
 * @returns true se o RG tem formato válido, false caso contrário
 */
export function validateRG(rg: string): boolean {
  // Remove caracteres não numéricos
  rg = rg.replace(/\D/g, '');

  // Verifica se tem entre 7 e 9 dígitos
  return rg.length >= 7 && rg.length <= 9;
}

/**
 * Valida um telefone brasileiro
 * @param phone - Telefone com ou sem formatação
 * @returns true se o telefone tem formato válido, false caso contrário
 */
export function validatePhone(phone: string): boolean {
  // Remove caracteres não numéricos
  phone = phone.replace(/\D/g, '');

  // Verifica se tem 10 ou 11 dígitos (celular ou fixo)
  return phone.length === 10 || phone.length === 11;
}

/**
 * Valida um email
 * @param email - Email a validar
 * @returns true se o email tem formato válido, false caso contrário
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Formata um CPF para o padrão XXX.XXX.XXX-XX
 * @param cpf - CPF sem formatação
 * @returns CPF formatado
 */
export function formatCPF(cpf: string): string {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11) return cpf;
  return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9)}`;
}

/**
 * Formata um telefone para o padrão (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 * @param phone - Telefone sem formatação
 * @returns Telefone formatado
 */
export function formatPhone(phone: string): string {
  phone = phone.replace(/\D/g, '');
  if (phone.length === 11) {
    return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
  } else if (phone.length === 10) {
    return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
  }
  return phone;
}

/**
 * Sanitiza uma string removendo caracteres perigosos
 * @param str - String a sanitizar
 * @returns String sanitizada
 */
export function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Valida uma data no formato DD/MM/YYYY
 * @param date - Data a validar
 * @returns true se a data é válida, false caso contrário
 */
export function validateDate(date: string): boolean {
  const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = date.match(dateRegex);

  if (!match) return false;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  // Verifica se o mês é válido
  if (month < 1 || month > 12) return false;

  // Verifica se o dia é válido
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Verifica se é ano bissexto
  if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
    daysInMonth[1] = 29;
  }

  if (day < 1 || day > daysInMonth[month - 1]) return false;

  // Verifica se a data não é no futuro
  const today = new Date();
  const inputDate = new Date(year, month - 1, day);
  if (inputDate > today) return false;

  return true;
}
