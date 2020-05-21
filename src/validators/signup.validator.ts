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
    res.status(400).send({
      message:
        "[email, mot de passe, nom d'utilisateur] ces champs sont obligatoires !",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "SignUpValidator Error" });
  }
};
