import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model, ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { stringify } from 'ts-jest';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);

    return createdUser.save();
  }

  async findAllUser(): Promise<any> {
    const data = await this.userModel.find().exec();
    const resultData = {
      result: {
        resultCode: 'Y',
        resultMessage: 'api 호출 성공',
        content: data,
      },
    };

    return resultData;
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

  async createUserWithGoogle(token) {
    // console.log(token);
    const { name, picture, user_id, email } = token;

    // db에 해당 유저 있는지 체크
    const test = await this.userModel.findOne({
      email,
    });

    console.log(test);

    if (test !== null) {
      const resultData = {
        result: {
          resultCode: 'N',
          resultMessage: '이미 존재하는 이메일입니다.',
          content: test,
        },
      };

      return resultData;
    }

    const dto = {
      name,
      picture,
      user_id,
      email,
    };

    const createdUser = new this.userModel(dto);
    return createdUser.save();
  }

  async findOneUserById(userId: string) {
    try {
      console.log(userId);
      const preData = await this.userModel.findOne({ _id: userId });
      console.log(preData);
      const resultData = {
        result: {
          resultCode: 'Y',
          resultMessage: 'api 호출 성공',
          content: preData,
        },
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

      const isAlreadyFriendWithReqUserObjectId = await this.userModel.findOne(
        {
          _id: requestUserObjectId._id,
        },
        { friends: 1 },
      );

      console.log(isAlreadyFriendWithReqUserObjectId);

      // const data1 = await this.userModel.updateOne(
      //   {
      //     _id: requestUserObjectId,
      //   },
      //   {
      //     $push: {
      //       friends: {
      //         _id: receiveUserObjectId._id.toHexString(),
      //         createdAt: new Date(),
      //       },
      //     },
      //   },
      // );
      //
      // const data2 = await this.userModel.updateOne(
      //   {
      //     _id: receiveUserObjectId,
      //   },
      //   {
      //     $push: {
      //       friends: {
      //         _id: requestUserObjectId._id.toHexString(),
      //         createdAt: new Date(),
      //       },
      //     },
      //   },
      // );

      const result = {
        result: {
          resultCode: 'Y',
          resultMessage: '친구 추가 완료.',
        },
      };

      return result;
    } catch (err) {}
  }

  async getMyFriendsAll(userId) {
    try {
      const friendsList = await this.userModel.findById(userId, {
        friends: 1,
      });
      // console.log('friendsList', friendsList);
      const rtnArr = [];
      // let retFriendsList = friendsList.friends.map(async (elem) => {
      //   const data = await this.userModel.findById(elem['_id']);
      //   console.log(data);
      //   return data;
      // });

      const friendsArr = friendsList['friends'];

      console.log(friendsArr);

      // for (let i = 0; i < friendsArr.length; i++) {}

      for (const elem of friendsArr) {
        const data = await this.userModel.findById(elem['_id'], {
          _id: 1,
          name: 1,
          email: 1,
          picture: 1,
          comment: 1,
        });
        rtnArr.push(data);
      }

      // const result = {
      //   resultCode: 'Y',
      //   resultMessage: '모든 친구 조회 완료.',
      //   friends: rtnArr,
      // };

      const resultData = {
        result: {
          resultCode: 'Y',
          resultMessage: '모든 친구 조회 완료.',
          content: rtnArr,
        },
      };

      return resultData;
    } catch (e) {}
  }

  async addMyComment(userId: ObjectId, comment: string) {
    try {
      const addComment = await this.userModel.updateOne(
        { _id: userId },
        { comment },
        { upsert: true },
      );

      const result = {
        resultCode: 'Y',
        resultMessage: '커멘트 입력/업데이트 완료.',
      };

      return result;
    } catch (e) {}
  }

  async findMyCommentWithUserId(userId: string) {
    const userInfo = await this.userModel.findOne(
      {
        _id: userId,
      },
      {
        _id: 0,
        comment: 1,
      },
    );

    const result = {
      resultCode: 'Y',
      resultMessage: '커멘트 조회 완료.',
      content: {
        comment: userInfo.comment,
      },
    };

    return result;
  }
}
