import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Headers,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as jwt from 'jsonwebtoken';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('google-login')
  createUserWithGoogle(@Req() req) {
    return this.usersService.createUserWithGoogle(
      jwt.decode(req.headers['authorization']),
    );
  }

  @Patch(':userId')
  patchUserName(@Param() userId: string, @Body() name: string) {
    console.log(userId, name);
    console.log(typeof userId, typeof name);
    return this.usersService.patchUserName(userId, name);
  }

  @Get('all')
  findAllUser() {
    return this.usersService.findAllUser();
  }

  @Get()
  findOneUserById(@Query() user_id) {
    return this.usersService.findOneUserById(user_id);
  }

  @Post('updateFcmToken')
  createOrUpdateFcmToken(
    @Body('userKey') userKey: string,
    @Body('fcmToken') fcmToken: string,
  ) {
    console.log(userKey, fcmToken);
    return this.usersService.createOrUpdateFcmToken(userKey, fcmToken);
  }
}
