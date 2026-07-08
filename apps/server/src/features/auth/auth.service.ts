import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import { HttpStatus } from '../../constants/http.js';
import {
  getRefreshTokenExpiryDate,
  signAccessToken,
  signRefreshToken,
} from '../../infrastructure/token/jwt.js';
import { hashToken } from '../../infrastructure/token/token-hash.js';
import { AppError } from '../../shared/errors/app-error.js';
import type { AuthenticatedUser } from '../../shared/types/authenticated-user.js';
import { toPublicUserDto } from '../users/users.mapper.js';
import { usersRepository } from '../users/users.repository.js';
import { authRepository } from './auth.repository.js';
import type { LoginInput, LogoutInput, RegisterInput } from './auth.schemas.js';

const SALT_ROUNDS = 12;

type SessionMetadata = {
  userAgent?: string;
  ipAddress?: string;
};

async function createSession(user: AuthenticatedUser, metadata: SessionMetadata) {
  const refreshTokenId = randomUUID();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, refreshTokenId);

  await authRepository.createRefreshToken({
    id: refreshTokenId,
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: getRefreshTokenExpiryDate(),
    userAgent: metadata.userAgent,
    ipAddress: metadata.ipAddress,
  });

  return {
    accessToken,
    refreshToken,
  };
}

export const authService = {
  async register(input: RegisterInput, metadata: SessionMetadata) {
    const existingUser = await usersRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError('Email is already registered', HttpStatus.CONFLICT);
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await usersRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      role: user.role.name,
    };

    const tokens = await createSession(authenticatedUser, metadata);

    return {
      user: toPublicUserDto(user),
      tokens,
    };
  },

  async login(input: LoginInput, metadata: SessionMetadata) {
    const user = await usersRepository.findByEmail(input.email);

    if (!user || !user.isActive) {
      throw new AppError('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    const updatedUser = await usersRepository.updateLastLoginAt(user.id);
    const authenticatedUser: AuthenticatedUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role.name,
    };

    const tokens = await createSession(authenticatedUser, metadata);

    return {
      user: toPublicUserDto(updatedUser),
      tokens,
    };
  },

  async logout(input: LogoutInput) {
    const tokenHash = hashToken(input.refreshToken);
    const refreshToken = await authRepository.findRefreshTokenByHash(tokenHash);

    if (!refreshToken || refreshToken.revokedAt) {
      return;
    }

    await authRepository.revokeRefreshToken(refreshToken.id);
  },

  async getCurrentUser(userId: string) {
    const user = await usersRepository.findById(userId);

    if (!user || !user.isActive) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }

    return toPublicUserDto(user);
  },
};
