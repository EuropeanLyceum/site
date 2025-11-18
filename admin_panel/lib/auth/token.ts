import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: number;
  username: string;
  role: string;
}

let cachedSecret: string | null = null;

export function getJWTSecret(): string {
  if (cachedSecret) {
    return cachedSecret;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET не встановлено в змінних оточення. Додайте JWT_SECRET в файл env.local');
  }

  cachedSecret = secret;
  return cachedSecret;
}

export function createToken(payload: JWTPayload): string {
  const secret = getJWTSecret();
  return jwt.sign(payload, secret, { expiresIn: '24h' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = getJWTSecret();
    const decoded = jwt.verify(token, secret);
    return decoded as JWTPayload;
  } catch {
    return null;
  }
}

