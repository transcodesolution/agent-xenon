import { CronJob } from 'cron';
import { InterviewRoundStatus } from '@agent-xenon/constants';
import InterviewRounds from '../../database/models/interview-round';
import { IInterviewRounds, IJob } from '@agent-xenon/interfaces';
import { socketIo } from '../../helper/socket';
import ApplicantRounds from '../../database/models/applicant-round';
import { UpdateWriteOpResult } from 'mongoose';

export default new CronJob('*/30 * * * *', async function () {
    try {
        const currentTime = new Date();

        const roundQuery = { deletedAt: null, status: InterviewRoundStatus.ONGOING, endDate: { $lt: currentTime } };

        const [interviewRound, interviewRoundId]: [IInterviewRounds<IJob>[], string[], UpdateWriteOpResult] = await Promise.all([
            InterviewRounds.find<IInterviewRounds<IJob>>(roundQuery).populate('jobId', "organizationId"),
            InterviewRounds.distinct('_id', roundQuery),
            InterviewRounds.updateMany(roundQuery, { $set: { status: InterviewRoundStatus.COMPLETED } }),
        ]);

        const organizationId = [...new Set(interviewRound.map(round => round.jobId.organizationId.toString()))];

        await ApplicantRounds.updateMany({ roundIds: { $elemMatch: { $in: interviewRoundId } }, status: InterviewRoundStatus.ONGOING }, { $set: { status: InterviewRoundStatus.COMPLETED, isSelected: false } });

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