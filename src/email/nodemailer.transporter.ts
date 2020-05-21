import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Création du transporteur de mail
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});
