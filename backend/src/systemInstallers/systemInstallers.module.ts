import { Module } from '@nestjs/common';
import { SystemInstallersController } from './systemInstallers.controller';
import { SystemInstallersService } from './systemInstallers.service';
import { DbService } from '../db/db.service';

@Module({
  controllers: [SystemInstallersController],
  providers: [SystemInstallersService, DbService],
  exports: [SystemInstallersService],
})
export class SystemInstallersModule {}
