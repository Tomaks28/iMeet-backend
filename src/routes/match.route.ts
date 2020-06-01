import { Router } from "express";
import { Bearer } from "../validators";
// import { UserModel, MatchModel } from "../models";
import { UserModel, IMatch } from "../models";

const router = Router();

// Endpoint de récupération du discover
router.post("/match", Bearer, async (req: Request | any, res) => {
  try {
    const user = await UserModel.findOne({ token: req.token });
    if (user) {
      if (req.fields.id && req.fields.reaction) {
        const id = req.fields.id.toString();
        const reaction = req.fields.reaction;

        if (reaction) {
          const result = user.likes.filter((item) => item.id.toString() !== id);
          result.push({ id, reaction } as any);
          user.likes = result;
        } else {
          const result = user.dislikes.filter(
            (item) => item.id.toString() !== id
          );
          result.push({ id, reaction } as any);
          user.dislikes = result;
        }
        user.save();

        // user.likes.push({
        //   id: req.fields.id,
        //   reaction: req.fields.reaction,
        // } as IMatch);
        // console.log(user);
        // if (reaction) {
        // }
        // const match = await MatchModel.findOne({
        //   $or: [
        //     { $and: [{ id1 }, { id2 }] },
        //     { $and: [{ id1: id2 }, { id2: id1 }] },
        //   ],
        // });
        // Check if match already occurs
        // if (match) {
        // } else {
        // }

        return res.send();
      } else {
        return res.send("ID doesn't exists!");
      }
    } else {
      return res.send("User don't exists!");
    }
  } catch (err) {
    return res.status(500).send({ message: "[Server] Match error" });
  }
});

export const matchRoutes = router;
