import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password);
    let user = await this.userModel.create({
      email: createUserDto.email,
      password: hashPassword,
      name: createUserDto.name,
    });
    return user;
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(id: string) {
    try {
      let user = await this.userModel.findOne({
        _id: id,
      });
      return user;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findOneByUsername(username: string) {
    try {
      let user = await this.userModel.findOne({
        email: username,
      });
      return user;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto) {
    // check user
    let user = await this.findOne(updateUserDto.id);
    // update user
    await this.userModel.updateOne(
      {
        _id: updateUserDto.id,
      },
      { ...updateUserDto },
    );
    // get user after updated
    user = await this.userModel.findOne({ _id: updateUserDto.id });
    return user;
  }

  async remove(id: string) {
    // check user
    let user = await this.findOne(id);
    // delete user
    let result = await this.userModel.deleteOne({
      _id: id,
    });
    throw new HttpException('Success', HttpStatus.OK);
  }
}
