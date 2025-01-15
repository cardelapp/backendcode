import { Request, Response, NextFunction } from 'express';
import GenericCRUDUtil from './utilFunctionController';
import { CarListing } from '../models';

export class CarListingController {
  private crudUtil: GenericCRUDUtil;

  constructor() {
    this.crudUtil = new GenericCRUDUtil(CarListing);  // Instantiate with the CarListing model
  }

  // Create a new car listing using
  async createCarListing(req: Request, res: Response): Promise<void> {
    try {
      const carListing = await CarListing.create(req.body);
      res.status(201).json(carListing);
    } catch (error) {
      res.status(500).json({ message: 'Error creating car listing', error });
    }
  }
  //Edit an existing car listing using GenericCRUDUtil
  async editCarListing(req: Request, res: Response) {
    try {
      const id = req.user.id;
      const carListing = await CarListing.findByPk(id);
      if (!carListing) {
        return res.status(404).json({ success: false, message: "Car listing not found" });
      }
      // Use the updateById method from GenericCRUDUtil
      const carUpdate =  this.crudUtil.updateById(req, res);
      res.status(201).json(carUpdate)
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  // Delete a car listing using GenericCRUDUtil
  async deleteCarListing(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const carListing = await CarListing.findByPk(id);
      if (!carListing) {
        return res.status(404).json({ success: false, message: "Car listing not found" });
      }

      // Use the deleteById method from GenericCRUDUtil
      return this.crudUtil.deleteById(req, res);
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