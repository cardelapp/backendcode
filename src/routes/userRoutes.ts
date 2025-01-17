import express, { NextFunction, Request,Response } from "express";
import { changeRole, emailChecker, forgotPassword, getuser, login, register, sendotp, verifyopt, verifypassword } from "../controllers/authController";
import { authenticateToken, tokenpassword } from "../middleware/authmiddleware";
const router=express.Router();

router.get('/',(req: Request, res: Response)=>{
    getuser(req,res)
})

router.post('/emailchecker',(req: Request, res: Response)=>{emailChecker(req,res)})

router.post ('/changerole',
    (req: Request, res: Response,next:NextFunction)=>{authenticateToken(req,res,next)},
    (req: Request, res: Response)=>{changeRole(req,res)})
    
router.post('/register',(req: Request, res: Response)=>{register(req,res)})

router.post('/sendotp',(req: Request, res: Response)=>{sendotp(req,res)})

router.post('/verifyotp',
    (req: Request, res: Response,next:NextFunction)=>{tokenpassword(req,res,next)},
    (req: Request, res: Response)=>{verifyopt(req,res)})

router.post('/forgotpaswword',(req: Request, res: Response)=>{forgotPassword(req,res)})

router.post('/changepassword',
    (req: Request, res: Response,next:NextFunction)=>{tokenpassword(req,res,next)},
    (req: Request, res: Response)=>{verifypassword(req,res)})
router.post('/login',(req: Request, res: Response)=>{login(req,res)})

export default router;