import { Module } from '@nestjs/common';
import { DebtorsService } from './debtors.service';
import { DebtorsController } from './debtors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debtor } from './entities/debtor.entity';
import { AuthModule } from 'src/auth/auth.module';
import { DebtsModule } from 'src/debts/debts.module';
import { Debt } from 'src/debts/entities/debt.entity';

@Module({
  controllers: [DebtorsController],
  providers: [DebtorsService],
  imports: [
    TypeOrmModule.forFeature([Debtor, Debt]),
    AuthModule,
    DebtsModule,
  ],
  exports: [
    DebtorsService,
    TypeOrmModule,
  ]
})
export class DebtorsModule {}
