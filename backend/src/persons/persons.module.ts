import { Module } from '@nestjs/common';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { DbService } from '../db/db.service';

@Module({
  controllers: [PersonsController],
  providers: [PersonsService, DbService],
  exports: [PersonsService],
})
export class PersonsModule {}
