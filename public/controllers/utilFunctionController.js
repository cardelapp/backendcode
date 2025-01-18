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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const userModel_1 = __importDefault(require("../models/userModel"));
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
            const { page = 1, limit = 10, search = '{}', sort = 'createdAt', order = 'DESC', minPrice, maxPrice } = req.query;
            const options = {
                limit: parseInt(limit),
                offset: (parseInt(page) - 1) * parseInt(limit),
                order: [[sort, order]],
            };
            // Parse search query (e.g., '{"color": "red", "brand": "toyota"}')
            let parsedSearch = {};
            try {
                parsedSearch = JSON.parse(search);
            }
            catch (error) {
                return res.status(400).json({ message: 'Invalid search format' });
            }
            // Add parsed search conditions to the where clause
            if (Object.keys(parsedSearch).length > 0) {
                options.where = Object.assign({}, parsedSearch);
            }
            // Add price range filter
            if (minPrice || maxPrice) {
                options.where = options.where || {};
                options.where['price'] = {};
                if (minPrice) {
                    options.where['price'][sequelize_1.Op.gte] = parseFloat(minPrice);
                }
                if (maxPrice) {
                    options.where['price'][sequelize_1.Op.lte] = parseFloat(maxPrice);
                }
            }
            try {
                const result = yield this.model.findAndCountAll(options);
                const updatedRows = yield Promise.all(result.rows.map((data) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield userModel_1.default.findOne({ where: { id: data.dealerId } });
                    data.dataValues.companyName = user ? user.companyName : 'Unknown';
                    return data;
                })));
                res.json({
                    data: updatedRows,
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
    updateById(reqBody, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [updated] = yield this.model.update(reqBody, { where: { id: id } });
                if (!updated) {
                    return ({ message: 'Record not found or not updated' });
                }
            }
            catch (error) {
                console.error({ message: 'Error updating record', error });
            }
        });
    }
    // Delete By ID
    deleteById(userId, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield this.model.destroy({ where: { dealerId: userId, id: itemId } });
                if (!deleted) {
                    return ({ message: 'Record not found or not deleted' });
                }
                return ({ message: 'Record deleted successfully' });
            }
            catch (error) {
                console.error({ message: 'Error deleting record', error });
            }
        });
    }
}
exports.default = GenericCRUDUtil;
