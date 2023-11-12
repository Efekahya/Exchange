import { Router } from "express"
import { createUser } from "../controllers/userController"

const userRouter = Router()

userRouter.route("/user").post(createUser)

export default userRouter
