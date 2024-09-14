import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { Role } from '../../auth/enums/role.enum';


@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: [{ type: String, enum: Role }], required: true })
  role: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
