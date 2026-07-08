import type { RoleName } from '@prisma/client';
import { prisma } from '../../infrastructure/database/prisma.js';

const userInclude = {
  role: {
    select: {
      name: true,
    },
  },
} as const;

export const usersRepository = {
  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: userInclude,
    });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: userInclude,
    });
  },

  async create(input: { name: string; email: string; passwordHash: string; role: RoleName }) {
    const role = await prisma.role.upsert({
      where: { name: input.role },
      update: {},
      create: {
        name: input.role,
      },
    });

    return prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash,
        roleId: role.id,
      },
      include: userInclude,
    });
  },

  updateLastLoginAt(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        lastLoginAt: new Date(),
      },
      include: userInclude,
    });
  },
};
