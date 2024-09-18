import express from "express";
import { test, updateProfile, getUser, deleteProfile } from "../controllers/user.cont.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/', test);
router.get('/:id', getUser);
router.post('/update/:id', verifyToken, updateProfile);
router.delete('/delete/:id', verifyToken, deleteProfile);

export default router;