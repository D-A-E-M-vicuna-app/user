import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('token en auth.guard:',token);
    console.log("headers en authHeader.guard",req.headers)
    //console.log('Solicitud completa:', req);

    if (token == null) {
      return false;
    }

    try {
      jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    } catch (err) {
      return false;
    }

    return true;
  }
}