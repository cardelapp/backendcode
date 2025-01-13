import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db"; // Import your database configuration
// Define the User model
class User extends Model {
  public id!: number; // Primary Key
  public firstname!: string;
  public lastname!: string;
  public email!: string;
  public gender!: string;
  public state!: string;
  public lga!: string;
  public address!: string;
  public directoridnumber!: string;
  public directordob!:string;
  public directoraddress!: string;
  public directorfirstname!: string;
  public directorlastname!: string;
  public phonenumber!: string;
  public directorstate!: string;
  public directorlga!: string;
  public idtype!: string;
  public password!: string;
  public businessname!: string;
  public businesscategory!: string;
  public tinnumber!: string;
  public bnnumber!: string;
  public files!: string[]; // Store file names or paths
}

// Initialize the User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
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
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lga: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    directoridnumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    directordob: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    directoraddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    directorfirstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    directorlastname: {
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
    directorstate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    directorlga: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idtype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businesscategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tinnumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bnnumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    files: {
      type: DataTypes.TEXT, // Array of file paths or names
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users", // Table name in the database
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

export default User;
