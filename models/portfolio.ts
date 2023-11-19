import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  CreationOptional,
  DataTypes,
  Association,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  NonAttribute,
  HasOneSetAssociationMixin,
} from "sequelize"
import sequelize from "../utils/db"
import PStock from "./pStock"
import User from "./user"
import Transaction from "./transactions"

class Portfolio extends Model<
  InferAttributes<Portfolio>,
  InferCreationAttributes<Portfolio>
> {
  declare id: CreationOptional<number>
  declare balance: CreationOptional<number>

  declare user?: NonAttribute<User>

  declare setUser: HasOneSetAssociationMixin<User, User["id"]>
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
    balance: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { sequelize }
)
Portfolio.hasMany(PStock)

Portfolio.hasOne(Transaction)
Transaction.belongsTo(Portfolio)

export default Portfolio
