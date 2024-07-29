import { LoginUserDto } from './dto/login-user.dto';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  @Inject(DbService)
  dbService: DbService;

  async register(registerUserDto: RegisterUserDto) {
    const users: User[] = await this.dbService.read();

    const foundUser = users.find(
      (item) => item.username === registerUserDto.username,
    );

    if (foundUser) {
      throw new BadRequestException('User already exists');
    }

    const user = new User();
    user.username = registerUserDto.username;
    user.password = registerUserDto.password;
    users.push(user);
    await this.dbService.write(users);
    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const users: User[] = await this.dbService.read();

    const foundUser = users.find(
      (item) => item.username === loginUserDto.username,
    );

    if (!foundUser) {
      throw new BadRequestException('User not found');
    }

    if (foundUser.password !== loginUserDto.password) {
      throw new BadRequestException('Wrong password');
    }

    return foundUser;
  }
}
