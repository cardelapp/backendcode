// types/custom.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
      otpuser?:{
        otp:string;
        email:string
      }
    }
  }
}
