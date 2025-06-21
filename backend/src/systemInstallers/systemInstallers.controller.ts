import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SystemInstallersService } from './systemInstallers.service';

@Controller('system-installers')
export class SystemInstallersController {
  constructor(private readonly service: SystemInstallersService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findById(@Param('id') id: string) { return this.service.findById(Number(id)); }

  @Post()
  create(@Body() data: any) { return this.service.create(data); }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) { return this.service.update(Number(id), data); }

  @Delete(':id')
  delete(@Param('id') id: string) { return this.service.delete(Number(id)); }
}
