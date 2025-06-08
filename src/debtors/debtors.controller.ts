import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DebtorsService } from './debtors.service';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('debtors')
export class DebtorsController {
  constructor(private readonly debtorsService: DebtorsService) {}

  @Post()
  @Auth()
  create(
    @Body() createDebtorDto: CreateDebtorDto,
    @GetUser() user: User,
  ) {
    return this.debtorsService.create(createDebtorDto, user);
  }

  @Get()
  findAll() {
    return this.debtorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDebtorDto: UpdateDebtorDto) {
    return this.debtorsService.update(+id, updateDebtorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debtorsService.remove(+id);
  }
}
