import { Router } from "express"
import { addStockToPortfolio } from "../controllers/portfolioController"

const portfolioRouter = Router()

portfolioRouter.route("/portfolio").post(addStockToPortfolio)

export default portfolioRouter
