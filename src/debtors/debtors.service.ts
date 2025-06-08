import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Debtor } from './entities/debtor.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class DebtorsService {

  private readonly logger = new Logger('DebtorsService')

  constructor(
    @InjectRepository(Debtor)
    private readonly debtorRepository: Repository<Debtor>,
  ) {}



  async create(createDebtorDto: CreateDebtorDto, user: User) {
    try {
      const debtor = this.debtorRepository.create({
        ...createDebtorDto,
        user
      });
      
      const savedDebtor = await this.debtorRepository.save(debtor);

      // Respuesta limpia sin información sensible
      return {
        id: savedDebtor.id,
        name: savedDebtor.name,
        lastname: savedDebtor.lastname,
        phone: savedDebtor.phone,
        email: savedDebtor.email,
        userId: user.id,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all debtors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} debtor`;
  }

  update(id: number, updateDebtorDto: UpdateDebtorDto) {
    return `This action updates a #${id} debtor`;
  }

  remove(id: number) {
    return `This action removes a #${id} debtor`;
  }

  private handleExceptions(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail)
    
    this.logger.error(error)

    throw new InternalServerErrorException('Unexpected Error, check server logs')
  }
}
