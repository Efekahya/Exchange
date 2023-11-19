import { Request } from "express"
import jwt from "jsonwebtoken"
import User from "../models/user"

const getUser = async (req: Request) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) {
    return
  }

  const id = (jwt.verify(token, "secret") as User).dataValues.id

  return await User.findOne({ where: { id } })
}

export default getUser
