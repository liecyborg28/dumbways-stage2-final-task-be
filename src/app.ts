import express, { Request, Response, NextFunction } from "express";
import { corsMiddleware } from "./middlewares/cors";
import path from "path";
import limiter from "./middlewares/limiter";
import { default as authRouter } from "./routes/auth";
import { default as productRouter } from "./routes/product";
import { default as userRouter } from "./routes/user";
import { default as orderRouter } from "./routes/order";
import { authenticate, authorize } from "./middlewares/auth";

const app = express();

app.use(corsMiddleware);

app.use(express.json());

// app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(limiter);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", authenticate, authorize("admin"), productRouter);
app.use("/api/v1/users", authenticate, userRouter);
app.use("/api/v1/orders", authenticate, orderRouter);

// middleware error handler (paling bawah)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error middleware:", err);

  res.status(err.status || 500).json({
    code: err.status || 500,
    status: "error",
    message: err.message || "Internal server error",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`server is running on ${process.env.PORT}`);
});
