"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const enums_1 = require("../enums");
const _1 = require(".");
class Order extends sequelize_1.Model {
}
exports.Order = Order;
Order.init({
    orderId: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    carListingId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: _1.CarListing,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: _1.User,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    orderDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(enums_1.OrderStatus)), // Spread ENUM values
        allowNull: false,
        defaultValue: enums_1.OrderStatus.Pending,
    },
    paymentRef: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize: db_1.default,
    tableName: "orders",
    timestamps: true,
});
Order.belongsTo(_1.CarListing, { foreignKey: "carListingId", as: "carListing" });
_1.CarListing.hasMany(Order, { foreignKey: "carListingId", as: "orders" });
Order.belongsTo(_1.User, { foreignKey: "userId", as: "user" });
_1.User.hasMany(Order, { foreignKey: "userId", as: "orders" });
exports.default = Order;
