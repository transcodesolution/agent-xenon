import { Job, Queue, Worker } from "bullmq";
import redisConnection from "./redis";
import resumeExtractAgentJobHandler from "../agents/resume-extract-info";

const environment = process.env.NODE_ENV || 'dev';

const createQueue = (queueName: string, jobHandler: (job: Job, token: string) => Promise<void>, concurrency = 1) => {
    const fullQueueName = `${environment}_${queueName}`;
    const queue = new Queue(fullQueueName, { connection: redisConnection });
    const worker = new Worker(fullQueueName, jobHandler, { connection: redisConnection, concurrency: concurrency });
    worker.on('active', (job: Job) => console.log(`Job ${fullQueueName} ${job.id} is now active!`));
    worker.on('completed', (job: Job) => console.log(`Job ${fullQueueName} ${job.id} has completed!`));
    worker.on('failed', (job: Job, err) => console.log(`Job ${fullQueueName} ${job?.id} has failed with ${err.message}`));

    return { queue, worker };
};

export const { queue: resumeExtractAgent } = createQueue('resumeExtractAgent', resumeExtractAgentJobHandler, 1);