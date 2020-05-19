import { Router } from "express";

const router = Router();

router.all("*", function (req, res) {
  res.status(404).json({ error: "[Router] Invalid route" });
});

export const defaultRoute = router;
