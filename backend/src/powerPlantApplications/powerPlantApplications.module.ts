import { Module } from '@nestjs/common';
import { PowerPlantApplicationsController } from './powerPlantApplications.controller';
import { PowerPlantApplicationsService } from './powerPlantApplications.service';
import { DbService } from '../db/db.service';

@Module({
  controllers: [PowerPlantApplicationsController],
  providers: [PowerPlantApplicationsService, DbService],
})
export class PowerPlantApplicationsModule {}
