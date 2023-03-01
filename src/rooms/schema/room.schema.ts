import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';

export type RoomDocument = HydratedDocument<Room>;

const option: SchemaOptions = {
  timestamps: true,
  versionKey: false,
};

@Schema(option)
export class Room {
  @Prop()
  room_name: string;

  @Prop({
    require: true,
  })
  members: string[];

  @Prop({
    require: true,
  })
  chats: object[];

  @Prop()
  member_count: number;

  @Prop()
  opponentImage: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
