import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateDebtorDto } from './dtos/create-debtor.dto';
import { UpdateDebtorDto } from './dtos/update-debtor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Debtor } from './entities/debtor.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Debt } from 'src/debts/entities/debt.entity';

@Injectable()
export class DebtorsService {

  private readonly logger = new Logger('DebtorsService')

  constructor(
    @InjectRepository(Debtor)
    private readonly debtorRepository: Repository<Debtor>,
  ) {}


  async findAllByUser(paginationDto: PaginationDto, user: User) {

    const {limit = 10, offset = 0} = paginationDto

    try {     
      const debtors = await this.debtorRepository.find({
        where: {
          user: { id: user.id }, // Filtra por ID de usuario
        },
        relations: ['debts'], // Carga las deudas relacionadas
        take: limit,
        skip: offset,
        order: {
          name: 'ASC' // Orden opcional
        }
      });

      return debtors.map(({ debts, user, ...debtorData }) => {
        const totalMount = debts
        ?.filter(debt => !debt.paid)        // solo deudas no pagadas
        .reduce((sum, debt) => sum + debt.mount, 0) ?? 0;

        return {
          ...debtorData,
          mount: totalMount,
        };
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} debtor`;
  // }

  // update(id: number, updateDebtorDto: UpdateDebtorDto) {
  //   return `This action updates a #${id} debtor`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} debtor`;
  // }

  private handleExceptions(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail)
    
    this.logger.error(error)

    throw new InternalServerErrorException('Unexpected Error, check server logs')
  }

  async deleteAllDebtors() {
    const query = this.debtorRepository.createQueryBuilder('debtor');

    try {
      return await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.handleExceptions(error)
    }
  }
}
