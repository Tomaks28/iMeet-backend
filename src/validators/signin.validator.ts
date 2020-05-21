import { NextFunction, Request, Response } from "express";
import validator from "validator";

export const SignInValidator = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.fields;
    if (email && password) {
      if (validator.isEmail(email)) {
        next();
        return;
      }
    }
    res
      .status(400)
      .send({
        message: "[email, mot de passe] Ces champs sont obligatoires !",
      });
  } catch (err) {
    console.log("error");
  }
};
