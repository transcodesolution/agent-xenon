import { ChatCompletionMessageParam } from "openai/resources";
import createOpenAIClient from "../helper/openai";
import Applicant from "../database/models/applicant";
import { IScreeningResponse } from "../types/agent";
import ApplicantRounds from "../database/models/applicant-round";

const client = createOpenAIClient();

const messages: ChatCompletionMessageParam[] = [
    {
        role: "system",
        content: `You have to use the tools provided to get applicant details.

        Tools avaiable:
        getApplicantDetails(jobId: string, roundId: string): Array<object> => This will return the mongodb array of object from find query. Pass jobId as argument which get applicants by jobId. Also Pass roundId as second argument. This function will get you array of object contains multiple applicants. Call this tool only once not multiple times. wait for developer response.

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

        Examples:
        1.) if applicants details contains skills not marked as node.js but they write express, mongo, javascript, etc.
         criteria gives the skills to be nodejs then you this applicant is selected because the node.js require the following relavant skills such as express, mongo, javascript. if applicant is selected then give mongo _id in new array
        2.) if criteria mention to have Database management skills, and applicant details contain MySQL, MongoDB then it will be selected. it id store to array.

        Output:
        {type:'OUTPUT',message:<Put array of selected candidate ids here>}
        `
    }
];

async function getApplicantDetails(jobId: string, roundId: string) {
    const alreadySelectedApplicantIds = await ApplicantRounds.distinct("applicantId", { jobId, deletedAt: null, roundId, isSelected: true })
    const data = await Applicant.find({ jobId, deletedAt: null, _id: { $nin: alreadySelectedApplicantIds } });
    return data;
}

async function filterCandidateAgent(criteria: string, jobId: string, roundId: string): Promise<IScreeningResponse> {
    messages.push({
        role: "user",
        content: `You are a screening agent. Scan the applicant details and select candidates based on the criteria below.

        Criteria: ${criteria}.
        JobId: ${jobId}
    `,
    });

    let i = 1;
    while (i <= 2) {
        const data = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            tools: [
                {
                    type: "function",
                    function: {
                        name: "getApplicantDetails",
                        description: "Fetch applicant details from the database. Returns an array of MongoDB objects.",
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
                            },
                            required: ["jobId"]
                        },
                    }
                }
            ],
            response_format: { type: "json_object" }
        });

        const responseMessage = data.choices[0].message;

        console.log(messages)

        if (responseMessage?.tool_calls) {
            for (const toolCall of responseMessage.tool_calls) {
                if (toolCall.function.name === "getApplicantDetails") {
                    const applicantDetails = await getApplicantDetails(jobId, roundId);

                    // Add function response to messages
                    messages.push({
                        role: "developer",
                        content: JSON.stringify(applicantDetails),
                    });

                    break;
                }
            }

            continue;
        }

        const output = JSON.parse(responseMessage?.content || "{}");

        if (output?.type === "OUTPUT") {
            return output; // Return the selected candidate IDs
        }

        // Push the latest AI response message into messages array
        messages.push(responseMessage);
        i += 1;
    }
}

export default filterCandidateAgent;