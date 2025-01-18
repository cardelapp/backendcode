import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { User } from "./userModel";

export class CarListing extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public price!: number;
  public make!: string;
  public model!: string;
  public year!: number;
  public mileage!: number;
  public fuelType!: string;
  public color!: string;
  public condition!: string;
  public images!: string[];
  public location!: string;
  public status!: string;
  public transmission!: string;
  public bodyStyle!: string;
  public dealerId!: number;
}

CarListing.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mileage: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    fuelType: {
      type: DataTypes.ENUM('Petrol', 'Diesel', 'Electric'),  // ENUM kept
      allowNull: false,
    },
    transmission: {
      type: DataTypes.ENUM('Automatic', 'Manual'),  // ENUM kept
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    condition: {
      type: DataTypes.ENUM('New', 'Used', 'Refurbished'),  // ENUM kept
      allowNull: false,
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('images');
        return value ? JSON.parse(value) : [];
      },
      set(value: string[]) {
        this.setDataValue('images', JSON.stringify(value));
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Available', 'Sold', 'Inactive'),  // ENUM kept
      allowNull: false,
      defaultValue: 'Available',
    },
    dealerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "carListings",
    timestamps: true,
  }
);

// Define Associations
CarListing.belongsTo(User, { foreignKey: "dealerId", as: "dealer" });
User.hasMany(CarListing, { foreignKey: "dealerId", as: "carListings" });

export default CarListing;
