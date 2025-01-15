import { Request, Response, NextFunction } from "express";
import { User } from '../models';

// middleware/checkUserExists.ts
export const checkUserExists = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Attach the user object to the request for further use
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking user', error });
  }
};

// middleware/checkDealerRole.ts
export const checkDealerRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userObj = await User.findByPk(req.user.id); // Assuming `req.user` contains user ID
  
      if (!userObj) {
        res.status(400).json({ message: 'User data is not available' });
        return; // Explicitly end the middleware chain
      }
  
      if (userObj.role !== 'dealer') {
        res.status(403).json({ message: 'Access denied: User is not a dealer' });
        return;
      }
  
      next();
    } catch (error) {
      next(error); 
    }
  };