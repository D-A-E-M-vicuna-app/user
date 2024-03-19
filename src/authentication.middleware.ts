import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

// Extiende la interfaz Request para incluir la propiedad user
declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('imprimiendo token',token);
    if (token == null) {
      return res.sendStatus(401); // Si no hay token, enviar un error 401
    }

    jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.sendStatus(403); // Si el token es inválido, enviar un error 403
      }
      req.user = user;
      next(); // Pasar al siguiente middleware o al controlador de la ruta
    });
  }
}