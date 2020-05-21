import { SHA256 } from "crypto-js";
import { Router } from "express";
import { v4 as uuid } from "uuid";
import validator from "validator";
import { SignInValidator, SignUpValidator, Bearer } from "../validators";
import { UserModel } from "../models";
import { sendResetEmail, sendConfirmationEmail } from "../email";

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
  // console.log("here");
  try {
    // Check if user already exists in db
    const user = await UserModel.findOne({ email: req.fields.email });
    if (user) {
      return res.status(400).send({ message: "Cet utilisateur existe déjà !" });
    }
    // Crypting password and storing in db
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
    // Sending confirmation email
    sendConfirmationEmail(
      req.fields.email,
      process.env.SERVER_URL + "/user/validation/" + token,
      req.fields.username,
      process.env.BACKOFFICE_URL + ""
    );
    // Reply to client with data
    return res.send({
      username: newUser.username,
      token: newUser.token,
      email: newUser.email,
    });
  } catch (err) {
    return res.status(500).send({ message: "[User] Serveur signup error" });
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
      return res.status(400).send({ message: "Cet utilisateur n'existe pas!" });
    }
    // Check if user password is the same than database
    const authorize =
      SHA256(req.fields.password + user.salt).toString() === user.hash;
    if (!authorize) {
      return res.status(400).send({ message: "Mot de passe incorrect" });
    }
    // Sending reply to client
    return res.send({
      _id: user._id,
      token: user.token,
      username: user.username,
      email: user.email,
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
        sendResetEmail(email);

        res.send({ message: "Nous vous avons envoyé un email." });
      } else {
        res.status(400).send({ message: "L'utilisateur n'existe pas" });
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
