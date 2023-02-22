import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model, ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);

    return createdUser.save();
  }

  async findAllUser(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // async createUserWithGoogleAuth(token): Promise<User> {
  //   if (token === null) {
  //     return '토큰없음';
  //   }
  //
  //
  //
  //   const createdUser = new this.userModel();
  //
  //   return '';
  // }
  // test(token) {
  //   console.log(token);
  //   const { name, picture, user_id, email  } = token;
  //
  //   return email;
  // }

  createUserWithGoogle(token) {
    console.log(token);
    const { name, picture, user_id, email } = token;

    const dto = {
      name,
      picture,
      user_id,
      email,
    };

    const createdUser = new this.userModel(dto);
    return createdUser.save();
  }

  async findOneUserById(_id: ObjectId) {
    try {
      const preData = await this.userModel.findById(_id);
      console.log(preData);
      const resultData = {
        result: {
          resultCode: 'Y',
          resultMessage: 'api 호출 성공',
        },
        content: preData,
      };
      return resultData;
    } catch (e) {
      console.log(e);
      return { err: e.message };
    }
  }

  async patchUserName(userId, userName) {
    try {
      // console.log(userId.userId, userName);
      const user_id = JSON.stringify(userId);
      const name = JSON.stringify(userName);

      console.log(user_id, name);
      const data = await this.userModel.updateOne(
        { user_id: user_id },
        { name: name },
      );
      const resultData = {
        result: {
          resultCode: 'Y',
          resultMessage: 'api 호출 성공',
        },
        content: data,
      };
      return resultData;
    } catch (e) {
      console.log(e);
      return { err: e.message };
    }
  }

  async createOrUpdateFcmToken(userKey: string, fcmToken: string) {
    try {
      const data_user_id = userKey;
      const token = fcmToken;
      const data = await this.userModel.updateOne(
        {
          user_id: data_user_id,
        },
        {
          fcm_user_token: token,
        },
        {
          upsert: true,
        },
      );

      const resultData = {
        result: {
          resultCode: 'Y',
          resultMessage: 'api 호출 성공',
        },
        content: data,
      };
      return resultData;
    } catch (e) {
      return { err: e.message };
    }
  }

  async addFriend(requestUserEmail: string, receiveUserEmail: string) {
    try {
      const requestUserObjectId = await this.userModel.findOne(
        {
          email: requestUserEmail,
        },
        {
          _id: 1,
        },
      );
      if (requestUserObjectId == null) {
        const result = {
          result: {
            resultCode: 'N',
            resultMessage: '잘못된 요청자 이메일 입니다.',
          },
        };

        return result;
      }

      const receiveUserObjectId = await this.userModel.findOne(
        {
          email: receiveUserEmail,
        },
        {
          _id: 1,
        },
      );
      if (receiveUserObjectId === null) {
        const result = {
          result: {
            resultCode: 'N',
            resultMessage: '잘못된 수신자 이메일 입니다.',
          },
        };

        return result;
      }

      const data1 = await this.userModel.updateOne(
        {
          _id: requestUserObjectId,
        },
        {
          $push: {
            friends: {
              _id: receiveUserObjectId._id.toHexString(),
              createdAt: new Date(),
            },
          },
        },
      );

      const data2 = await this.userModel.updateOne(
        {
          _id: receiveUserObjectId,
        },
        {
          $push: {
            friends: {
              _id: requestUserObjectId._id.toHexString(),
              createdAt: new Date(),
            },
          },
        },
      );

      const result = {
        result: {
          resultCode: 'Y',
          resultMessage: '친구 추가 완료.',
        },
      };

      return result;
    } catch (err) {}
  }
}
