import { Router } from "express";
import { googleAuthRedirectLogic } from "../controllers/interview-rounds/interview-round";

const router = Router();

router.get("/redirect", googleAuthRedirectLogic)

export const thirdPartyRedirectRouter = router;