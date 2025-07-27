import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { DebtorsService } from 'src/debtors/debtors.service';
import { Debtor } from 'src/debtors/entities/debtor.entity';
import { Debt } from 'src/debts/entities/debt.entity';



@Injectable()
export class SeedService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Debtor)
        private readonly debtorRepository: Repository<Debtor>,

        @InjectRepository(Debt)
        private readonly debtRepository: Repository<Debt>,
    ) {}
    
    async runSeed() {

        await this.deleteTables();

        const users = await this.insertUsers(); // Ahora inserta todos los usuarios
        await this.insertNewDebts(users); // Pasa todos los usuarios
        
        return {
            message: 'SEED EXECUTED SUCCESSFULLY',
            usersCreated: users.length,
            debtsCreated: initialData.debts.length
        };
    }

    private async deleteTables() {
        // Elimina todas las deudas
        const queryBuilderDebt = this.debtRepository.createQueryBuilder();
        await queryBuilderDebt
        .delete()
        .where({})
        .execute();
        // Elimina todos los deudores
        const queryBuilderDebtor = this.debtorRepository.createQueryBuilder();
        await queryBuilderDebtor
        .delete()
        .where({})
        .execute();

        // Elimina todos los usuarios
        const queryBuilderUser = this.userRepository.createQueryBuilder();
        await queryBuilderUser
        .delete()
        .where({})
        .execute()
    }

    private async insertUsers() {
        const seedUsers = initialData.users;
        const users: User[] = [];

        seedUsers.forEach( user => {
            users.push(this.userRepository.create( user ))
        });

        return await this.userRepository.save(users);
    }

    private async insertNewDebts(users: User[]) {
        // Crear mapa de email → usuario
        const userEmailMap = new Map<string, User>();
        users.forEach(user => userEmailMap.set(user.email, user));

        // Procesar todos los debtData (que incluye info del deudor + deuda)
        const insertPromises = initialData.debts.map(async debtData => {
        const user = userEmailMap.get(debtData.userEmail);
        if (!user) {
            throw new Error(`No se encontró usuario con email: ${debtData.userEmail}`);
        }

        // Crear deudor
        const debtor = this.debtorRepository.create({
            name: debtData.name,
            lastname: debtData.lastname,
            phone: debtData.phone,
            email: debtData.email,
            user,
        });
        const savedDebtor = await this.debtorRepository.save(debtor);

        // Crear deuda asociada al deudor
        const debt = this.debtRepository.create({
            mount: debtData.mount,
            description: debtData.description,
            debtor: savedDebtor,
        });
        await this.debtRepository.save(debt);
        });

        await Promise.all(insertPromises);
    }
}