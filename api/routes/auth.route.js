import express from "express";
import { signUp, test } from "../controllers/auth.cont.js";

const router = express();

router.get("/", test);
router.post("/signup", signUp);

export default router;