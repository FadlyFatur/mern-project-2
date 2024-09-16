import express from "express";
import { signUp, test, signIn, google } from "../controllers/auth.cont.js";

const router = express();

router.get("/", test);
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/google", google);

export default router;