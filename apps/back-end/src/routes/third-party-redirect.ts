import { Router } from "express";
import { googleAuthRedirectLogic } from "../controllers/app/app";

const router = Router();

router.get("/redirect", googleAuthRedirectLogic)

export const thirdPartyRedirectRouter = router;