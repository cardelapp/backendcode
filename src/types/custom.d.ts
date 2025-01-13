// types/custom.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
      otpuser?:{
        otp:string;
        email:string
      }
    }
  }
}
