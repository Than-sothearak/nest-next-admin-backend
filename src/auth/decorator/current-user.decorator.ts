// src/auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserData } from '../interfaces/current-user.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserData, ctx: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest<{ user: CurrentUserData }>();
    const user: CurrentUserData = request.user; // Type assertion to CurrentUser interface

    return data ? user?.[data] : user; // Return specific property if data is provided, otherwise return the whole user object
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  },
);
