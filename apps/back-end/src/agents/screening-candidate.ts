import { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources";
import createOpenAIClient from "../helper/openai";
import { IScreeningResponse } from "../types/agent";
import { getSelectedApplicantDetails } from "../utils/applicant";
import ApplicantRounds from "../database/models/applicant-round";
import { InterviewRoundStatus } from "@agent-xenon/constants";
import { sendMail } from "../helper/mail";
import { RootFilterQuery } from "mongoose";
import { IApplicantRound } from "@agent-xenon/interfaces";

const client = createOpenAIClient();

const SYSTEM_PROMPT = `You have to use the tools provided to get applicant details.

        Tools avaiable:
        getSelectedApplicantDetails(jobId: string): Array<object> => This function will get you array of object contains multiple applicants. Call this tool only once not multiple times.
        updateApplicantSelectedToDb(jobId: string, roundId: string, isSelected: boolean, applicantId: string, email: string): string => This function will get you array of object contains multiple applicants. Call this tool only once not multiple times. It return a string containing "done" or "already exist" if already exist. if you call two times with same applicantId then it will already exist. so don't call it two times.

        Here is the applicant schema:
        interface IApplicant extends Document, ITimestamp {
            _id: ObjectId;
            lastName: string;
            contactInfo: {
                address: string;
                city: string;
                state: string;
                email: string;
                phoneNumber: string;
            };
            firstName: string;
            socialLinks: object;
            summary: string;
            skills: string[];
            hobbies: string[];
            strengths: string[];
            salaryExpectation: number;
            feedback: string;
            jobId: string;
            organizationId: string;
            experienceDetails: {
                duration: string;
                responsibilities: string[];
                role: string;
                organization: string;
            }[];
            education: {
                degree: string;
                institution: string;
                yearOfGraduation: string;
                description: string;
            }[];
            projects: {
                description: string;
                duration: string;
                technologiesUsed: string[];
                title: string;
            }[];
        }

        Note:
        1.) Don't strict on word to word
        2.) just follow the criteria and make decision by take care
        3.) if none candidate selected then check for relevant skills from criteria. ex: nodejs relavant skills : expressjs, nestjs
        4.) Strictly follow the json output.
        5.) Don't call updateApplicantSelectedToDb method when getSelectedApplicantDetails respond with empty array ([]).

        Examples:
        1.) call getSelectedApplicantDetails with jobId, parameter. it return json stringify array of object(bson document mongodb).
        2.) wait for getSelectedApplicantDetails response.
        3.) filter applicant on basis of criteria given. wait for filtered results.
        4.) call updateApplicantSelectedToDb one by one for each selected applicant with jobId, roundId, isSelected(true for if selected), applicantId.
        5.) wait for response of each call.
        6.) call updateApplicantSelectedToDb with each none selected applicant with same paramater but isSelected(false). wait for response.
        7.) call updateApplicantSelectedToDb method for each applicantId one time only, selection or rejection.
        8.) if call for all applicant selection and rejection on basis of criteria done to db then return output. one time call.

        Output:
        {type:'OUTPUT',message:'success'}`

async function updateApplicantSelectedToDb(jobId: string, roundId: string, isSelected: boolean, applicantId: string, email: string) {
    const queryFilter: RootFilterQuery<IApplicantRound> = { jobId, applicantId, deletedAt: null };
    const applicantRoundData = await ApplicantRounds.findOne({ ...queryFilter, roundIds: { $elemMatch: { $eq: roundId } } });
    if (applicantRoundData) {
        return "already exist";
    }
    await ApplicantRounds.updateOne(queryFilter, {
        $set: { ...queryFilter, isSelected, status: InterviewRoundStatus.COMPLETED },
        $push: { roundIds: roundId }
    }, { upsert: true });
    await sendMail(email, "Candidate Interview Status Mail", `Dear Candidate,  

        We appreciate your time and effort in participating in the screening round for the applied position.  
        
        ${isSelected ? "Congratulations! You have been selected for the next stage of the hiring process. Our team will reach out to you with further details soon." : "We regret to inform you that you have not been selected to proceed further at this time. However, we appreciate your interest and encourage you to apply for future opportunities with us."}  
        
        Thank you for your interest in our company.`);
    return "done";
}

async function filterCandidateAgent(criteria: string, jobId: string, roundId: string): Promise<IScreeningResponse> {
    const messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: SYSTEM_PROMPT
        },
        {
            role: "user",
            content: `You are a screening agent. Scan the applicant details and select or reject candidates based on the criteria below. update to db after your selection and wait for tool call to respond.
    
            Criteria: ${criteria}
            JobId: ${jobId}
            roundId: ${roundId}
        `,
        },
    ];

    const tools: Array<ChatCompletionTool> = [
        {
            type: "function",
            function: {
                name: "getSelectedApplicantDetails",
                description: "Fetch applicant details from the database. Returns an array of MongoDB objects.",
                parameters: {
                    type: "object",
                    properties: {
                        jobId: {
                            type: "string",
                            description: "The job ID to fetch applicant details"
                        },
                    },
                    required: ["jobId"]
                },
            }
        },
        {
            type: "function",
            function: {
                name: "updateApplicantSelectedToDb",
                description: "update applicant details selection or rejection into the database.",
                parameters: {
                    type: "object",
                    properties: {
                        jobId: {
                            type: "string",
                            description: "The job ID to fetch applicant details"
                        },
                        roundId: {
                            type: "string",
                            description: "The round ID to filter selected applicants"
                        },
                        isSelected: {
                            type: "boolean",
                            description: "The isSelected update applicant detail according to selection by AI. if AI pass false then not selected otherwise for selection AI pass true here."
                        },
                        applicantId: {
                            type: "string",
                            description: "The applicant ID to filter get which applicant AI is processing. in get applicant details it gives array of object contains _id as applicantId"
                        },
                        email: {
                            type: "string",
                            description: "The email to send mail to applicant for whose is selected or rejected in screening round."
                        },
                    },
                    required: ["jobId"]
                },
            }
        }
    ]

    let data = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        tools,
        response_format: { type: "json_object" }
    });

    while (data.choices[0].message?.tool_calls) {
        const responseMessage = data.choices[0].message;

        // Push the latest AI response message into messages array
        messages.push(responseMessage);

        if (responseMessage?.tool_calls) {
            for (const toolCall of responseMessage.tool_calls) {
                if (toolCall.function.name === "getSelectedApplicantDetails") {
                    const { jobId } = JSON.parse(toolCall.function.arguments);

                    const applicantDetails = await getSelectedApplicantDetails(jobId);

                    // Add function response to messages
                    messages.push({
                        role: "tool",
                        tool_call_id: toolCall.id,
                        content: JSON.stringify(applicantDetails),
                    });
                } else if (toolCall.function.name === "updateApplicantSelectedToDb") {
                    const { jobId, roundId, isSelected, applicantId, email } = JSON.parse(toolCall.function.arguments);

                    const applicantDetails = await updateApplicantSelectedToDb(jobId, roundId, isSelected, applicantId, email);

                    // Add function response to messages
                    messages.push({
                        role: "tool",
                        tool_call_id: toolCall.id,
                        content: applicantDetails,
                    });
                }
            }

            data = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages,
                tools,
                response_format: { type: "json_object" }
            });
        }

        else {
            const output = JSON.parse(responseMessage?.content || "{}");

            if (output?.type === "OUTPUT") {
                return output;
            }
        }
    }
}

export default filterCandidateAgent;