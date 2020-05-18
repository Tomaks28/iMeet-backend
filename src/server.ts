import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import expressFormidable from "express-formidable";
import { realTimeManager } from "./web-socket";
import { dbConnect } from "./db";
import { userRoutes, defaultRoute } from "./routes";

// Import des variables d'environnement du fichier .env
dotenv.config();

// Configuration et démarrage du serveur
(async function () {
  // Connexion à la base de données Mongo
  await dbConnect();

  // Lancement de manager temps réel
  realTimeManager();

  const app = express();
  // Utilisation des middlewares
  app.use(expressFormidable());
  app.use(compression());
  app.use(cors());

  // Appel des différents endpoint du serveur
  app.use(userRoutes);
  app.use(defaultRoute);

  // Démarrage du serveur
  app.listen(process.env.SERVER_PORT, () => {
    console.log(`API running on port ${process.env.SERVER_PORT}`);
  });
})();
