import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { OrderStatus } from "../enums";
import { User, CarListing } from ".";

export class Order extends Model {
  public orderId!: number;
  public carListingId!: number;
  public userId!: number;
  public orderDate!: Date;
  public status!: OrderStatus;
  public paymentRef!: string;
}

Order.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    carListingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CarListing, 
        key: "id",
      },
      onDelete: "CASCADE",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, 
        key: "id",
      },
      onDelete: "CASCADE",
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),  // Spread ENUM values
      allowNull: false,
      defaultValue: OrderStatus.Pending,
    },
    paymentRef: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: "orders",
    timestamps: true,
  }
);

Order.belongsTo(CarListing, { foreignKey: "carListingId", as: "carListing" });
CarListing.hasMany(Order, { foreignKey: "carListingId", as: "orders" });

Order.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Order, { foreignKey: "userId", as: "orders" });

export default Order;
