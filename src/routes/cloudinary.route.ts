import { Router } from "express";
import { Bearer } from "../validators";
import { UserModel } from "../models";

const router = Router();

// Endpoint de publication d'une photo sur cloudinary
router.post("/cloudinary/upload", Bearer, async (req: Request | any, res) => {
  console.log(req.files);
  try {
    const user = await UserModel.findOne({ token: req.token });
    if (user) {
      return res.send("ok");
    }
    return res.send([]);
  } catch (err) {
    return res
      .status(500)
      .send({ message: "[Server] Cloudinary upload error" });
  }
});

export const CloudinaryRoutes = router;
