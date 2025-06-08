import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { DebtorsService } from 'src/debtors/debtors.service';



@Injectable()
export class SeedService {

    constructor(
        private readonly debtorService: DebtorsService,
        
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}
    
    async runSeed() {

        await this.deleteTables();
        const users = await this.insertUsers(); // Ahora inserta todos los usuarios
        await this.insertNewDebtors(users); // Pasa todos los usuarios
        
        return {
            message: 'SEED EXECUTED SUCCESSFULLY',
            usersCreated: users.length,
            debtorsCreated: initialData.debtors.length
        };
    }

    private async deleteTables() {

        await this.debtorService.deleteAllDebtors();

        const queryBuilder = this.userRepository.createQueryBuilder();
        await queryBuilder
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

        const dbUsers = await this.userRepository.save(seedUsers)

        return dbUsers;
    }

    private async insertNewDebtors(users: User[]) {
        // Crear mapa de emails a usuarios
        const userEmailMap = new Map<string, User>();
        users.forEach(user => userEmailMap.set(user.email, user));

        // Procesar todos los debtors
        const insertPromises = initialData.debtors.map(async debtor => {
        const user = userEmailMap.get(debtor.userEmail);
        if (!user) {
            throw new Error(`No se encontró usuario con email: ${debtor.userEmail}`);
        }
        return this.debtorService.create(debtor, user);
        });

        await Promise.all(insertPromises);
    }
}