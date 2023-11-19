import express, { Express } from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import sequelize from "./utils/db"
import userRouter from "./routes/user"
import stockRouter from "./routes/stock"
import portfolioRouter from "./routes/portfolio"
import Portfolio from "./models/portfolio"
import { validateAdmin, validateJWT } from "./middlewares/protectedRoute"
import Stock from "./models/stock"
import User from "./models/user"
import Transaction from "./models/transactions"

dotenv.config()

const app: Express = express()
const port = process.env.PORT

export const createBulk = async () => {
  const initialUsers = await User.findAll()
  const users = await User.bulkCreate(
    [
      {
        username: "admin",
        password: "admin",
        role: "admin",
      },
      {
        username: "user",
        password: "user",
      },
      {
        username: "user2",
        password: "user2",
      },
      {
        username: "user3",
        password: "user3",
      },
      {
        username: "user4",
        password: "user4",
      },
    ],
    {
      returning: ["id"],
      ignoreDuplicates: true,
    }
  )

  await Stock.bulkCreate(
    [
      {
        symbol: "AAPL",
        shares: 10000,
        price: 100.0,
      },
      {
        symbol: "GOOG",
        shares: 10000,
        price: 100.0,
      },
      {
        symbol: "TSLA",
        shares: 10000,
        price: 100.0,
      },
      {
        symbol: "AMZN",
        shares: 10000,
        price: 100.0,
      },
      {
        symbol: "FB",
        shares: 10000,
        price: 100.0,
      },
    ],
    {
      ignoreDuplicates: true,
    }
  )

  users
    .filter((user) => !initialUsers.some((u) => u.id === user.id) && user.id)
    .forEach(async (user, index) => {
      const portfolio = await Portfolio.create({
        balance: index * 1000,
      })
      Transaction.create({
        stock: "AAPL",
        quantity: 10,
        price: index * 10,
        balance: portfolio.balance - index * 10,
        type: "buy",
      }).then((transaction) => {
        transaction.setPortfolio(portfolio)
      })
      await user.setPortfolio(portfolio)
    })
}

const connectDb = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    await createBulk()
    console.log("Connection has been established successfully.")
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}

app.use(express.json())
app.use(morgan("dev"))

app.use("/user", userRouter)
app.use("/stock", validateAdmin, stockRouter)
app.use("/portfolio", validateJWT, portfolioRouter)

app.listen(port, () => {
  connectDb()
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
