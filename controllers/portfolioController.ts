import { Request, Response } from "express"
import Portfolio from "../models/portfolio"
import Stock from "../models/stock"

// export const createPortfolio = async (req: Request, res: Response) => {
//   try {
//     const portfolio = await Portfolio.create({

//     })

//     res.status(201).json(portfolio)
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(400).json({ error: error.message })
//     }
//     res.status(500).json({ error: "Something went wrong" })
//   }
// }

export const addStockToPortfolio = async (req: Request, res: Response) => {
  try {
    // const { symbol, shares, price } = req.body
    // const { id } = req.params

    const portfolio = await Portfolio.findByPk(1)
    const stock = await Stock.findOne({ where: { symbol: "AAPL" } })
    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" })
    }
    if (!stock) {
      return res.status(404).json({ error: "Stock not found" })
    }

    await portfolio
      .createPStock({
        avgPrice: 100,
        ownedShares: 100,
      })
      .then((pStock) => {
        console.log("@@@", stock)
        pStock.setStock(stock)
        return res.status(201).json(pStock)
      })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: "Something went wrong" })
  }
}
