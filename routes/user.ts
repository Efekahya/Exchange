import { Router } from "express"
import { login, register, registerAdmin } from "../controllers/userController"

const userRouter = Router()

userRouter.route("/register").post(register)
userRouter.route("/register-admin").post(registerAdmin)
userRouter.route("/login").post(login)

export default userRouter
