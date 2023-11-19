import { Request, Response } from "express"
import User from "../models/user"
import Portfolio from "../models/portfolio"

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    const { id } = await Portfolio.create()
    const user = await User.create(
      { username, password, portfolio: id },
      {
        include: "Portfolio",
      }
    )
    Portfolio.update({ user: user.id }, { where: { id } })

    res.status(201).json(user)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: "Something went wrong" })
  }
}
