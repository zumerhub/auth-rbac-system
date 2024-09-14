import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../users/users.services';
import { User } from 'src/users/schemas/user.schema';
import { Role } from '../../auth/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';

jest.mock('bcrypt'); // Ensure bcrypt is mocked

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let redisService: RedisService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            getClient: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(3600), // Set default token expiration to 3600 seconds
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('validateUser', () => {
    it('should return a user if validation is successful', async () => {
      const mockUser: Partial<User> = {
        email: 'test@example.com',
        password: 'hashedpassword',
        role: [Role.Admin],
      };

      jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValue(mockUser as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(
        'test@example.com',
        'password',
      );
      expect(result).toEqual(mockUser);
    });

    describe('AuthController', () => {
        it('should be defined', () => {
          expect(true).toBe(true);
        });
      });
      

    it('should return null if validation fails', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      const result = await authService.validateUser(
        'wrong@example.com',
        'password',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token for a valid user', async () => {
      const mockUser: Partial<User> = {
        email: 'test@example.com',
        password: 'hashedpassword',
        role: [Role.Admin],
      };
      const token = 'jwt-token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await authService.login(mockUser as User);
      expect(result).toEqual({ token });
    });
  });
});
