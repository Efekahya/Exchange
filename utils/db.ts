import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config()

const USER = process.env.PGUSER
const PASS = process.env.PGPASSWORD
const HOST = process.env.PGHOST
const PORT = process.env.PGPORT
const NAME = process.env.PGNAME

if (!USER || !PASS || !HOST || !PORT || !NAME) {
  throw new Error("Missing database credentials. Check .env file.")
}

const sequelize = new Sequelize("postgres", USER, PASS, {
  host: HOST,
  dialect: "postgres",
  port: Number(PORT),
  define: {
    freezeTableName: true,
  },
  logging: false,
})

try {
  sequelize.query(
    `SELECT 'CREATE DATABASE ${NAME}' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${NAME}')`
  )
} catch (error) {
  console.error("Unable to create database:", error)
}

export default sequelize
