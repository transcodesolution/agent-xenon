import { CronJob } from 'cron';
import { InterviewRoundStatus } from '@agent-xenon/constants';
import InterviewRound from '../../database/models/interview-round';
import { IInterviewRound, IJob } from '@agent-xenon/interfaces';
import { socketIo } from '../../helper/socket';
import { UpdateWriteOpResult } from 'mongoose';
import { updateApplicantStatusOnRoundComplete } from '../../utils/interview-round';

export default new CronJob('*/30 * * * *', async function () {
    try {
        const currentTime = new Date();

        const roundQuery = { deletedAt: null, status: { $in: [InterviewRoundStatus.ONGOING, InterviewRoundStatus.PAUSED] }, endDate: { $lt: currentTime } };

        const [interviewRound, interviewRoundId]: [IInterviewRound<IJob>[], string[], UpdateWriteOpResult] = await Promise.all([
            InterviewRound.find<IInterviewRound<IJob>>(roundQuery).populate('jobId', "organizationId"),
            InterviewRound.distinct('_id', roundQuery),
            InterviewRound.updateMany(roundQuery, { $set: { status: InterviewRoundStatus.COMPLETED } }),
        ]);

        const organizationId = [...new Set(interviewRound.map(round => round.jobId.organizationId.toString()))];

        await updateApplicantStatusOnRoundComplete<string[]>({ $in: interviewRoundId });

        if (organizationId.length > 0) {
            socketIo.to(organizationId).emit('round-status', {
                status: "completed",
                message: `${interviewRound[0].type} round is completed! You can check the status!`,
            });
        }
    } catch (error) {
        console.error('Error in checkForTechnicalRoundStatus:', error);
    }
}, null, false, 'Asia/Kolkata');