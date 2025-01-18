// utils/GenericCRUDUtil.ts
import { Request, Response } from 'express';
import { Model, FindOptions, WhereOptions, Op } from 'sequelize';
import UserModel from "../models/userModel"


class GenericCRUDUtil {
  private model: any;

  constructor(model: any) {
    this.model = model;
  }

  // Create
  async create(
    req: Request,
    res: Response) {
    try {
      const newRecord = await this.model.create(req.body);
      res.status(201).json(newRecord);
    } catch (error) {
      res.status(500).json({ message: 'Error creating record', error });
    }
  }

  // Get All (Paginated)
  async getAll(req: Request, res: Response) {
    const {
      page = 1,
      limit = 10,
      search = '{}',
      sort = 'createdAt',
      order = 'DESC',
      minPrice,
      maxPrice
    } = req.query;

    const options: FindOptions = {
      limit: parseInt(limit as string),
      offset: (parseInt(page as string) - 1) * parseInt(limit as string),
      order: [[sort as string, order as string]],
    };
    // Parse search query (e.g., '{"color": "red", "brand": "toyota"}')
    let parsedSearch = {};
    try {
      parsedSearch = JSON.parse(search as string);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid search format' });
    }
    // Add parsed search conditions to the where clause
    if (Object.keys(parsedSearch).length > 0) {
      options.where = { ...parsedSearch };
    }
    // Add price range filter
    if (minPrice || maxPrice) {
      options.where = options.where || {};
      options.where['price'] = {};
      if (minPrice) {
        options.where['price'][Op.gte] = parseFloat(minPrice as string);
      }
      if (maxPrice) {
        options.where['price'][Op.lte] = parseFloat(maxPrice as string);
      }
    }
    try {
      const result = await this.model.findAndCountAll(options);
      const updatedRows = await Promise.all(result.rows.map(async (data) => {
        const user = await UserModel.findOne({ where: { id: data.dealerId } });
        data.dataValues.companyName = user ? user.companyName : 'Unknown';
        return data;
      }));
      res.json({
        data: updatedRows,
        total: result.count,
        page: parseInt(page as string),
        pages: Math.ceil(result.count / parseInt(limit as string)),
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching records', error });
    }
  }

  // Get By ID
  async getById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const record = await this.model.findByPk(id);
      if (!record) {
        return res.status(404).json({ message: 'Record not found' });
      }
      res.json(record);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching record', error });
    }
  }

  // Update By ID
  async updateById<T>(reqBody: Partial<T>, id: number) {
    try {
      const [updated] = await this.model.update(reqBody, { where: { id: id } });
      if (!updated) {
        return ({ message: 'Record not found or not updated' });
      }
    } catch (error) {
      console.error({ message: 'Error updating record', error });
    }
  }

  // Delete By ID
  async deleteById(userId: number, itemId: number) {
    try {
      const deleted = await this.model.destroy({ where: { dealerId: userId, id: itemId } });
      if (!deleted) {
        return ({ message: 'Record not found or not deleted' });
      }
      return ({ message: 'Record deleted successfully' });
    } catch (error) {
      console.error({ message: 'Error deleting record', error });
    }
  }
}

export default GenericCRUDUtil;