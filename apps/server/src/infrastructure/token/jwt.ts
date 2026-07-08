import jwt from 'jsonwebtoken';
import { serverConfig } from '../../config/env.js';
import { AppError } from '../../shared/errors/app-error.js';
import { HttpStatus } from '../../constants/http.js';
import type { AuthenticatedUser } from '../../shared/types/authenticated-user.js';

type TokenType = 'access' | 'refresh';

type JwtPayload = {
  sub: string;
  email: string;
  role: AuthenticatedUser['role'];
  type: TokenType;
  jti?: string;
};

function parseDurationToSeconds(value: string) {
  const match = /^(\d+)([smhd])?$/.exec(value);

  if (!match) {
    throw new AppError('Invalid JWT expiration configuration', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  const amount = Number(match[1]);
  const unit = match[2] ?? 's';
  const multipliers = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
  } as const;

  return amount * multipliers[unit as keyof typeof multipliers];
}

export function getRefreshTokenExpiryDate() {
  const expiresInSeconds = parseDurationToSeconds(serverConfig.jwt.refreshExpiresIn);

  return new Date(Date.now() + expiresInSeconds * 1000);
}

export function signAccessToken(user: AuthenticatedUser) {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    type: 'access',
  };

  return jwt.sign(payload, serverConfig.jwt.accessSecret, {
    expiresIn: parseDurationToSeconds(serverConfig.jwt.accessExpiresIn),
  });
}

export function signRefreshToken(user: AuthenticatedUser, tokenId: string) {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    type: 'refresh',
    jti: tokenId,
  };

  return jwt.sign(payload, serverConfig.jwt.refreshSecret, {
    expiresIn: parseDurationToSeconds(serverConfig.jwt.refreshExpiresIn),
  });
}

export function verifyAccessToken(token: string): AuthenticatedUser {
  try {
    const payload = jwt.verify(token, serverConfig.jwt.accessSecret) as JwtPayload;

    if (payload.type !== 'access') {
      throw new AppError('Invalid token type', HttpStatus.UNAUTHORIZED);
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError('Invalid or expired access token', HttpStatus.UNAUTHORIZED);
  }
}
