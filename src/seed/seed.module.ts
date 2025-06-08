import { Module } from '@nestjs/common';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { AuthModule } from 'src/auth/auth.module';
import { DebtorsModule } from 'src/debtors/debtors.module';

@Module({
    controllers: [SeedController],
    providers: [SeedService],
    imports: [
        AuthModule,
        DebtorsModule,
    ],
})
export class SeedModule {}