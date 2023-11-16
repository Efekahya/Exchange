import { Router } from "express"
import { createStock } from "../controllers/stockController"

const stockRouter = Router()

stockRouter.route("/stock").post(createStock)

export default stockRouter
