import { HttpStatus } from '../../constants/http.js';
import { AppError } from '../../shared/errors/app-error.js';
import { toPublicUserDto } from './users.mapper.js';
import { usersRepository } from './users.repository.js';

export const usersService = {
  async getCurrentUser(userId: string) {
    const user = await usersRepository.findById(userId);

    if (!user || !user.isActive) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }

    return toPublicUserDto(user);
  },
};
