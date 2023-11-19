import { Request, Response } from "express"
import Stock from "../models/stock"

export const createStock = async (req: Request, res: Response) => {
  const { symbol, shares, price } = req.body

  try {
    const stock = await Stock.create({
      symbol,
      shares,
      price,
    })

    res.status(201).json(stock)
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: "Something went wrong" })
  }
}
