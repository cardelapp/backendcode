// utils/GenericCRUDUtil.ts
import { Request, Response } from 'express';
import { Model, FindOptions, WhereOptions } from 'sequelize';

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
    const { page = 1, limit = 10, search = '{}', sort = 'createdAt', order = 'DESC' } = req.query;
  
    const options: FindOptions = {
      limit: parseInt(limit as string),
      offset: (parseInt(page as string) - 1) * parseInt(limit as string),
      order: [[sort as string, order as string]],
    };
  
    // Parse search query (e.g., '{"name": "John", "email": "rozey247@gmail.com"}')
    let parsedSearch = {};
    try {
      parsedSearch = JSON.parse(search as string);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid search format' });
    }
  
    if (Object.keys(parsedSearch).length > 0) {
      options.where = parsedSearch;
    }
  
    try {
      const result = await this.model.findAndCountAll(options);
      res.json({
        data: result.rows,
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
  async updateById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const [updated] = await this.model.update(req.body, { where: { id } });
      if (!updated) {
        return res.status(404).json({ message: 'Record not found or not updated' });
      }
      const updatedRecord = await this.model.findByPk(id);
      res.json(updatedRecord);
    } catch (error) {
      res.status(500).json({ message: 'Error updating record', error });
    }
  }

  // Delete By ID
  async deleteById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deleted = await this.model.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ message: 'Record not found or not deleted' });
      }
      res.json({ message: 'Record deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting record', error });
    }
  }
}

export default GenericCRUDUtil;
