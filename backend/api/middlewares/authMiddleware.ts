import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../../types/AuthRequest';

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string };
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
