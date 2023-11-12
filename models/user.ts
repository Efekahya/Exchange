import { DataTypes } from "sequelize"
import bcrypt from "bcrypt"
import sequelize from "../utils/db"

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
  portfolioid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
})

User.sync()
export default User
