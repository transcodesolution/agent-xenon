import express from 'express';
import { login } from "../controllers/auth/auth";

const router = express.Router();

router.post("/login", login);

export const authRouter = router;