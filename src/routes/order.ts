import express from "express";
import {
  handleCreateOrder,
  handleGetOrders,
  handleGetOrdersByUser,
} from "../controllers/order";
import { authorize } from "../middlewares/auth";

const router = express.Router();

router
  .route("/")
  .get(authorize("admin"), handleGetOrders)
  .post(handleCreateOrder);
router.get("/user", handleGetOrdersByUser);

export { router as default, router };
