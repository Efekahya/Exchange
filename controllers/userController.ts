import { Request, Response } from "express"
import User from "../models/user"
import { Error } from "sequelize"

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, portfolioid } = req.body

    const user = await User.create({ username, password, portfolioid })

    res.status(201).json(user)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(500).json({ error: "Something went wrong" })
  }
}
