import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend Request to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {  // Removed ': void'
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token missing or invalid." });
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET || "default_secret";

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    if (typeof decoded === "object" && decoded.id && decoded.email) {
      req.user = {
        id: decoded.id as number,
        email: decoded.email as string,
      };
      next();  // Proceed if token is valid
    } else {
      return res.status(403).json({ message: "Invalid token payload." });
    }
  } catch (error) {
    console.error("Token verification failed:", error);
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