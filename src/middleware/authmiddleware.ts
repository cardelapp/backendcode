import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"

// Interface to define the user object
export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access token missing or invalid." });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as {
        id: string;
        email: string;
      };
      req.user = { id: decoded.id, email: decoded.email }; // Attach user info to request
      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
  };

  export const tokenpassword = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access token missing or invalid." });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as {
       email: string;
       otp:string;
      };
      req.otpuser = { otp: decoded.otp, email: decoded.email }; // Attach user info to request
      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
  };
  



