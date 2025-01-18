"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarListing = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const userModel_1 = require("./userModel");
class CarListing extends sequelize_1.Model {
}
exports.CarListing = CarListing;
CarListing.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    make: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    model: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    mileage: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    fuelType: {
        type: sequelize_1.DataTypes.ENUM('Petrol', 'Diesel', 'Electric'), // ENUM kept
        allowNull: false,
    },
    transmission: {
        type: sequelize_1.DataTypes.ENUM('Automatic', 'Manual'), // ENUM kept
        allowNull: false,
    },
    color: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    condition: {
        type: sequelize_1.DataTypes.ENUM('New', 'Used', 'Refurbished'), // ENUM kept
        allowNull: false,
    },
    images: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('images');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('images', JSON.stringify(value));
        },
    },
    location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('Available', 'Sold', 'Inactive'), // ENUM kept
        allowNull: false,
        defaultValue: 'Available',
    },
    dealerId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: userModel_1.User,
            key: "id",
        },
    },
}, {
    sequelize: db_1.default,
    tableName: "carListings",
    timestamps: true,
});
// Define Associations
CarListing.belongsTo(userModel_1.User, { foreignKey: "dealerId", as: "dealer" });
userModel_1.User.hasMany(CarListing, { foreignKey: "dealerId", as: "carListings" });
exports.default = CarListing;
