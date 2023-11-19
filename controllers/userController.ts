import { Request, Response } from "express"
import User from "../models/user"
import Portfolio from "../models/portfolio"
import jwt from "jsonwebtoken"

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    const portfolio = await Portfolio.create()
    const user = await User.create({ username, password })

    await user.setPortfolio(portfolio)
    await portfolio.setUser(user)

    res.status(201).json(user)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: "Something went wrong" })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ where: { username } })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (!user.validatePassword(password)) {
      return res.status(401).json({ error: "Invalid password" })
    }

    // TODO: Create an env variable for the secret
    const token = jwt.sign({ ...user }, "secret")

    res.status(200).json({ token })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: "Something went wrong" })
  }
}

// TODO: Move this to the normal login
export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password, secret } = req.body

    if (secret !== "secret") {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const portfolio = await Portfolio.create()
    const user = await User.create({ username, password, role: "admin" })

    await user.setPortfolio(portfolio)
    await portfolio.setUser(user)

    res.status(201).json(user)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: "Something went wrong" })
  }
}
