import express from "express";
import { handleRegister, handleLogin, handleReset } from "../controllers/auth";
import { uploads } from "../utils/multer";

const router = express.Router();

router.post("/register", uploads.single("image"), handleRegister);
router.post("/login", handleLogin);
router.patch("/reset", handleReset);
router.get("/me", (req, res) => {
  res.json({ message: "Hello World!" });
});

export { router as default, router };
