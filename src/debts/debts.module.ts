import { Module } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { DebtsController } from './debts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debt } from './entities/debt.entity';
import { Debtor } from 'src/debtors/entities/debtor.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [DebtsController],
  providers: [DebtsService],
  imports: [
    TypeOrmModule.forFeature([Debt, Debtor]),
    AuthModule,
  ],
  exports: [
    TypeOrmModule,
  ],
})
export class DebtsModule {}
