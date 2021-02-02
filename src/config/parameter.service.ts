import { Injectable } from '@nestjs/common';
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { ConfigService } from '@nestjs/config';
import { getNodeEnv } from '../helpers/env';

type ParameterName = 'DB_HOST' | 'DB_PASSWORD' | 'DB_PORT';

@Injectable()
export class ParameterService {
  constructor(
    private readonly ssmClient: SSMClient,
    private readonly configService: ConfigService,
  ) {}

  public async getParameter(parameterName: ParameterName): Promise<string> {
    if (getNodeEnv() !== 'prod') {
      return this.getParameterFromEnv(parameterName);
    }
    return this.getParameterFromSSM(
      `/config/stats-service_prod/${parameterName}`,
    );
  }

  private async getParameterFromEnv(
    parameterName: ParameterName,
  ): Promise<string> {
    const parameterValue = this.configService.get<string>(parameterName);
    this.validateValueNotNull('env', parameterName, parameterValue);
    return parameterValue;
  }

  private async getParameterFromSSM(parameterName: string) {
    const command = new GetParameterCommand({
      Name: parameterName,
      WithDecryption: true,
    });

    const commandResult = await this.ssmClient.send(command).catch((err) => {
      if (err?.name === 'ParameterNotFound') {
        return undefined;
      }
      throw err;
    });
    const parameterValue = commandResult?.Parameter?.Value;
    this.validateValueNotNull('parameter store', parameterName, parameterValue);

    return parameterValue;
  }

  // noinspection JSMethodCanBeStatic
  private validateValueNotNull(
    parameterSource: string,
    parameterName: string,
    parameterValue: string | undefined,
  ): asserts parameterValue is string {
    if (!parameterValue) {
      throw new Error(
        `Parameter ${parameterName} not found in ${parameterSource}`,
      );
    }
  }
}
