import { Request, Response } from "express"
import Stock from "../models/stock"
import getUser from "../utils/getUserId"
import Transaction from "../models/transactions"
import { checkIfHourPassed } from "../utils"

// TODO: error handling to clean up the code
// TODO: getters, setters and triggers for portfolio. Right now, this is a mess

export const depositMoney = async (req: Request, res: Response) => {
  try {
    const amount = req.body.amount

    const user = await getUser(req)

    const portfolio = await user?.getPortfolio()

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" })
    }

    if (amount < 0) {
      return res.status(400).json({ error: "Amount must be positive" })
    }

    portfolio.balance += amount

    await portfolio.save()

    return res.status(200).json(portfolio)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: "Something went wrong" })
  }
}

export const withdrawMoney = async (req: Request, res: Response) => {
  try {
    const amount = req.body.amount

    const user = await getUser(req)

    const portfolio = await user?.getPortfolio()

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" })
    }

    if (portfolio.balance < amount) {
      return res.status(400).json({ error: "Not enough money" })
    }

    if (amount < 0) {
      return res.status(400).json({ error: "Amount must be positive" })
    }

    portfolio.balance -= amount

    await portfolio.save()

    return res.status(200).json(portfolio)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: "Something went wrong" })
  }
}

export const buyStock = async (req: Request, res: Response) => {
  try {
    const stockSymbol = req.body.stockSymbol
    const stockAmount = req.body.stockAmount

    const user = await getUser(req)

    const portfolio = await user?.getPortfolio()
    const stock = await Stock.findOne({ where: { symbol: stockSymbol } })

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" })
    }
    if (!stock) {
      return res.status(404).json({ error: "Stock not found" })
    }
    if (portfolio.balance < stock.price * stockAmount) {
      return res.status(400).json({ error: "Not enough money" })
    }
    if (stock.shares < stockAmount) {
      return res.status(400).json({ error: "Not enough shares" })
    }

    // if pStock exists, update it
    const pStocks = await portfolio.getPStocks()

    const pStock = pStocks.find((pStock) => {
      return pStock?.StockId === stock.id
    })

    Transaction.create({
      stock: stockSymbol,
      quantity: stockAmount,
      price: stock.price,
      balance: portfolio.balance,

      type: "buy",
    }).then((transaction) => {
      transaction.setPortfolio(portfolio)
    })

    if (pStock) {
      pStock.ownedShares += stockAmount
      await pStock.save()
      portfolio.balance -= stock.price * stockAmount
      stock.shares -= stockAmount
      await stock.save()
      await portfolio.save()
      Transaction.create({
        stock: stockSymbol,
        quantity: stockAmount,
        price: stock.price,
        balance: portfolio.balance,
        type: "buy",
      }).then((transaction) => {
        transaction.setPortfolio(portfolio)
      })
      return res.status(200).json(pStock)
    }
    // if pStock doesn't exist, create it
    const newPStock = await portfolio.createPStock({
      avgPrice: stock.price,
      ownedShares: stockAmount,
    })

    newPStock?.setStock(stock)

    portfolio.balance -= stock.price * stockAmount
    stock.shares -= stockAmount
    Transaction.create({
      stock: stockSymbol,
      quantity: stockAmount,
      price: stock.price,
      balance: portfolio.balance,

      type: "buy",
    }).then((transaction) => {
      transaction.setPortfolio(portfolio)
    })

    await portfolio.save()
    await stock.save()

    return res.status(200).json(newPStock)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: "Something went wrong" })
  }
}

export const sellStock = async (req: Request, res: Response) => {
  try {
    const stockSymbol = req.body.stockSymbol
    const stockAmount = req.body.stockAmount
    const sellPrice = req.body.sellPrice

    if (stockAmount < 0) {
      return res.status(400).json({ error: "Amount must be positive" })
    }

    if (sellPrice < 0) {
      return res.status(400).json({ error: "Price must be positive" })
    }

    const user = await getUser(req)

    const portfolio = await user?.getPortfolio()
    const stock = await Stock.findOne({ where: { symbol: stockSymbol } })

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" })
    }
    if (!stock) {
      return res.status(404).json({ error: "Stock not found" })
    }

    if (stock.updatedAt && !checkIfHourPassed(stock.updatedAt)) {
      return res.status(400).json({ error: "Can't sell stock yet" })
    }

    const pStocks = await portfolio.getPStocks()

    const pStock = pStocks.find((pStock) => {
      return pStock?.StockId === stock.id
    })

    if (!pStock) {
      return res.status(404).json({ error: "PStock not found" })
    }
    if (pStock.ownedShares < stockAmount) {
      return res.status(400).json({ error: "Not enough shares" })
    }

    portfolio.balance += stock.price * sellPrice
    stock.shares += stockAmount
    stock.price = sellPrice

    await portfolio.save()
    await stock.save()

    pStock.ownedShares -= stockAmount

    Transaction.create({
      stock: stockSymbol,
      quantity: stockAmount,
      balance: portfolio.balance,
      price: stock.price,
      type: "sell",
    }).then((transaction) => {
      transaction.setPortfolio(portfolio)
    })

    if (pStock.ownedShares === 0) {
      await pStock.destroy()
      return res.status(200).json({ message: "PStock deleted" })
    }

    await pStock.save()

    return res.status(200).json(pStock)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: "Something went wrong" })
  }
}
