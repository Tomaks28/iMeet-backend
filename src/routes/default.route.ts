import { Router } from "express";

const router = Router();

router.post("/", function (req, res) {
  res.status(404).send({ message: "Simple response" });
});

router.all("*", function (req, res) {
  res.status(404).send({ message: "[Router] Invalid route" });
});

export const defaultRoute = router;
