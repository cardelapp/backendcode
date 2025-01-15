import { Request, Response, NextFunction } from "express";
import { uploadDir } from "../middleware";
import { CarListing } from "../models";

const Uploadupdate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { carId } = req.query;
    const userId = req.user?.id; // Fallback to undefined if no userId

    // Check if carId is provided
    if (!carId) {
      res.status(400).json({ message: 'Car ID is required' });
      return;
    }

    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}/`;
    const imagePath = baseUrl + uploadDir;

    // Generate the image paths (assuming you have 4 images)
    let images: string[] = [];
    for (let i = 0; i < 4; i++) {
      images.push(imagePath + '/'+userId+carId+(i + 1)+'.png');
    }


    // Fetch the car listing from the database
    const carListingObject = await CarListing.findByPk(Number(carId));

    // Check if car listing is found
    if (!carListingObject) {
      res.status(404).json({ message: `Car listing with ID ${carId} not found` });
      return;
    }
console.log(images)
    // Combine the car listing object with the images array
    const combinedObject = { ...carListingObject.toJSON(), images };

    // Update the car listing in the database
    await CarListing.update(combinedObject, { where: { id: carId } });

    // Return success message
    res.status(200).json({
      message:'Images uploaded successfully',
      carListing: combinedObject,
    });

  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the car listing', error: error.message });
  }
};

export default Uploadupdate;
