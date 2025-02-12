import { getResumeParsedText } from "@agent-xenon/utils";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { IResumeExtractResponse } from "../types/agent";

const client = new OpenAI();

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
    firstName: string;
    socialLinks: object;
    summary: string;
    skills: string[];
    hobbies: string[];
    strengths: string[];
    salaryExpectation: number;
    feedback: string;
    experienceDetails: {
        duration: string;
        responsibilities: string[];
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
        duration: string;
        technologiesUsed: string[];
        title: string;
    }[];
    resumeLink: string;
    organizationId: string;
    jobId: string;
}

Rules:
- Strictly follow the JSON output format.
- Please don't put object in array when you not found the contactInfo.email or contactInfo.email is empty, null

Examples:
{type:"OUTPUT", "message":"<Put array of object (json) here>"}`;

const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT }
]

async function uploadResumesAgent(resumeUrls: string[], organizationId: string, jobId: string) {
    const pdfTexts = await Promise.all(resumeUrls.map((i) => (getResumeParsedText(i))));

    messages.push({
        role: 'user',
        content: `
      you are an agent for screening a resume & extract candidate information from text extracted from a pdf file and create a json according to the applicant schema given.

      Pdf text are given as array of string each string contains extracted text of single candidate:
      ${pdfTexts}
      
      I am giving you organizationId=${organizationId}, jobId=${jobId} and resumeUrls=${resumeUrls}, attach in according to schema.
      For resume urls you take according to index.
      Example:
      pdfTexts[0]=resumeUrls[0]=resumeLink in schema
      pdfTexts[1]=resumeUrls[1]=resumeLink in schema
      `,
    });

    const data = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        store: true,
        messages,
        response_format: { type: "json_object" }
    });

    const resumeData: IResumeExtractResponse = JSON.parse(data.choices[0].message?.content ?? '{}');

    return resumeData?.message ?? [];
}

export default uploadResumesAgent;