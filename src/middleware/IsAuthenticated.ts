import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface Payload {
  sub: string;
}

export function IsAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).end(); // Sem token
  }

  const [, token] = authToken.split(" ");
  

  try{
    const { sub } = verify(
      token,
      process.env.JWS_SECRET
    ) as Payload;

    req.user_id = sub;
    return next();// Chama o próximo middleware
  } catch (err){
    return res.status(401).end(); // Token inválido
  }
      
}
