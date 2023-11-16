import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  CreationOptional,
  DataTypes,
  Association,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
} from "sequelize"
import sequelize from "../utils/db"
import PStock from "./pStock"
import User from "./user"

class Portfolio extends Model<
  InferAttributes<Portfolio>,
  InferCreationAttributes<Portfolio>
> {
  declare id: CreationOptional<number>
  declare cash: CreationOptional<number>

  declare createPStock: HasManyCreateAssociationMixin<PStock>
  declare getPStocks: HasManyGetAssociationsMixin<PStock>

  declare static associations: {
    user: Association<Portfolio, User>
    pStocks: Association<Portfolio, PStock>
  }
}

Portfolio.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cash: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { sequelize }
)
Portfolio.hasMany(PStock)

export default Portfolio
