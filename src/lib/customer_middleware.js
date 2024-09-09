import { ResponseError } from "src/@core/utils/ResponseError";

const customeMiddleware = (handler) => {
  return async (req, res) => {
    try {
      // verify code
      if (!req.cookies.JWTtoken) {
        throw new ResponseError("You are not authorized", 401);
      }
      await handler(req, res);
    } catch (error) {
      res.status(error.statusCode ?? 500).json({
        message: error.message ?? "Something went wrong!",
        success: false,
      });
    }
  };
};

export default customeMiddleware;
