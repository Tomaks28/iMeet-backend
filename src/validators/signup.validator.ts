import { NextFunction, Request, Response } from "express";
import validator from "validator";

export const SignUpValidator = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, username } = req.fields;
    if (email && password && username) {
      if (validator.isEmail(email)) {
        next();
        return;
      }
    }
    res
      .status(400)
      .send({ message: "[email, password, username] fields are required !" });
  } catch (err) {
    console.log(err);
  }
};
