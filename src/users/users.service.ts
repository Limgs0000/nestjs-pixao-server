import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
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

  async findOneUserById(user_id) {
    try {
      const userId = {
        user_id,
      };

      const postData = JSON.stringify(userId);
      const preData = await this.userModel.findOne({ postData });
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
}
