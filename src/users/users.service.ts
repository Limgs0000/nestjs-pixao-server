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

  findOneUserById(user_id) {
    // return this.userModel.findOne({ "user_id": user_id}).exec();
    return '1';
  }
}
