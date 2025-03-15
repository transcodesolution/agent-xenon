"use strict"
import { Router } from 'express'
import { JWT } from '../helper/jwt'
import { jobRoleRouter } from './job-roles'
import { authRouter } from './auth'
import { designationRouter } from './job-designation'
import { interviewQuestionAnswerRouter } from './interview-question'
import { onBoardOrganization } from '../controllers/organization/organization'
import { organizationRouter } from './organization'
import { jobRouter } from './job'
import { applicantRouter } from './applicant'
import { interviewRoundRouter } from './interview-round'
import { technicalRoundRouter } from './technical-round'
import { thirdPartyRedirectRouter } from './third-party-redirect'
import { documentRouter } from './document'
import { roleRouter } from './user-role'
import { userRouter } from './user'

const router = Router()
// const accessControl = (req: Request, res: Response, next: any) => {
//     req.headers.userType = RoleType[req.originalUrl.split('/')[1]]
//     next()
// }

router.post("/onboard", onBoardOrganization);
router.use("/google", thirdPartyRedirectRouter);

router.use('/auth', authRouter)
router.use(JWT)
router.use('/jobRole', jobRoleRouter)
router.use('/designation', designationRouter)
router.use('/questionAnswer', interviewQuestionAnswerRouter)
router.use('/organization', organizationRouter)
router.use('/job', jobRouter)
router.use('/applicant/exam', technicalRoundRouter)
router.use('/applicant', applicantRouter)
router.use('/interview-round', interviewRoundRouter)
router.use('/document', documentRouter)
router.use('/role', roleRouter)
router.use('/user', userRouter)

export { router }