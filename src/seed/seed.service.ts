import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Debtor } from 'src/debtors/entities/debtor.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

//TODO: Arreglar el seed
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
        
        // Verificación adicional
        await this.validateSeed(users);
        
        return {
            message: 'SEED EXECUTED SUCCESSFULLY',
            usersCreated: users.length,
            debtorsCreated: initialData.debtors.length
        };
    }

    private async deleteTables() {
        await this.debtorRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
            
        await this.userRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
    }

    private async insertUsers() {
        // Hasheo asíncrono con verificación
        const userCreationPromises = initialData.users.map(async user => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return this.userRepository.create({
                ...user,
                password: hashedPassword
            });
        });

        const usersToSave = await Promise.all(userCreationPromises);
        return await this.userRepository.save(usersToSave);
    }

    private async insertDebtors(users: User[]) {
        const userEmailMap = new Map<string, User>();
        users.forEach(user => userEmailMap.set(user.email, user));

        const debtorCreationPromises = initialData.debtors.map(async debtor => {
            const user = userEmailMap.get(debtor.userEmail);
            if (!user) throw new Error(`User with email ${debtor.userEmail} not found`);
            
            return this.debtorRepository.create({
                ...debtor,
                user
            });
        });

        const debtorsToSave = await Promise.all(debtorCreationPromises);
        await this.debtorRepository.save(debtorsToSave);
    }

    private async validateSeed(users: User[]) {
        // Verifica que las contraseñas coincidan
        for (const user of users) {
            const originalUserData = initialData.users.find(u => u.email === user.email);
            if (!originalUserData) continue;
            
            const isValid = await bcrypt.compare(originalUserData.password, user.password);
            if (!isValid) {
                throw new Error(`Password verification failed for user ${user.email}`);
            }
        }
        
        // Verifica las relaciones
        for (const debtorData of initialData.debtors) {
            const exists = await this.debtorRepository.findOne({
                where: { 
                    name: debtorData.name,
                    lastname: debtorData.lastname,
                    user: { email: debtorData.userEmail }
                },
                relations: ['user']
            });
            
            if (!exists) {
                throw new Error(`Debtor ${debtorData.name} ${debtorData.lastname} not properly created`);
            }
        }
    }
}