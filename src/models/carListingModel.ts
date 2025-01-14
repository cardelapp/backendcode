import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db"; // Import your database configuration
import { Transmission, BodyStyle, Condition, FuelType, Status } from "../enums";
import { User } from "."
// Define the User model
export class CarListing extends Model {
    public id!: number; // Primary Key
    public title!: string;
    public description!: string;
    public price!: number;
    public make!: string;
    public model!: string;
    public year!: number;
    public mileage!: number;
    public fuelType!: FuelType;
    public color!: string;
    public condition!: Condition;
    public images!: string[]; 
    public location!: string;
    public status!: Status;
    public transmission!: Transmission;
    public bodyStyle!: BodyStyle
    public dealerId!: number;
}

// Initialize the User model
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
        type: DataTypes.ENUM,
        values: Object.values(FuelType),
        allowNull: false,
      },
      transmission: {
        type: DataTypes.ENUM,
        values: Object.values(Transmission),
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      condition: {
        type: DataTypes.ENUM,
        values: Object.values(Condition),
        allowNull: false,
      },
      images: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(),
        values: Object.values(Status),
        allowNull: false,
        defaultValue: Status.Available,
      },
      dealerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      tableName: "carListings", 
      timestamps: true, 
    }
  );
  
  // Associating with the User model...
  CarListing.belongsTo(User, { foreignKey: "dealerId", as: "dealer" });
  User.hasMany(CarListing, { foreignKey: "dealerId", as: "carListings" });
  
  export default CarListing;