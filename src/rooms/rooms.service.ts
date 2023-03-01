import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './schema/room.schema';
import { Model, ObjectId, Types } from 'mongoose';
import { User, UserDocument } from '../users/schema/user.schema';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createRoom(roomName: string, member_ids: string[]) {
    console.log(roomName, member_ids);

    const insertRoomInfo = await this.roomModel.create({
      room_name: roomName,
      members: member_ids,
    });

    console.log(insertRoomInfo);

    // const insertRoomIdInUserInfo = await this.userModel.updateOne(
    //   {
    //     _id: userId,
    //   },
    //   {
    //     $push: {
    //       rooms: insertRoomInfo._id,
    //     },
    //   },
    //   {
    //     upsert: true,
    //   },
    // );

    member_ids.forEach(async (elem) => {
      const insertRoomIdInUserInfo = await this.userModel.updateOne(
        {
          _id: elem,
        },
        {
          $push: {
            rooms: insertRoomInfo._id,
          },
        },
        {
          upsert: true,
        },
      );
    });
    const memberCount = insertRoomInfo.members.length;
    insertRoomInfo.member_count = memberCount;

    const resultData = {
      result: {
        resultCode: 'Y',
        resultMessage: 'api 호출 성공',
        content: insertRoomInfo,
      },
    };

    return resultData;
  }

  findAll() {
    return `This action returns all rooms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }

  async findAllRoomByUserId(userId: ObjectId): Promise<any> {
    console.log(userId);
    console.log(typeof userId);
    const findAllRoom = await this.roomModel.aggregate([
      {
        $match: {
          members: { $elemMatch: { $eq: userId } },
        },
      },
    ]);

    for (const elem of findAllRoom) {
      elem.member_count = elem.members.length;

      const opponentId = elem.members.filter((elem) => {
        if (elem !== userId) {
          return elem;
        }
      });

      const opponentImage = await this.userModel.find(
        { _id: opponentId },
        { _id: 0, name: 1, picture: 1 },
      );

      console.log(opponentImage[0].picture);
      elem.room_name = opponentImage[0].name;
      elem.room_image = opponentImage[0].picture;
    }

    // findAllRoom.forEach(async (elem) => {
    //   elem.member_count = elem.members.length;
    //
    //   const opponentId = elem.members.filter((elem) => {
    //     if (elem !== userId) {
    //       return elem;
    //     }
    //   });
    //
    //   const opponentImage = this.userModel.find(
    //     { _id: opponentId },
    //     { _id: 0, picture: 1 },
    //   );
    //
    //   console.log(opponentImage[0].picture);
    //
    //   console.log(elem.room_image);
    // });

    console.log(findAllRoom);

    // const findAllRoom = await this.userModel.find(
    //   {
    //     _id: userId,
    //   },
    //   {
    //     _id: 0,
    //     rooms: 1,
    //   },
    //   {
    //
    //   }
    // );

    // const findAllRoom = await this.userModel.aggregate([
    //   {
    //     $match: {
    //       _id: ,
    //     },
    //   },
    // ]);

    // for(let i = 0; i < findAllRoom.length; i++;) {
    //
    // }

    // console.log(findAllRoom);
    const resultData = {
      result: {
        resultCode: 'Y',
        resultMessage: 'api 호출 성공',
        content: findAllRoom,
      },
    };

    return resultData;
  }
}
