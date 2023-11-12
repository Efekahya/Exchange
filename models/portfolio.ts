import { DataTypes } from "sequelize"
import sequelize from "../utils/db"
import User from "./user"

const Portfolio = sequelize.define("Portfolio", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cash: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  total: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue("cash") + this.getDataValue("Stock.total")
    },
    set() {
      throw new Error("Do not try to set the `total` value!")
    },
  },
})

Portfolio.hasOne(User)
Portfolio.belongsTo(User)

export default Portfolio
