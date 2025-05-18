import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { log } from 'console';
import { LoginUserDto } from './dto/login-user.dto';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {

  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10)
      });

      await this.userRepository.save( user )
      delete user.password

      return {
        ...user,
      };

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login( loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {email},
      select: {email: true, password: true, id: true, name: true, lastname: true}
      
    });
    if (!user) 
      throw new UnauthorizedException('Invalid Credentials (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Invalid Credentials (password)');

    delete user.password;
    return {
      ...user,
    };
  }

  private handleDBErrors( error: any ): never {
    if ( error.code === '23505')
      throw new BadRequestException( error.detail);
    log(error);
    throw new InternalServerErrorException('Revisar server logs');
  }
}
