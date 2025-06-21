import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { DbService } from '../db/db.service';

@Module({
  controllers: [AddressesController],
  providers: [AddressesService, DbService],
  exports: [AddressesService],
})
export class AddressesModule {}
