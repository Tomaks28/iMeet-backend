import { Router } from "express";
import { Bearer } from "../validators";
import { UserModel } from "../models";
import cloudinary from "cloudinary";
import { removeUserPasswordInfo } from "../utilities";

const router = Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Endpoint de publication d'une photo sur cloudinary
router.post("/cloudinary/upload", Bearer, async (req: Request | any, res) => {
  try {
    const user = await UserModel.findOne({ token: req.token });
    if (user) {
      cloudinary.v2.uploader.upload(
        req.files.image.path,
        {
          // on peut préciser un dossier dans lequel stocker l'image
          folder: "iMeet/" + user._id,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.log("cloudinary error");
            return res.status(400).send("Cloudinary error");
          } else {
            if (result) {
              user.pictures.push(result.secure_url);
              user.save();
            }
            return res.send(removeUserPasswordInfo(user));
          }
        }
      );
    } else {
      return res.send("User don't exists!");
    }
  } catch (err) {
    return res
      .status(500)
      .send({ message: "[Server] Cloudinary upload error" });
  }
});

export const CloudinaryRoutes = router;
