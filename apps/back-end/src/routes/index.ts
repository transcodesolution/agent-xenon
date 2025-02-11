"use strict"
import { Request, Router, Response } from 'express'
import { JWT } from '../helper/jwt'
import { ROLE_TYPES } from '@agent-xenon/constants'
import { jobRoleRouter } from './job-roles'
import { authRouter } from './auth'
import { designationRouter } from './job-designation'
import { interviewQuestionAnswerRouter } from './interview-question-answer'
import { onBoardOrganization } from '../controllers/auth/auth'

const router = Router()
const accessControl = (req: Request, res: Response, next: any) => {
    req.headers.userType = ROLE_TYPES[req.originalUrl.split('/')[1]]
    next()
}

router.post("/onboard", onBoardOrganization);

router.use('/auth', authRouter)
router.use(JWT)
router.use('/jobRole', jobRoleRouter)
router.use('/designation', designationRouter)
router.use('/questionAnswer', interviewQuestionAnswerRouter)
// router.use('/role', roleRouter)
// router.use('/module', moduleRouter)
// router.use('/permission', permissionRouter)

export { router }