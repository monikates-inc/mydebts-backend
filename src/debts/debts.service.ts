import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debt } from './entities/debt.entity';
import { CreateDebtDto } from './dto/create-debt.dto';
import { Debtor } from 'src/debtors/entities/debtor.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class DebtsService {

  private readonly logger = new Logger('DebtsService')
  
    constructor(
      @InjectRepository(Debt)
      private readonly debtRepository: Repository<Debt>,

      @InjectRepository(Debtor)
      private readonly debtorRepository: Repository<Debtor>,
    ) {}


  async create(createDebtDto: CreateDebtDto, user: User) {
    let {mount, ...debtor} = createDebtDto;

    try {

      // Verificar si el deudor ya existe
      const existingDebtor = await this.debtorRepository.findOne({
        where: {
          name: debtor.name,
          lastname: debtor.lastname,
          user: { id: user.id }, // Asegura que el deudor pertenezca al usuario
        }
      });

      // Si el deudor ya existe, reutilizarlo
      if (existingDebtor) {
        debtor = existingDebtor;
      } else {
        // Crear el deudor
        const debtor = this.debtorRepository.create({
          name: createDebtDto.name,
          lastname: createDebtDto.lastname,
          email: createDebtDto.email,
          phone: createDebtDto.phone,
          user: user,
        });
        await this.debtorRepository.save(debtor);
      }  
      //Crear la deuda con el monto y el deudor
      const debt = this.debtRepository.create({
        mount: createDebtDto.mount,
        debtor: debtor, // relación con la entidad Debtor
      });      

      await this.debtRepository.save(debt);
  
      return {
        message: existingDebtor 
          ? 'Deuda agregada a deudor existente' 
          : 'Deudor y deuda creados correctamente',
      };
    }
    catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected Error, check server logs');
    }
  }

  async findAllByDebtor(debtorId: string) {

    try {
      let debts = await this.debtRepository.find({
        where: {
          debtor: { id: debtorId }
        },
        relations: ['debtor'],
      });

      return debts.map(debt => ({
        mount: debt.mount,
        description: debt.description,
        paymentDate: debt.paymentDate,
        paymentMethod: debt.paymentMethod,  
        paid: debt.paid,     
      }));
    }
    catch (error) {      
      this.logger.error(error)    
      throw new InternalServerErrorException('Unexpected Error, check server logs')
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} debt`;
  // }

  // update(id: number, updateDebtDto: UpdateDebtDto) {
  //   return `This action updates a #${id} debt`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} debt`;
  // }
}
