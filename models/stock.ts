import { DataTypes } from "sequelize"
import sequelize from "../utils/db"
import Portfolio from "./portfolio"

const Stock = sequelize.define("Stock", {
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
  total: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue("shares") * this.getDataValue("price")
    },
    set() {
      throw new Error("Do not try to set the `total` value!")
    },
  },
})

Stock.hasOne(Portfolio)

export default Stock
