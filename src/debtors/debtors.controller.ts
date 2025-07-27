import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DebtorsService } from './debtors.service';
import { CreateDebtorDto } from './dtos/create-debtor.dto';
import { UpdateDebtorDto } from './dtos/update-debtor.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('debtors')
export class DebtorsController {
  constructor(private readonly debtorsService: DebtorsService) {}

  @Get()
  @Auth()
  findAll(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User,
  ) {
    return this.debtorsService.findAllByUser(paginationDto, user);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.debtorsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDebtorDto: UpdateDebtorDto) {
  //   return this.debtorsService.update(+id, updateDebtorDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.debtorsService.remove(+id);
  // }
}
