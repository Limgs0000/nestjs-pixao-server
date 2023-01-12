import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  // constructor(private readonly userService: UsersService) {}
  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    const data = {
      name: req.user.name,
      email: req.user.email,
      password: '1234',
    };

    // this.userService.createUser(data);

    return {
      message: 'User Info from Google!',
      user: req.user,
    };
  }
}
