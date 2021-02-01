import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { isUUIDv4 } from '../helpers/uuid';

@Injectable()
export class XUserIdHeaderGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.header('X-User-Id');

    if (!userId) {
      throw new UnauthorizedException('X-User-Id header is required');
    }

    if (!isUUIDv4(userId)) {
      throw new UnauthorizedException(
        "X-User-Id header must be a valid user's UUID",
      );
    }

    return true;
  }
}
