import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = HydratedDocument<User>;

const option: SchemaOptions = {
  timestamps: true,
  versionKey: false,
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

  @Prop({
    require: true,
  })
  fcm_user_token: string;

  @Prop({
    require: true,
    // type: mongoose.Schema.Types.ObjectId,
  })
  friends: string[];

  // @Prop({
  //   type: {
  //     _id: {
  //       required: true,
  //       type: mongoose.Schema.Types.ObjectId,
  //     },
  //     createdAt: { required: true },
  //   },
  // })
  // friends: Array<any>;
}

export const UserSchema = SchemaFactory.createForClass(User);
