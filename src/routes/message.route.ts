import { Router } from "express";
import { Bearer } from "../validators";
import { UserModel, MessageModel } from "../models";

const router = Router();

// Endpoint de récupération d'un utilisateur
router.get("/messages", Bearer, async (req: Request | any, res) => {
  try {
    const user = await UserModel.findOne({ token: req.token });
    if (user) {
      const messages = await MessageModel.find().or([
        { from: user._id },
        { to: user._id },
      ]);
      return res.send(messages);
    }
    return res.send([]);
  } catch (err) {
    return res.status(500).send({ message: "getMessages Server error" });
  }
});

// Endpoint de connexion d'un utilisateur
router.post("/message", Bearer, async (req: any, res: any) => {
  try {
    const user = await UserModel.findOne({ token: req.token });
    if (user) {
      const newMessage = await MessageModel.create({
        from: req.fields.from,
        to: req.fields.to,
        createdAt: new Date(),
        message: req.fields.message,
      });
      return res.send({ message: "Message créé" });
    } else {
      return res
        .status(400)
        .send({ message: "Le message n'a pas pu être envoyé" });
    }
  } catch (err) {
    res.status(500).send({ error: "[User] Server signin error" });
  }
});

export const messageRoutes = router;
