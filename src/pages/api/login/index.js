import dbConnect from "src/lib/dbConnect";
import user from "models/user";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import { SignJWT } from "jose";

export default async function handler(req, res) {
  dbConnect();
  const { method } = req;
  switch (method) {
    case "POST":
      try {
        const { email, password } = req.body;
        if (email && password) {
          const result = await user.findOne({ email }).lean();
          if (result) {
            const passwordMatch = bcrypt.compareSync(password, result.password);
            if (passwordMatch) {
              delete result.password; // remove password from result

              // create JWT token using json library
              const token = await new SignJWT({ result })
                .setProtectedHeader({ alg: "HS256", typ: "JWT" })
                .setIssuedAt()
                .setExpirationTime("24h") // Expires after 24 hours
                .sign(
                  new TextEncoder().encode(
                    process.env.NEXT_PUBLIC_SECRET_KEY_FOR_JWT
                  )
                );

              // serialize cookie for handling in the browser
              const serialised = serialize("JWTtoken", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 24 * 60 * 60, // 24 hours in seconds
                path: "/",
                // secure: true,
              });

              res.setHeader("Set-Cookie", serialised);

              return res.status(200).json({
                success: true,
                message: "Login successfully",
              });
            } else {
              return res.status(400).json({
                message: "Please Enter Valid Password.",
              });
            }
          } else {
            return res
              .status(404)
              .json({ message: "Please Enter Valid Email." });
          }
        } else {
          return res
            .status(400)
            .json({ message: "Email and Password are required fields." });
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
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
