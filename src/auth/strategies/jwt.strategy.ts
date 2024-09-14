import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../../users/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.userModel.findById(payload.userId);
      console.log('validating user:', user);
      if (!user) {
        throw new Error('Invalid token');
      }
      return user;
    } catch (error) {
      console.error('Error in JwtStrategy validate:', error);
      throw new Error('Please Login to access this endpoint...');
    }
  }
}
