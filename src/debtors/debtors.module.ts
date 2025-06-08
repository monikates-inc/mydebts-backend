import { Module } from '@nestjs/common';
import { DebtorsService } from './debtors.service';
import { DebtorsController } from './debtors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debtor } from './entities/debtor.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [DebtorsController],
  providers: [DebtorsService],
  imports: [
    TypeOrmModule.forFeature([Debtor]),
    AuthModule,
  ],
  exports: [
    DebtorsService,
    TypeOrmModule,
  ]
})
export class DebtorsModule {}
