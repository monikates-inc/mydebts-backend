import { Injectable } from '@nestjs/common';

import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async runSeed() {
        await this.deleteTables();
        await this.insertUsers();

        return 'SEED EXECUTED';
    }

    private async deleteTables() {
        await this.userRepository.createQueryBuilder().delete().where({}).execute();
    }

    private async insertUsers() {
        const seedUsers = initialData.users;
        const users: User[] = [];

        seedUsers.forEach((user) => {
        users.push(this.userRepository.create(user));
        });

        const dbUsers = await this.userRepository.save(seedUsers);

        return dbUsers[0];
    }
}
