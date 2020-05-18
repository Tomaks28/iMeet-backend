import { Router } from "express";

const router = Router();

router.all("*", function (req, res) {
  res.status(404).json({ error: "Not Found" });
});

export const defaultRoute = router;
