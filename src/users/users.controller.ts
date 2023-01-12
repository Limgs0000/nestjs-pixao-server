import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('test')
  test(@Req() req) {
    console.log(req);
    return '콘솔확인 ㄱ';
  }

  @Get()
  findAllUser() {
    return this.usersService.findAllUser();
  }

  @Get()
  findOneUserById(id: number) {
    return `This action returns a #${id} user`;
  }
}
