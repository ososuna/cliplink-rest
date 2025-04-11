import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '@/config';
import { UserModel } from '@/data/mongodb';

export class CreateUrlMiddleware {
  static validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;
    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) return next();
      const user = await UserModel.findById(payload.id);
      if (!user) return next();
      req.body.user = user;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'internal server error' });
    }
  };
}
