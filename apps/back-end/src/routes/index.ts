"use strict"
import { Request, Router, Response } from 'express'
import { JWT } from '../helper/jwt'
import { jobRoleRouter } from './job-roles'
import { authRouter } from './auth'
import { designationRouter } from './job-designation'
import { interviewQuestionAnswerRouter } from './interview-question-answer'
import { onBoardOrganization } from '../controllers/organization/organization'
import { organizationRouter } from './organization'
import { jobRouter } from './job'
import { applicantRouter } from './applicant'
import { RoleTypes } from '@agent-xenon/constants'

const router = Router()
const accessControl = (req: Request, res: Response, next: any) => {
    req.headers.userType = RoleTypes[req.originalUrl.split('/')[1]]
    next()
}

router.post("/onboard", onBoardOrganization);

router.use('/auth', authRouter)
router.use(JWT)
router.use('/jobRole', jobRoleRouter)
router.use('/designation', designationRouter)
router.use('/questionAnswer', interviewQuestionAnswerRouter)
router.use('/organization', organizationRouter)
router.use('/job', jobRouter)
router.use('/applicant', applicantRouter)
// router.use('/role', roleRouter)
// router.use('/module', moduleRouter)
// router.use('/permission', permissionRouter)

export { router }