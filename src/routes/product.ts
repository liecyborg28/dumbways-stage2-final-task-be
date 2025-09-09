import express from "express";
import {
  handleCreateProduct,
  handleGetProducts,
  handleUpdateProduct,
  handleRestoreProduct,
  handleDeleteProduct,
  handleUploadProductImage,
} from "../controllers/product";
import { uploads } from "../utils/multer";

const router = express.Router();

router
  .route("/")
  .get(handleGetProducts)
  .patch(handleUpdateProduct)
  .post(uploads.single("image"), handleCreateProduct);

router.patch("/:id/upload", uploads.single("image"), handleUploadProductImage);
router.patch("/:id/delete", handleDeleteProduct);
router.patch("/:id/restore", handleRestoreProduct);

export { router as default, router };
