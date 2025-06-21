import { Module } from '@nestjs/common';
import { AddressesModule } from './addresses/addresses.module';
import { PersonsModule } from './persons/persons.module';
import { SystemInstallersModule } from './systemInstallers/systemInstallers.module';
import { ApplicationsModule } from './applications/applications.module';

@Module({
  imports: [
    AddressesModule,
    PersonsModule,
    SystemInstallersModule,
    ApplicationsModule,
  ],
})
export class AppModule {}

