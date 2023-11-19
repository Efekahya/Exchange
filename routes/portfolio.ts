import { Router } from "express"
import {
  buyStock,
  depositMoney,
  sellStock,
  withdrawMoney,
} from "../controllers/portfolioController"

const portfolioRouter = Router()

portfolioRouter.route("/buy").post(buyStock)
portfolioRouter.route("/sell").post(sellStock)
portfolioRouter.route("/deposit-money").post(depositMoney)
portfolioRouter.route("/withdraw-money").post(withdrawMoney)

export default portfolioRouter
