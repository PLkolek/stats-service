import { SequelizeModule } from '@nestjs/sequelize';

export default SequelizeModule.forRoot({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'stats-service',
  password: 'PizzaMargaritaRocks',
  database: 'stats-service',
  autoLoadModels: true,
  synchronize: true,
  repositoryMode: true,
});
