import { CronJob } from 'cron';
import { InterviewRoundTypes, InterviewRoundStatus } from '@agent-xenon/constants';
import InterviewRounds from '../../database/models/interview-round';
import { IInterviewRounds, IJob } from '@agent-xenon/interfaces';
import { socketIo } from '../../helper/socket';

export default new CronJob('*/30 * * * *', async function () {
    try {
        const currentTime = new Date();

        const roundQuery = { deletedAt: null, type: InterviewRoundTypes.TECHNICAL, status: InterviewRoundStatus.ONGOING, endDate: { $lt: currentTime } };

        const [interviewRounds] = await Promise.all([
            InterviewRounds.find<IInterviewRounds<IJob>>(roundQuery).populate('jobId', "organizationId"),
            InterviewRounds.updateMany(roundQuery, { $set: { status: InterviewRoundStatus.COMPLETED } }),
        ]);

        const organizationIds = [...new Set(interviewRounds.map(round => round.jobId.organizationId.toString()))];

        if (organizationIds.length > 0) {
            socketIo.to(organizationIds).emit('round-status', {
                status: "completed",
                message: "Technical round is completed! You can check the status!"
            });
        }
    } catch (error) {
        console.error('Error in checkForTechnicalRoundStatus:', error);
    }
}, null, false, 'Asia/Kolkata');