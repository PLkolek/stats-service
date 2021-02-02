import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ParameterService } from './parameter.service';
import { SSMClient } from '@aws-sdk/client-ssm';
import { getConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  exports: ['CONFIG'],
  providers: [
    ParameterService,
    { provide: SSMClient, useValue: new SSMClient({}) },
    { provide: 'CONFIG', useFactory: getConfig, inject: [ParameterService] },
  ],
})
export class AppConfigModule {}
