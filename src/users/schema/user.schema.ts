import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

const option: SchemaOptions = {
  timestamps: true,
  // typeKey: '$type',
};

@Schema(option)
export class User extends Document {
  @Prop()
  user_id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  picture: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
