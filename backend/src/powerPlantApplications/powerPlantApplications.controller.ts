import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PowerPlantApplicationsService } from './powerPlantApplications.service';

// Base route: / (module level routes not specified, so each entity is a separate path)
@Controller('power-plant-applications')
export class PowerPlantApplicationsController {
  constructor(private readonly service: PowerPlantApplicationsService) {}

  // ADDRESSES
  @Get('addresses')
  findAllAddresses() {
    return this.service.findAllAddresses();
  }

  @Get('addresses/:id')
  findAddressById(@Param('id') id: string) {
    return this.service.findAddressById(Number(id));
  }

  @Post('addresses')
  createAddress(@Body() data: any) {
    return this.service.createAddress(data);
  }

  @Put('addresses/:id')
  updateAddress(@Param('id') id: string, @Body() data: any) {
    return this.service.updateAddress(Number(id), data);
  }

  @Delete('addresses/:id')
  deleteAddress(@Param('id') id: string) {
    return this.service.deleteAddress(Number(id));
  }

  // PERSONS
  @Get('persons')
  findAllPersons() {
    return this.service.findAllPersons();
  }

  @Get('persons/:id')
  findPersonById(@Param('id') id: string) {
    return this.service.findPersonById(Number(id));
  }

  @Post('persons')
  createPerson(@Body() data: any) {
    return this.service.createPerson(data);
  }

  @Put('persons/:id')
  updatePerson(@Param('id') id: string, @Body() data: any) {
    return this.service.updatePerson(Number(id), data);
  }

  @Delete('persons/:id')
  deletePerson(@Param('id') id: string) {
    return this.service.deletePerson(Number(id));
  }

  // SYSTEM INSTALLERS
  @Get('system-installers')
  findAllSystemInstallers() {
    return this.service.findAllSystemInstallers();
  }

  @Get('system-installers/:id')
  findSystemInstallerById(@Param('id') id: string) {
    return this.service.findSystemInstallerById(Number(id));
  }

  @Post('system-installers')
  createSystemInstaller(@Body() data: any) {
    return this.service.createSystemInstaller(data);
  }

  @Put('system-installers/:id')
  updateSystemInstaller(@Param('id') id: string, @Body() data: any) {
    return this.service.updateSystemInstaller(Number(id), data);
  }

  @Delete('system-installers/:id')
  deleteSystemInstaller(@Param('id') id: string) {
    return this.service.deleteSystemInstaller(Number(id));
  }

  // APPLICATIONS
  @Get('applications')
  findAllApplications() {
    return this.service.findAllApplications();
  }

  @Get('applications/:id')
  findApplicationById(@Param('id') id: string) {
    return this.service.findApplicationById(Number(id));
  }

  @Post('applications')
  createApplication(@Body() data: any) {
    return this.service.createApplication(data);
  }

  @Put('applications/:id')
  updateApplication(@Param('id') id: string, @Body() data: any) {
    return this.service.updateApplication(Number(id), data);
  }

  @Delete('applications/:id')
  deleteApplication(@Param('id') id: string) {
    return this.service.deleteApplication(Number(id));
  }
}
