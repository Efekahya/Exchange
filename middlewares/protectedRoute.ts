import { NextFunction, Request, Response } from "express"
import User from "../models/user"
import jwt from "jsonwebtoken"

export const validateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const id = (jwt.verify(token, "secret") as User).dataValues.id

    const user = await User.findOne({ where: { id } })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    next()
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(400)
        .json({ error: error.message, location: "validateJWT" })
    }
    res.status(500).json({ error: "Something went wrong" })
  }
}

export const validateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const id = (jwt.verify(token, "secret") as User).dataValues.id

    const user = await User.findOne({ where: { id } })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (user.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" })
    }

    next()
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(400)
        .json({ error: error.message, location: "validateAdmin" })
    }
    res
      .status(500)
      .json({ error: "Something went wrong", location: "validateAdmin" })
  }
}
