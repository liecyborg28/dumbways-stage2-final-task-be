import express from "express";
import { handleTransferPoints, handleUploadProfile } from "../controllers/user";
import { uploads } from "../utils/multer";

const router = express.Router();

router.patch("/:id/upload", uploads.single("image"), handleUploadProfile);
router.patch("/transfer", handleTransferPoints);

export { router as default, router };
