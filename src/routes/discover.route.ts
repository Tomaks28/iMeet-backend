import { Router } from "express";
import { Bearer } from "../validators";
import { UserModel } from "../models";

const router = Router();

// Endpoint de récupération du discover
router.get("/discover", Bearer, async (req: Request | any, res) => {
  try {
    const user = await UserModel.findOne({ token: req.token });
    if (user) {
      const users = await UserModel.find({
        token: { $ne: req.token },
      });
      const filteredUsers = users.map((el) => {
        return {
          id: el._id,
          username: el.username,
          pictures: el.pictures,
          city: "Issy les moulineaux",
          state: "Haut de seine",
          age: 32,
        };
      });
      return res.send(filteredUsers);
    } else {
      return res.send("User don't exists!");
    }
  } catch (err) {
    return res.status(500).send({ message: "[Server] Discover error" });
  }
});

export const discoverRoutes = router;
