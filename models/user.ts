import {
  Association,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"
import bcrypt from "bcrypt"
import sequelize from "../utils/db"
import Portfolio from "./portfolio"

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>
  declare username: string
  declare password: string

  declare portfolio?: ForeignKey<Portfolio["id"]>

  declare static associations: {
    portfolio: Association<User, Portfolio>
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
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

User.hasOne(Portfolio, {
  sourceKey: "id",
  foreignKey: "user",
})

User.belongsTo(Portfolio, {
  foreignKey: "portfolio",
})

export default User
