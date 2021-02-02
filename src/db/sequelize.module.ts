import { SequelizeModule } from '@nestjs/sequelize';
import { AppConfig } from '../config/config';
import { AppConfigModule } from '../config/app-config.module';

export default SequelizeModule.forRootAsync({
  imports: [AppConfigModule],
  inject: ['CONFIG'],
  useFactory: (config: AppConfig) => {
    console.log(config.dbHost);
    return {
      dialect: 'postgres',
      host: config.dbHost,
      port: config.dbPort,
      username: 'statsservice',
      password: config.dbPassword,
      database: 'statsservice',
      autoLoadModels: true,
      synchronize: true,
      repositoryMode: true,
    };
  },
});
