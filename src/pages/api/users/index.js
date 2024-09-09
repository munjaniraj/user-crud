import dbConnect from "src/lib/dbConnect";
import user from "models/user";
import bcrypt from "bcryptjs";
import customeMiddleware from "src/lib/customer_middleware";
import * as yup from "yup";
import { ResponseError } from "src/@core/utils/ResponseError";

const userModelValidation = yup.object({
  body: yup.object({
    email: yup
      .string()
      .email("Please send the valid email")
      .strict()
      .lowercase("Email must be in lowercase")
      .required(),
    password: yup
      .string()
      .min(6, "Password must be minumum 6 character")
      .max(10, "Passwrod not more then 10 character")
      .matches(
        /^(?=.*[A-Z])(?=(?:[^0-9]*\d){2})(?=.*[!@#$&*]).*$/,
        "Please ensure your password contains at least one uppercase character, a minimum of two numbers, and at least one special character."
      )
      .required(),
    name: yup.string().required("Name is required"),
    role: yup
      .mixed()
      .oneOf(
        ["HR", "Marketing"],
        "role must be one of the following values: HR, Marketing"
      ),
    privilegeAccess: yup
      .array()
      .min(1, "provide at leaset one privilegeAccess"),
  }),
});

async function handler(req, res) {
  dbConnect();
  const { method } = req;
  switch (method) {
    case "POST":
      const { email, password, name, role, privilegeAccess } = req.body;

      // check the validation of email and password
      await userModelValidation.validate({
        body: req.body,
      });

      const hashedPassword = await bcrypt.hash(password, 8);

      // check the email alredy exists or not
      const userExists = await user.findOne({ email });
      if (userExists) {
        throw new ResponseError("This Email already Exists");
      }

      // if user not exists then create new User
      const userInfo = new user({
        email,
        password: hashedPassword,
        name,
        role,
        privilegeAccess,
      });
      await userInfo.save();
      return res.status(201).json({ message: "User created successfully" });
      break;

    case "GET":
      const data = await user.find();
      if (!data) {
        throw new ResponseError("No data Found", 400);
      }
      return res.status(200).json({ success: true, data });
      break;

    default:
      throw new ResponseError("Invalid request method", 405);
  }
}

export default customeMiddleware(handler);
