import {
  Association,
  CreationOptional,
  DataTypes,
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize"
import sequelize from "../utils/db"
import Stock from "./stock"

class PStock extends Model<
  InferAttributes<PStock>,
  InferCreationAttributes<PStock>
> {
  declare id: CreationOptional<number>
  declare ownedShares: number
  declare avgPrice: CreationOptional<number>

  declare stock?: NonAttribute<Stock>
  declare getStock: HasOneGetAssociationMixin<Stock>
  declare setStock: HasOneSetAssociationMixin<Stock, Stock["id"]>
  declare static associations: {
    stock: Association<PStock, Stock>
  }
}

PStock.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    ownedShares: {
      type: DataTypes.INTEGER,
    },
    avgPrice: {
      type: DataTypes.VIRTUAL,
      get() {
        this.getDataValue("avgPrice")
      },
      allowNull: false,
    },
  },
  {
    sequelize,
  }
)

PStock.belongsTo(Stock, {
  as: "portfolio",
})

PStock.belongsTo(Stock, {
  as: "stock",
})

export default PStock
