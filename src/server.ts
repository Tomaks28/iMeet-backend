import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import expressFormidable from "express-formidable";
import { dbConnect } from "./db";
import { defaultRoute } from "./routes";

// Import des variables d'environnement du fichier .env
dotenv.config();

// Configuration et démarrage du serveur
(async function () {
  // Connexion à la base de données Mongo
  await dbConnect();

  // Utilisation des middlewares
  const app = express();
  app.use(expressFormidable());
  app.use(compression());
  app.use(cors());

  // Appel des différents endpoint du serveur
  app.use(defaultRoute);

  // Démarrage du serveur
  app.listen(process.env.PORT, () => {
    console.log(`API running on port ${process.env.PORT}`);
  });
})();
