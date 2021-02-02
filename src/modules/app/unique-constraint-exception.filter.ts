import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { UniqueConstraintError } from 'sequelize';

@Catch(UniqueConstraintError)
export class UniqueConstraintExceptionFilter implements ExceptionFilter {
  catch(exception: UniqueConstraintError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.CONFLICT).json({
      statusCode: HttpStatus.CONFLICT,
      message: exception.errors[0]?.message ?? 'Unique constraint violated',
    });
  }
}
