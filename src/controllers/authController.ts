import { Request, Response,NextFunction } from "express";
import { LoginRequestBody, Requestbodytype } from "../types/types"
import User from "../models/userModel"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { sendEmailPassword } from "../utils/sendEmail";
import crypto from "crypto";
import { VerifyTemplate } from "../utils/emailtemplate";

export const getuser=(req:Request,res:Response)=>{
    return res.status(201).json({message:'hello'})
}

export const register = async (
  req: Request<{}, {}, Requestbodytype>,
  res: Response,
  next?: NextFunction
): Promise<Response> => {
  try {
    const {firstname,lastname,email,gender,address,password,phonenumber} = req.body;
    console.log(req.body)
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  // Validate password (e.g., minimum length, includes letters and numbers)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include both letters and numbers.",
    });
  }
  if(!phonenumber){
    return res.status(400).json({
      message:
        "Phone number Field empty",
    });

  }

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    // Proceed with registration logic (e.g., create a new user in the database)
    const newUser = await User.create({firstname,lastname,email,gender,address,phonenumber,password:hashedPassword});
    // Return success response
    return res.status(201).json({
        message: "User registered successfully.",
        user: {
          id: newUser.id,
          email: newUser.email,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
        },
      });
    } catch (error: any) {
      console.error("Error during registration:", error.message || error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
  };
  export const emailChecker = async (
    req: Request<{}, {}, Requestbodytype>,
    res: Response,
    next?: NextFunction
  ): Promise<Response> => {
    try {
      const {email} = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
  
      // Check if the user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }
      // Return success response
      return res.status(201).json({
          message: "New User.",
        });
      } catch (error: any) {
        console.error("Error during registration:", error.message || error);
        return res.status(500).json({ message: "Internal Server Error." });
      }
    };
  export const login=async(req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<Response> => {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
          return res.status(400).json({ message: "Email and password are required." });
        }
        // Check if the user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid email or password." });
        }
    
        // Generate a JWT token
        
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET || "default_secret", // Use a secure secret in production
          { expiresIn: "1h" }
        );
    
        // Respond with user details and token
        return res.status(200).json({
          message: "Login successful.",
          user: {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            token,
          },
        });
      } catch (error: any) {
        console.error("Error during login:", error.message || error);
        return res.status(500).json({ message: "Internal Server Error." });
      }

}

export const sendotp= async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email } = req.body;
  
      // Validate email
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }
  
      // Generate a 6-digit OTP
      const otp = crypto.randomInt(100000, 999999).toString();
  
      // Generate a JWT token containing the OTP and email
      const token = jwt.sign(
        { otp, email:email },
        process.env.JWT_SECRET || "default_secret", // Use a secure secret in production
        { expiresIn: "5m" }
      );
  
      // Email Subject and HTML Template
      const subject = "Password Reset Request";
      const htmltemplate = VerifyTemplate(otp);
  
      // Send the email
      const emailResult = await sendEmailPassword(email, subject, email, () => htmltemplate);
      if (!emailResult.success) {
        return res.status(500).json({ message: "Failed to send email." });
      }
  
      // Return success response
      return res.status(200).json({ message: "OTP sent to your email.", token });
    } catch (error: any) {
      console.error("Error in forgotPassword:", error.message || error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
  };
  export const verifyopt= async (req: Request, res: Response) => {
    try{
        const otpjwt =req.otpuser?.otp
        const emailjwt=req.otpuser?.email
        const otp=req.body.otp
        const email=req.body.email
        console.log(emailjwt,otpjwt)
        
        if( otpjwt!==otp || email!==emailjwt){
            return res.status(404).json({ message: "Invalid otp." });

        }
       
        return res.status(200).json({ message: "Email verify successfully." });
    }catch(error: any){
        console.error("Error in forgotPassword:", error.message || error);
        return res.status(500).json({ message: "Internal Server Error." });

    }
   

  }

export const selectuserid = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
      }
  
      // Retrieve user details
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      user.password=""
      // Respond with user details
      return res.status(200).json({
        message: "User retrieved successfully.",user});
    } catch (error: any) {
      console.error("Error retrieving user:", error.message || error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
  };
  

  export const updateuser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.user?.id; // Get user ID from the token (middleware should set this)
      if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
      }
  
      // Validate incoming data (you can use libraries like Joi or express-validator)
      const { firstname,lastname,gender,state,lga,address,directoridnumber,directordob,directoraddress,directorfirstname,directorlastname,phonenumber,directorstate,directorlga,idtype,businessname,businesscategory,tinnumber,bnnumber,files } = req.body;
  
      if (!firstname || !lastname ) {
        return res.status(400).json({ message: "First name, last name, and email are required." });
      }
  
      // Find the user in the database
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Update the user's data
      
user.firstname = firstname;
user.lastname = lastname;
user.gender = gender || user.gender;
user.address = address || user.address;
user.phonenumber = phonenumber || user.phonenumber;
  
      // Save the updated user to the database
      await user.save();
      // Respond with the updated user details
      return res.status(200).json({
        message: "User updated successfully.",
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          address: user.address,
          phonenumber: user.phonenumber,
        },
      });
    } catch (error: any) {
      console.error("Error updating user:", error.message || error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
  };

  export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email } = req.body;
  
      // Validate email
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }
  
      // Check if the user exists
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User with this email does not exist." });
      }
  
      // Generate a 6-digit OTP
      const otp = crypto.randomInt(100000, 999999).toString();
  
      // Generate a JWT token containing the OTP and email
      const token = jwt.sign(
        { otp, email: user.email },
        process.env.JWT_SECRET || "default_secret", // Use a secure secret in production
        { expiresIn: "5m" }
      );
  
      // Email Subject and HTML Template
      const subject = "Password Reset Request";
      const htmltemplate = VerifyTemplate(otp);
  
      // Send the email
      const emailResult = await sendEmailPassword(email, subject, email, () => htmltemplate);
      if (!emailResult.success) {
        return res.status(500).json({ message: "Failed to send email." });
      }
  
      // Return success response
      return res.status(200).json({ message: "OTP sent to your email.", token });
    } catch (error: any) {
      console.error("Error in forgotPassword:", error.message || error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
  };
  
  export const verifypassword= async (req: Request, res: Response) => {
    try{
        const email=req.body.email
        const newpassword=req.body.password
        const user = await User.findOne({ where: { email } });
    
        if (!user) {
          return res.status(404).json({ message: "User with this email does not exist." });
        }
        
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        user.password = hashedPassword;
        await user.save()
        return res.status(200).json({ message: "Password updated successfully." });
    }catch(error: any){
        console.error("Error in forgotPassword:", error.message || error);
        return res.status(500).json({ message: "Internal Server Error." });

    }
  }

