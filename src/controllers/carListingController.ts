import { Request, Response, NextFunction } from 'express';
import GenericCRUDUtil from './utilFunctionController';
import { CarListing } from '../models';
import { ListingRequestbodytype } from '../types/types'

export class CarListingController {
  private crudUtil: GenericCRUDUtil;

  constructor() {
    this.crudUtil = new GenericCRUDUtil(CarListing);  // Instantiate with the CarListing model
  }

  // Create a new car listing using
  async createCarListing(req: Request, res: Response): Promise<void> {
    try {
      const dealerId = req.user?.id; 
      const payload = { ...req.body, dealerId }; // Merging req.body with dealerId
      const carListing = await CarListing.create(payload); // Using the payload to create the car listing
      res.status(201).json(carListing); // Return the created car listing
    } catch (error) {
      res.status(500).json({ message: 'Error creating car listing', error });
    }
  }

  //Edit an existing car listing using GenericCRUDUtil
  async editCarListing(
    req: Request<{carId: string}, {}, ListingRequestbodytype>, 
    res: Response): Promise<void> {
    try {
      const id = req.user.id;
      const carId = parseInt(req.params.carId)
      const carListing = await CarListing.findOne({where: {dealerId: id, id: carId}});
      if (!carListing) {
        res.status(404).json({ success: false, message: "Car listing not found" });
        return
      }
      // Use the updateById method from GenericCRUDUtil
      this.crudUtil.updateById<CarListing>(req.body, carListing.id);
      res.status(201).json({message: `car listing with id ${carId} updated succeesfully`})
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  // Delete a car listing using GenericCRUDUtil
  async deleteCarListing(
    req: Request<{carId: string}, {}, {}>, 
    res: Response
  ): Promise<void> {
    try {
      const dealerId = req.user.id
      const carId = parseInt(req.params.carId);
      const carListing = await CarListing.findOne({where: {dealerId: dealerId, id: carId}});
      if (!carListing) {
        res.status(404).json({ success: false, message: "Car listing not found" });
        return
      }
      // Use the deleteById method from GenericCRUDUtil
      this.crudUtil.deleteById(dealerId, carListing.id);
      res.status(200).json({message: `Car listing with id ${carId} deleted successfully`})
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
  // Get all cars with pagination using GenericCRUDUtil
  async getAllCars(req: Request, res: Response) {
    try {
      // Use the getAll method from GenericCRUDUtil
      return this.crudUtil.getAll(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
  // Get cars by search input with pagination using GenericCRUDUtil
  async searchCars(req: Request, res: Response) {
    try {
      return this.crudUtil.getAll(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
}

export const carListingController = new CarListingController()
//export default carListingController;