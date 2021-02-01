import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ParseUUIDPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class XUserIdHeaderGuard implements CanActivate {
  //TODO: nasty trick?
  constructor(private readonly parseUUIDPipe: ParseUUIDPipe) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.header('X-User-Id');

    if (!userId) {
      throw new UnauthorizedException('X-User-Id header is required');
    }

    return this.parseUUIDPipe
      .transform(userId, { type: 'custom' })
      .then(() => true)
      .catch(() => {
        throw new UnauthorizedException(
          "X-User-Id header must be a valid user's UUID",
        );
      });
  }
}
