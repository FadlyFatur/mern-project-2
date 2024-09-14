import express from "express";
import { signUp, test, signIn } from "../controllers/auth.cont.js";

const router = express();

router.get("/", test);
router.post("/signup", signUp);
router.post("/signin", signIn);

export default router;