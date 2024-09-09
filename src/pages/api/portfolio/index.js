import dbConnect from "src/lib/dbConnect";
import portfolio from "models/portfolio";
import path from "path";
import fs from "fs/promises";
import multer from "multer";
import { ensureUploadDirectory } from "src/@core/utils/checkUploadDirectory";

const UPLOAD_DIR = path.join(process.cwd(), "./media/portfolio");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4000 * 1024 * 1024, // Max file size in bytes (4GB in this case)
  },
});

export default async function handler(req, res) {
  dbConnect();
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        await ensureUploadDirectory(UPLOAD_DIR);
        upload.fields([
          { name: "mainImage", maxCount: 1 },
          { name: "tabImage", maxCount: 1 },
        ])(req, res, async function (err) {
          if (err) {
            return res
              .status(400)
              .json({ success: false, message: err.message });
          }

          const { title, description } = req.body;
          if (
            !req.files.mainImage ||
            !req.files.tabImage ||
            !title ||
            !description
          ) {
            return res
              .status(400)
              .json({ success: false, message: "Missing required fields" });
          }
          await fs.chown(req.files.mainImage[0].path, 1000, 1000);
          await fs.chown(req.files.tabImage[0].path, 1000, 1000);
          const portfolioData = await new portfolio({
            title,
            description,
            mainImage: req.files.mainImage[0].path,
            tabImage: req.files.tabImage[0].path,
          });

          const result = await portfolioData.save();

          if (!result) {
            return res.status(400).json({ success: false });
          }

          res
            .status(200)
            .json({ success: true, message: "Added successfully" });
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "GET":
      try {
        const data = await portfolio.find();
        res.status(200).json({ success: true, data });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
      break;

    default:
      return res.status(400).json({
        success: false,
        message: "Invalid request method",
      });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
