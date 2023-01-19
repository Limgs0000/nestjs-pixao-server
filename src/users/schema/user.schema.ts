import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

const option: SchemaOptions = {
  timestamps: true,
  // typeKey: '$type',
};

@Schema(option)
export class User {
  @Prop()
  user_id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  picture: string;

  @Prop()
  fcm_user_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
