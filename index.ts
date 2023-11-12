import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import sequelize from "./utils/db"

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(express.json())
app.use(morgan("dev"))

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!")
})

const connectDb = async () => {
  try {
    sequelize.authenticate()
    console.log("Connection has been established successfully.")
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}

app.listen(port, () => {
  connectDb()
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})