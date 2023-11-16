import { DataTypes } from "sequelize"
import sequelize from "../utils/db"

const Portfolio = sequelize.define("Portfolio", {
  cash: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
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

export default Portfolio
