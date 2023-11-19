import {
  Association,
  CreationOptional,
  DataTypes,
  HasOneSetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize"
import sequelize from "../utils/db"
import Portfolio from "./portfolio"

class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction>
> {
  declare id: CreationOptional<number>
  declare balance: CreationOptional<number>
  declare stock: CreationOptional<string>
  declare quantity: CreationOptional<number>
  declare price: CreationOptional<number>
  declare type: CreationOptional<string>

  declare portfolio?: NonAttribute<Portfolio>

  declare setPortfolio: HasOneSetAssociationMixin<Portfolio, Portfolio["id"]>

  declare static associations: {
    portfolio: Association<Transaction, Portfolio>
  }
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    stock: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
  }
)

export default Transaction
