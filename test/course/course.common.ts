import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/modules/app/app.module';

export const initApp = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();
  return app;
};
