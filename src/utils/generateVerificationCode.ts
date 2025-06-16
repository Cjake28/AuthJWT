import { randomInt } from 'crypto';

export function generateVerificationCode(): string {
  // randomInt(0, 1_000_000) returns an integer in [0, 999999]
  const code = randomInt(0, 1_000_000);
  // pad with leading zeros to always be 6 digits
  return code.toString().padStart(6, '0');
}
