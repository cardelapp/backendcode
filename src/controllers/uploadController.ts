import { CarListing } from "../models";

const Uploadupdate = async (carId: number, urls: string[]): Promise<{ carId: number; urls: string[] }> => {
  try {
    const carListingObject = await CarListing.findByPk(carId);

    if (!carListingObject) {
      throw new Error(`Car listing with ID ${carId} not found`);
    }

    const combinedObject = { ...carListingObject.toJSON(), images: urls };

    await CarListing.update(combinedObject, { where: { id: carId } });

    return { carId, urls };
  } catch (error: any) {
    console.error(`Error updating car listing: ${error.message}`);
    throw new Error(`An error occurred while updating the car listing: ${error.message}`);
  }
};
export default Uploadupdate