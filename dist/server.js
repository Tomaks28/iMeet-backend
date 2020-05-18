"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
app.get("/", (req, res) => {
    res.send("Hi");
});
app.all("*", (req, res) => {
    res.send("Route doesn't exist");
    console.log("here");
});
app.listen(3000, () => {
    console.log("Server has started");
});
