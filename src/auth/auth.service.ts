import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcrypt'; // Import bcryptjs for password hashing
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  // Inject Redis client instance for session management
  private redisclient;
  private tokenExpiration: number;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.redisclient = this.redisService.getClient();
    this.tokenExpiration = this.configService.get<number>(
      'REDIS_TOKEN_EXPIRATION',
    );
  }

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password, role } = signUpDto;

    // check if the role is provided and is valid
    if (!Object.values(Role).includes(role)) {
      throw new BadRequestException('provided a valid role');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = this.jwtService.sign({ userId: user._id });

    try {
      await this.redisclient.set(
        `token:${user._id}`,
        token,
        'Ex',
        this.tokenExpiration,
      );
    } catch (error) {
      throw new InternalServerErrorException('Could not store token in Redis');
    }

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = this.jwtService.sign({ UserId: user.id });
    try {
      await this.redisclient.set(
        `token:${user._id}`,
        token,
        'Ex',
        this.tokenExpiration,
      );
    } catch (error) {
      throw new InternalServerErrorException('Could not store token in Redis');
    }
    return { token };
  }

  // async validateUser(payload: any): Promise<User> {
  //   const token = this.redisclient.get(`token:${payload.id}`);
  //   if (!token) {
  //     throw new UnauthorizedException('Session expired or invalid token');
  //   }
  //   const user = await this.userModel.findById(payload.id);
  //   return user;
  // }

  
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    return isPasswordMatched ? user : null;
  }


  async logout(userId: string): Promise<void> {
    await this.redisclient.del(`token:${userId}`);
  }


  
}
