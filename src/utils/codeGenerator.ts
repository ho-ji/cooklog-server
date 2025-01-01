import * as crypto from 'crypto';

export function codeGenerator(): string {
  const code = crypto.randomInt(0, 999999);
  return code.toString().padStart(6, '0');
}
