import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../users.services';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let mockUserModel: any;

  beforeEach(async () => {
    mockUserModel = {
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('findById', () => {
    it('should return a user if the user is found', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      mockUserModel.findById.mockResolvedValue(mockUser);

      const result = await service.findById('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      await expect(service.findById('non-existing-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateById', () => {
    it('should update and return the user', async () => {
      const updateUserDto = { email: 'updated@example.com' };  // Ensure this matches your DTO
      const mockUser = { id: '1', email: 'updated@example.com' };
      mockUserModel.findByIdAndUpdate.mockResolvedValue(mockUser);

      const result = await service.updateById('1', updateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw a NotFoundException if the user to update does not exist', async () => {
      mockUserModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(service.updateById('non-existing-id', { email: 'updated@example.com' }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteById', () => {
    it('should delete the user', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValue({});

      await service.deleteById('1');
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if the user to delete does not exist', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.deleteById('non-existing-id')).rejects.toThrow(NotFoundException);
    });
  });
});
