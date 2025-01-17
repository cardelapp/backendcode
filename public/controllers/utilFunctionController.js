"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class GenericCRUDUtil {
    constructor(model) {
        this.model = model;
    }
    // Create
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newRecord = yield this.model.create(req.body);
                res.status(201).json(newRecord);
            }
            catch (error) {
                res.status(500).json({ message: 'Error creating record', error });
            }
        });
    }
    // Get All (Paginated)
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, search = '{}', sort = 'createdAt', order = 'DESC' } = req.query;
            const options = {
                limit: parseInt(limit),
                offset: (parseInt(page) - 1) * parseInt(limit),
                order: [[sort, order]],
            };
            // Parse search query (e.g., '{"name": "John", "email": "rozey247@gmail.com"}')
            let parsedSearch = {};
            try {
                parsedSearch = JSON.parse(search);
            }
            catch (error) {
                return res.status(400).json({ message: 'Invalid search format' });
            }
            if (Object.keys(parsedSearch).length > 0) {
                options.where = parsedSearch;
            }
            try {
                const result = yield this.model.findAndCountAll(options);
                res.json({
                    data: result.rows,
                    total: result.count,
                    page: parseInt(page),
                    pages: Math.ceil(result.count / parseInt(limit)),
                });
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching records', error });
            }
        });
    }
    // Get By ID
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const record = yield this.model.findByPk(id);
                if (!record) {
                    return res.status(404).json({ message: 'Record not found' });
                }
                res.json(record);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching record', error });
            }
        });
    }
    // Update By ID
    updateById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const [updated] = yield this.model.update(req.body, { where: { id } });
                if (!updated) {
                    return res.status(404).json({ message: 'Record not found or not updated' });
                }
                const updatedRecord = yield this.model.findByPk(id);
                res.json(updatedRecord);
            }
            catch (error) {
                res.status(500).json({ message: 'Error updating record', error });
            }
        });
    }
    // Delete By ID
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const deleted = yield this.model.destroy({ where: { id } });
                if (!deleted) {
                    return res.status(404).json({ message: 'Record not found or not deleted' });
                }
                res.json({ message: 'Record deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ message: 'Error deleting record', error });
            }
        });
    }
}
exports.default = GenericCRUDUtil;
