import { Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { DbService } from '../db/db.service';

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService, DbService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
