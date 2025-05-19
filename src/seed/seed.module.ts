import { Module } from '@nestjs/common';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    controllers: [SeedController],
    providers: [SeedService],
    imports: [
        AuthModule,
    ],
})
export class SeedModule {}