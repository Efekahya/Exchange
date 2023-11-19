import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"
import sequelize from "../utils/db"

class Stock extends Model<
  InferAttributes<Stock>,
  InferCreationAttributes<Stock>
> {
  declare id: CreationOptional<number>
  declare symbol: string
  declare shares: number
  declare price: number

  declare createdAt?: CreationOptional<Date>
  declare updatedAt?: CreationOptional<Date>
}

Stock.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    shares: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    sequelize,
  }
)

export default Stock
