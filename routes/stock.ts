import { Router } from "express"
import { createStock } from "../controllers/stockController"

const stockRouter = Router()

stockRouter.route("/").post(createStock)

export default stockRouter
