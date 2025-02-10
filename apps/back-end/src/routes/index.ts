"use strict"
import { Request, Router, Response } from 'express'
import { JWT } from '../helper/jwt'
import { ROLE_TYPES } from '@agent-xenon/constants'
import { jobRoleRouter } from './jobRoles'
import { authRouter } from './auth'
import { onBoardOrganization } from '../controllers/auth/auth'
import { interviewRoundTypeRouter } from './interviewRoundTypes'

const router = Router()
const accessControl = (req: Request, res: Response, next: any) => {
    req.headers.userType = ROLE_TYPES[req.originalUrl.split('/')[1]]
    next()
}

router.post("/onboard", onBoardOrganization);

router.use('/auth', authRouter)
router.use(JWT)
router.use('/jobRole', jobRoleRouter)
router.use('/interviewRoundType', interviewRoundTypeRouter)
// router.use('/role', roleRouter)
// router.use('/module', moduleRouter)
// router.use('/permission', permissionRouter)

export { router }