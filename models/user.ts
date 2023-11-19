import {
  Association,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasOneGetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize"
import bcrypt from "bcrypt"
import sequelize from "../utils/db"
import Portfolio from "./portfolio"

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>
  declare username: string
  declare password: string
  declare role: CreationOptional<"user" | "admin">

  declare portfolio?: NonAttribute<Portfolio>

  declare setPortfolio: BelongsToSetAssociationMixin<Portfolio, Portfolio["id"]>
  declare getPortfolio: HasOneGetAssociationMixin<Portfolio>

  declare static associations: {
    portfolio: Association<User, Portfolio>
  }

  get validatePassword() {
    return (password: string) => {
      return bcrypt.compareSync(password, this.password)
    }
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value: string) {
        if (!value) return
        const hash = bcrypt.hashSync(value, 10)
        this.setDataValue("password", hash)
      },
    },
  },
  { sequelize }
)

User.hasOne(Portfolio)

Portfolio.belongsTo(User)

export default User
