import { DataTypes } from "sequelize"
import bcrypt from "bcrypt"
import sequelize from "../utils/db"
import Portfolio from "./portfolio"
import Stock from "./stock"

const User = sequelize.define("User", {
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
})

User.hasOne(Portfolio)
User.belongsTo(Portfolio)

Portfolio.hasOne(User)
Portfolio.belongsTo(User)
Portfolio.hasMany(Stock)

Stock.hasOne(Portfolio)
Stock.belongsTo(Portfolio)

export default User
