import { SHA256 } from "crypto-js";
import { Router } from "express";
import { v4 as uuid } from "uuid";
import validator from "validator";
import nodemailer from "nodemailer";
import { SignInValidator, SignUpValidator, Bearer } from "../validators";
import { UserModel } from "../models";
import { resetEmailHtml } from "../email";

const router = Router();

// Endpoint de récupération de tous les utilisateurs
router.get("/users", async (req, res) => {
  // le second object permet de récupérer que les champs voulus en les mettant à 1
  const users = await UserModel.find({}, { _id: 0, username: 1, email: 1 });
  return res.json(users);
});

// Endpoint de récupération d'un'utilisateur
router.get("/user", Bearer, async (req: Request | any, res) => {
  try {
    const user = await UserModel.findOne({ token: req.token });
    if (user) {
      return res.json({
        username: user.username,
        email: user.email,
        token: user.token,
        validated: user.validated,
      });
    }
    return res.status(400).json({ message: "[User] Not exists" });
  } catch (err) {
    return res.status(500).json({ message: "[User] Server getUser error" });
  }
});

// endpoint d'inscription d'un utilisateur
router.post("/user/signup", SignUpValidator, async (req: any, res: any) => {
  try {
    const user = await UserModel.findOne({ email: req.fields.email });
    if (user) {
      return res.status(400).json({ message: "[User] Already exists" });
    }
    const token = uuid();
    const salt = uuid();
    const hash = SHA256(req.fields.password + salt);
    const newUser = await UserModel.create({
      username: req.fields.username,
      email: req.fields.email,
      creationDate: new Date(),
      token,
      salt,
      hash,
      validated: false,
    });
    return res.json({ _id: newUser._id });
  } catch (err) {
    return res.status(500).json({ message: "[User] Serveur signup error" });
  }
});

// Endpoint de validation du compte utilisateur
router.get("/user/validation/:token", async (req, res) => {
  try {
    const { token } = req.params;
    if (token) {
      const user = await UserModel.findOne({ token });
      if (user) {
        user.validated = true;
        await user.save();
        res.send({ message: "[User] User account validated" });
      }
    } else {
      res.status(400).send({ message: "[User] Failed to validate account" });
    }
  } catch (err) {
    res.status(500).send({ error: "[User] Server account validation error" });
  }
});

// Endpoint de connexion d'un utilisateur
router.post("/user/signin", SignInValidator, async (req: any, res: any) => {
  try {
    const user = await UserModel.findOne({ email: req.fields.email });
    if (!user) {
      return res.status(400).json({ message: "[User] Not found" });
    }

    const authorize =
      SHA256(req.fields.password + user.salt).toString() === user.hash;
    if (!authorize) {
      return res.status(400).json({ message: "[User] Unauthorized" });
    }
    return res.json({
      _id: user._id,
      token: user.token,
      username: user.username,
    });
  } catch (err) {
    res.status(500).send({ error: "[User] Server signin error" });
  }
});

// Endpoint de reset du mot de passe d'un utilisateur
router.post("/user/reset", async (req: any, res: any) => {
  const { email } = req.fields;
  if (email) {
    if (validator.isEmail(email)) {
      const user = await UserModel.findOne({ email });
      if (user) {
        // Création du transporteur de mail
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
          },
        });
        // Options d'email
        var mailOptions = {
          from: process.env.NODEMAILER_EMAIL,
          to: email,
          subject: "Mot de passe oublié",
          // text: "That was easy!",
          html: resetEmailHtml(),
        };
        // Envoi du mail
        // **NOTE** Pour envoyer des mails. Allez dans google et autoriser 'Accès moins sécurisé des applications'
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        res.send({ message: "mail sent" });
      } else {
        res.status(400).send({ message: "[User] User not exists" });
      }
    }
  }
});

// // Endpoint de mise à jour d'un utilisateur
// router.post("/user/update", async (req: any, res) => {
//   const auth = req.headers.authorization;
//   const token = getBearer(auth);
//   const user = await UserModel.findOne({ token });
//   if (user) {
//     const { password, username } = req.fields;
//     if (password) {
//       user.hash = SHA256(password + user.salt).toString();
//     }
//     if (username) {
//       user.username = username;
//     }
//     await user.save();
//   }
//   return res.json(user);
// });

export const userRoutes = router;
