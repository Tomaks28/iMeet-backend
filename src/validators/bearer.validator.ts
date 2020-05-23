import { NextFunction, Request, Response } from "express";

export const Bearer = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  // On vérifie dans la base si le token (user) existe
  const bearer = req.headers.authorization;
  if (bearer) {
    const token = bearer.split(" ")[1];
    if (token) {
      req.token = token;
      next();
      return;
    }
  } else {
    res.status(401).send({
      error: "Invalid Token",
    });
  }
};
