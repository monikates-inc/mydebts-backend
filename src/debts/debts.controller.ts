import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  @Auth()
  create(
    @Body() createDebtDto: CreateDebtDto,
    @GetUser() user: User,
  ) {
    return this.debtsService.create(createDebtDto, user);
  }

  @Get(':id')
  findAllByDebtor(@Param('id') debtorId: string) {
    return this.debtsService.findAllByDebtor(debtorId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.debtsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDebtDto: UpdateDebtDto) {
  //   return this.debtsService.update(+id, updateDebtDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.debtsService.remove(+id);
  // }
}
