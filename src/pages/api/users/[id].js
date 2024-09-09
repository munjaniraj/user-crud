import user from "models/user";
import { ResponseError } from "src/@core/utils/ResponseError";
import dbConnect from "src/lib/dbConnect";
import bcrypt from "bcryptjs";
import customeMiddleware from "src/lib/customer_middleware";

async function handler(req, res) {
  try {
    dbConnect();
    const {
      query: { id },
      method,
    } = req;

    switch (method) {
      case "GET":
        const Getdata = await user.findById(id);
        if (!Getdata) {
          throw new ResponseError("No data Found", 400);
        }
        res.status(200).json({ success: true, Getdata });
        break;

      case "PUT":
        const { password, newpassword } = req.body;
        const hashedPassword =
          newpassword && (await bcrypt.hash(newpassword, 10));
          const Getuserdata = await user.findById(id);
        if (newpassword) {
          const passwordMatch = await bcrypt.compare(
            password,
            Getuserdata.password
          );
          if (!passwordMatch) {
            throw new ResponseError("Old Password Doesn't match", 400);
          }
        }
        const data = await user.findByIdAndUpdate(
          id,
          newpassword ? { ...req.body, password: hashedPassword } : req.body,
          {
            new: true,
            runValidators: true,
          }
        );
        if (!data) {
          throw new ResponseError("No data Found", 400);
        }
        res.status(200).json({ success: true, data });
        break;

      case "DELETE":
        const deleteUsers = await user.deleteOne({ _id: id });
        if (!deleteUsers) {
          throw new ResponseError("No data Found", 400);
        }
        res.status(200).json({ success: true, deleteUsers });
        break;

      default:
        throw new ResponseError("Invalid request method", 405);
    }
  } catch (error) {
    // Handle errors here
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
}

export default customeMiddleware(handler);