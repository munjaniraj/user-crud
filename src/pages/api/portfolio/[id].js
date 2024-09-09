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
    fileSize: 4000 * 1024 * 1024,
  },
});

const checkPreviousImage = async (id) => {
  const data = await portfolio.findById(id);
  if (!data) {
    throw new Error("Document not found");
  } else {
    const getMainImagePath = data.mainImage;
    const getTabImagePath = data.tabImage;
    const mainImageName = getMainImagePath[getMainImagePath.length - 1];
    const tabImageName = getTabImagePath[getTabImagePath.length - 1];
    return { mainImageName, tabImageName };
  }
};

const findImageAndDelete = async (previousImage) => {
  try {
    const mainImagePath = path.join(UPLOAD_DIR, previousImage.mainImageName);
    const tabImagePath = path.join(UPLOAD_DIR, previousImage.tabImageName);

    if (mainImagePath && tabImagePath) {
      await fs.access(mainImagePath);
      await fs.access(tabImagePath);

      // Delete images
      await fs.unlink(mainImagePath);
      await fs.unlink(tabImagePath);
    } else {
      throw new Error("Image not found or could not be deleted");
    }
  } catch (error) {
    throw new Error(error);
  }
};

const handleFileUpload = async (req) => {
  return new Promise((resolve, reject) => {
    upload.fields([
      { name: "mainImage", maxCount: 1 },
      { name: "tabImage", maxCount: 1 },
    ])(req, {}, async (err) => {
      if (err) {
        reject(err);
      } else {
        const mainImagePath = req.files.mainImage
          ? req.files.mainImage[0].filename
          : undefined;
        const tabImagePath = req.files.tabImage
          ? req.files.tabImage[0].filename
          : undefined;
        resolve({ mainImagePath, tabImagePath });
      }
    });
  });
};

export default async function handler(req, res) {
  dbConnect();
  const {
    method,
    query: { id },
  } = req;

  switch (method) {
    case "GET":
      try {
        const data = await portfolio.findById(id);
        if (!data) {
          return res
            .status(400)
            .json({ success: false, message: "Bad request" });
        }
        res.status(200).json({ success: true, data });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      break;

    case "PUT":
      try {
        await ensureUploadDirectory(UPLOAD_DIR);
        const uploadImagePath = await handleFileUpload(req);
        const fieldsToUpdate = {
          title: req.body.title,
          description: req.body.description,
        };

        if (uploadImagePath.mainImagePath && uploadImagePath.tabImagePath) {
          fieldsToUpdate.mainImage = uploadImagePath.mainImagePath;
          fieldsToUpdate.tabImage = uploadImagePath.tabImagePath;
        }

        const previousImage = await checkPreviousImage(id);
        const portfolioData = await portfolio.findByIdAndUpdate(
          id,
          fieldsToUpdate,
          {
            new: true,
            runValidators: true,
          }
        );

        if (!portfolioData) {
          return res
            .status(400)
            .json({ success: false, message: "Failed to update" });
        }

        if (uploadImagePath.tabImagePath && uploadImagePath.mainImagePath) {
          await findImageAndDelete(previousImage.mainImage);
          await findImageAndDelete(previousImage.tabImage);
        }

        res
          .status(200)
          .json({ success: true, message: "Updated successfully" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "DELETE":
      try {
        await ensureUploadDirectory(UPLOAD_DIR);
        const deletePortfolio = await portfolio.deleteOne({ _id: id });
        if (!deletePortfolio) {
          return res
            .status(400)
            .json({ success: false, message: "Bad request" });
        }
        res
          .status(200)
          .json({ success: true, message: "Deleted successfully" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
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
