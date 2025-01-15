import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
// Define the User model
export class User extends Model {
  public id!: string; // Primary Key
  public firstname!: string;
  public lastname!: string;
  public email!: string;
  public gender!: string;
  public address!: string;
  public phonenumber!: string;
  public password!: string;
  public role!: string;
  public companyName?: string;
}

// Initialize the User model
User.init(
  {
    id: {
      type: DataTypes.STRING,
      autoIncrement: true,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'dealer'),
      allowNull: false,
      defaultValue: 'user'
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: "users", // Table name in the database
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

export default User;
