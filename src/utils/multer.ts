import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "src/uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const limits = { fileSize: 2 * 1024 * 1024 };
const fileFilter = (req: any, file: any, callback: any) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    callback(null, true);
  } else {
    callback({
      status: 400,
      message: "Only .jpeg, .jpg, and .png formats are allowed.",
    });
  }
};

export const uploads = multer({
  storage,
  limits,
  fileFilter,
});
