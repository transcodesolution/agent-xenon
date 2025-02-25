import express from 'express';
import { login } from "../controllers/auth/auth";

const router = express.Router();

router.post("/signin", login);

export const authRouter = router;