import { ParameterService } from './parameter.service';

export type AppConfig = {
  dbHost: string;
  dbPort: number;
  dbPassword: string;
};

export const getConfig = async (
  parameterService: ParameterService,
): Promise<AppConfig> => ({
  dbHost: await parameterService.getParameter('DB_HOST'),
  dbPort: Number(await parameterService.getParameter('DB_PORT')),
  dbPassword: await parameterService.getParameter('DB_PASSWORD'),
});
