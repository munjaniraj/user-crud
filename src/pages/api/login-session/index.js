import { jwtVerify } from "jose";

export default async function handler(req, res) {
  try {
    if (!req.cookies.JWTtoken) {
      throw new Error("Unauthorzied user");
    }

    const { payload } = await jwtVerify(
      req.cookies.JWTtoken,
      new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY_FOR_JWT)
    );

    res.status(200).json({
      message: "User Authorized",
      userData: payload.result,
      isVerify: true,
    });
  } catch (error) {
    res.status(error.statusCode ?? 500).json({
      message: error.message ?? "Something went wrong!",
      success: false,
    });
  }
}
