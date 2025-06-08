import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Debtor } from 'src/debtors/entities/debtor.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        
        @InjectRepository(Debtor)
        private readonly debtorRepository: Repository<Debtor>,
    ) {}

    async runSeed() {
        await this.deleteTables();
        const users = await this.insertUsers();
        await this.insertDebtors(users);
        
        return {
        message: 'SEED EXECUTED',
        usersCreated: users.length,
        debtorsCreated: initialData.debtors.length
        };
    }

    private async deleteTables() {
        // Primero borramos debtors por la relación FK
        await this.debtorRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();
        
        // Luego borramos users
        await this.userRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();
    }

    private async insertUsers() {
        const seedUsers = initialData.users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 10) 
        }));

        const users = await this.userRepository.save(
        seedUsers.map(user => this.userRepository.create(user))
        );

        return users;
    }

    private async insertDebtors(users: User[]) {

        const userEmailMap = new Map<string, User>();
        users.forEach(user => {
            userEmailMap.set(user.email, user);
        });

        const debtorsToInsert = initialData.debtors.map(debtor => {
            const user = userEmailMap.get(debtor.userEmail);
            if (!user) {
                throw new Error(`No se encontró usuario con email: ${debtor.userEmail}`);
            }
            return this.debtorRepository.create({
                ...debtor,
                user // Asignamos el objeto User completo
            });
        });

        await this.debtorRepository.save(debtorsToInsert);
    }
}