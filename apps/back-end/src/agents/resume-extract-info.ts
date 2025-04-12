import { getResumeParsedText } from "@agent-xenon/utils";
import { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources";
import { IResumeExtractResponse } from "../types/agent";
import Applicant from "../database/models/applicant";
import { Job } from "bullmq";
import createOpenAIClient from "../helper/openai";
import { updateApplicantToDatabase } from "../utils/applicant";
import { REDIS_KEY_PREFIX } from "../utils/constants";
import { getValue, setValue } from "../utils/redis";

const client = createOpenAIClient();

const SYSTEM_PROMPT = `Here is Applicant schema,
export interface IApplicant extends Document {
    lastName: string;
    contactInfo: {
        email: string;
        phoneNumber: string;
        address: String;
        city: String;
        state: String;
    };
    password: string;
    firstName: string;
    socialLinks: object;
    summary: string;
    skills: string[];
    hobbies: string[];
    strengths: string[];
    salaryExpectation: number;
    feedback: string;
    experienceDetails: {
        durationStart: Date;
        durationEnd: Date;
        responsibilities: string;
        role: string;
        organization: string;
    }[];
    education: {
        degree: string;
        description: string;
        institution: string;
        yearOfGraduation: string;
    }[];
    projects: {
        description: string;
        durationStart: Date;
        durationEnd: Date;
        technologiesUsed: string[];
        title: string;
    }[];
    resumeLink: string;
    organizationId: string;
    jobId: string;
    roleId: string;
}

Tools:
- checkApplicantEmailInJob(jobId: string, email: string): string => you have to call this function to check for email already exist, if this method will give "false" then only take applicant in json otherwise ignore it.

### **Rules to Follow**
1. **Email Check Before Adding Applicant**:
   - Before adding an applicant, **call the provided function** \`checkApplicantEmailInJob(jobId, contactInfo.email)\`.
   - If the function **returns \`false\`**, include the applicant in the final array.
   - If it **returns \`true\`**, skip that applicant.
   - **Do NOT call the function again for the same email.**
   - **please trict boolean as string => function return "false", "true" so give me according to this**
   - **strict to tool_call_id, compare result with each tool properly. match id and take result.
   - **durationStart** and **durationEnd** take from pdf text convert into timestamp. If found Present then take null.

2. **Mandatory Fields**:
   - If \`contactInfo.email\` is missing, empty, or null, **ignore** that applicant.
   - \`password\` must be **generated**, 8 characters long, and strong. Please generate according to schema fields, name, birthdate.

3. Step-by-Step Resume Processing Flow
    1.) You have string which contains pdf text.

    2.) Parse the provided PDF text string.
        Extract candidate information according to the given schema.

        Pick one extracted resume object at a time.
        Retrieve the email from the extracted resume.
    
    3.) Check Email Existence (One-Time Call per Email)

        Call the function checkApplicantEmailInJob(jobId, email).
        Wait for the function’s response before proceeding further.
    4.) Decide Based on Email Existence Response

        If the response is "true" (email already exists), send null.
        If the response is "false" (email does not exist), send the object according to schema formatted.
    5.) Return the Final Processed Data

        Output the final object of extracted resume in strict JSON format, well formatted json.
        Ensure the format adheres to the expected schema.

### **Response Format**
{ "type": "OUTPUT", "message": "<Put object (json) here>" }`;

async function checkApplicantEmailInJob(jobId: string, email: string) {
    const checkApplicantEmailExist = await Applicant.findOne({ appliedJobIds: { $elemMatch: { $eq: jobId } }, "contactInfo.email": email, deletedAt: null });
    return !!checkApplicantEmailExist;
}

async function resumeExtractAgentJobHandler(job: Job) {
    try {
        const value = job.data;
        await saveResumesExtractInfoAgent(value.resumeUrls, value.organizationId, value.jobId, value.roleId);
    } catch (error) {
        console.error("resumeExtractAgentJobHandler => ", error)
    }
}

async function saveResumesExtractInfoAgent(resumeUrls: string[], organizationId: string, jobId: string, roleId: string) {
    const pdfTexts = await Promise.all(resumeUrls.map((i) => (getResumeParsedText(i))));

    const tools: Array<ChatCompletionTool> = [
        {
            type: "function",
            function: {
                name: "checkApplicantEmailInJob",
                description: "Checks if an applicant with a given email already exists for a job.",
                parameters: {
                    type: "object",
                    properties: {
                        jobId: { type: "string", description: "The job ID to check against" },
                        email: { type: "string", description: "The applicant's email address" },
                    },
                    required: ["jobId", "email"],
                },
            },
        },
    ];

    for (let i = 0; i < pdfTexts.length; i += 1) {
        const resumeText = pdfTexts[i];
        const resumeUrl = resumeUrls[i];

        const messages: ChatCompletionMessageParam[] = [
            { role: "system", content: SYSTEM_PROMPT },
            {
                role: 'user',
                content: `
                    you are an agent for screening a resume & extract candidate information from text extracted from a pdf file and create a json according to the applicant schema given.

                    Process the following extracted resume text:
                    "${resumeText}"
                    Resume URL: "${resumeUrl}"
                    Organization ID: "${organizationId}"
                    Job ID: "${jobId}"
                    Role ID: "${roleId}"
                `,
            }
        ];

        let aiResponse = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            store: true,
            messages,
            tools,
            response_format: { type: "json_object" }
        });

        while (aiResponse.choices[0].message?.tool_calls) {
            const toolCalls = aiResponse.choices[0].message.tool_calls;
            messages.push(aiResponse.choices[0].message)

            for (const toolCall of toolCalls) {
                if (toolCall.function.name === "checkApplicantEmailInJob") {
                    const { jobId, email } = JSON.parse(toolCall.function.arguments);

                    const emailExists = await checkApplicantEmailInJob(jobId?.trim(), email?.trim());

                    messages.push({
                        role: "tool",
                        tool_call_id: toolCall.id,
                        content: JSON.stringify(emailExists),
                    });
                }
            }

            // Call OpenAI again with updated messages
            aiResponse = await client.chat.completions.create({
                model: "gpt-4o-mini",
                store: true,
                messages,
                tools,
                response_format: { type: "json_object" },
            });
        }

        const resumeData: IResumeExtractResponse = JSON.parse(aiResponse.choices[0].message?.content ?? '{}');

        const email = resumeData?.message?.contactInfo?.email;

        if (email) {
            await updateApplicantToDatabase(email, resumeData?.message, jobId);
        }

        const redisKeyName = `${REDIS_KEY_PREFIX.Job}${jobId}`;
        const resumeProcessByJob = await getValue(redisKeyName);
        setValue(redisKeyName, resumeProcessByJob - 1);
    }
}

export default resumeExtractAgentJobHandler;