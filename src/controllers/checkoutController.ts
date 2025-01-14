import { Request, Response,NextFunction } from "express";
import { CarListing, Order, User } from "../models";
import axios from "axios";

export const initiatePayment =  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          const { carListingId } = req.body;
          const userId = req.user?.id; // ✅ Safely access user ID
      
          if (!carListingId) {
            res.status(400).json({ message: 'Car Listing ID is required.' });
            return 
          }
      
          if (!userId) {
            res.status(401).json({ message: 'Unauthorized user.' });
            return
          }
      
          // ✅ Validate Car Listing
          const carObject = await CarListing.findByPk(carListingId);
          if (!carObject) {
            res.status(404).json({ message: 'Car does not exist.' });
            return
          }
      
          // ✅ Validate User
          const user = await User.findByPk(userId);
          if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return
          }
      
          const email = user.email;
          const dealerId = carObject.dealerId;
          const totalAmount = carObject.price;
      // Initiate payment with Paystack API
      const paystackResponseinit = await axios.post('https://api.paystack.co/transaction/initialize', {
        email: email,
        amount: totalAmount * 100, // Paystack expects the amount in kobo (100 kobo = 1 naira)
      }, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      });
      const { authorization_url, reference } = paystackResponseinit.data.data;
      const paystackResponse = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      });
      const { data } = paystackResponse.data;

      if (data.status === 'success') {

      //Save payment reference in the order
      const status:string = 'success';
      const order=await Order.create({carListingId,userId,email,status,paymentRef:reference});
        res.status(200).json({ message: 'Payment verified successfully.', order });
      } 
      else {

      const status:string = 'failed';
      const order=await Order.create({carListingId,userId,email,status,paymentRef:reference});
        res.status(400).json({ message: 'Payment verification failed.' });

      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to verify payment.', error: error.message });
    }
  };


  