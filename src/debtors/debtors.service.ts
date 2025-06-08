import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateDebtorDto } from './dtos/create-debtor.dto';
import { UpdateDebtorDto } from './dtos/update-debtor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Debtor } from './entities/debtor.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

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

    async findAllByUser(paginationDto: PaginationDto, user: User) {

      const {limit = 2, offset = 0} = paginationDto

      const debtors = await this.debtorRepository.find({
      where: {
        user: { id: user.id } // Filtra por ID de usuario
      },
      relations: ['user'], // Opcional: incluye los datos del usuario
      take: limit,
      skip: offset,
      order: {
        name: 'ASC' // Orden opcional
      }
    });

    return debtors.map(debtor => {
      // Opcional: transforma la respuesta para eliminar datos sensibles
      const { user, ...debtorData } = debtor;
      return {
        ...debtorData,
      };
    });
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
