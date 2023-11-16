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
    },
    shares: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
  }
)

export default Stock
