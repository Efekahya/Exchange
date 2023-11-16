import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import sequelize from "./utils/db"
import userRouter from "./routes/user"
import stockRouter from "./routes/stock"
import portfolioRouter from "./routes/portfolio"
import Portfolio from "./models/portfolio"

dotenv.config()

const app: Express = express()
const port = process.env.PORT

const connectDb = async () => {
  try {
    sequelize.authenticate()
    sequelize.sync()
    console.log("Connection has been established successfully.")
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}

app.use(express.json())
app.use(morgan("dev"))

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!")
})

app.use(userRouter)
app.use(stockRouter)
app.use(portfolioRouter)

app.get("/test", async (req: Request, res: Response) => {
  const portfolio = await Portfolio.findByPk(1)

  portfolio?.getPStocks().then((pStocks) => {
    console.log(pStocks[0].dataValues)
    res.json(pStocks)
  })
})

app.listen(port, () => {
  connectDb()
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
