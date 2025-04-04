import { ChatCompletionMessageParam } from "openai/resources";
import createOpenAIClient from "../helper/openai";
import { IScreeningResponse } from "../types/agent";
import { getSelectedApplicantDetails } from "../utils/applicant";
import ApplicantRounds from "../database/models/applicant-round";
import { InterviewRoundStatus } from "@agent-xenon/constants";
import { sendMail } from "../helper/mail";
import { RootFilterQuery } from "mongoose";
import { IApplicant, IApplicantRound, IOrganization } from "@agent-xenon/interfaces";

const client = createOpenAIClient();

const SYSTEM_PROMPT = `You are an AI-powered Screening Agent responsible for filtering and selecting top talent based on provided criteria. Your task is to process applicants efficiently and update their selection status in a structured JSON format.

### Schema (Simplified)
Each applicant has the following attributes:
- **Personal Information:** \`_id\`, \`firstName\`, \`lastName\`, \`contactInfo\` (email, phone, address, city, state)
- **Professional Summary:** \`skills\`, \`strengths\`, \`hobbies\`, \`summary\`, \`feedback\`
- **Experience:** Array of \`{ role, org, duration, responsibilities[] }\`
- **Education:** Array of \`{ degree, institution, yearOfGraduation, description }\`
- **Projects:** Array of \`{ title, description, duration, technologiesUsed[] }\`

### Processing Rules
1. **Check Input Validity**
   - If the \`allApplicantsToFilter\` array is empty (\`[]\`), return immediately without processing.

2. **Filtering Criteria**
   - Process one applicant at a time.
   - If the applicant’s skills **match exactly** with the required skills, select them.
   - If no exact match is found, check for **relevant skills** (closely related).
   - If an applicant meets the selection criteria, mark them as **selected**. Otherwise, mark them as **rejected**.

3. **Output Structure**
   - Store results in an array as JSON objects with the following properties:
     - **Selected Applicant:** \`{ isSelected: true, applicantId: <_id take from allApplicantsToFilter array> }\`
     - **Rejected Applicant:** \`{ isSelected: false, applicantId: <_id take from allApplicantsToFilter array> }\`

4. **Execution Constraints**
   - **Optimize performance** – prioritize efficiency in filtering and selection.

### Output Format
Return the final JSON response as:
\`\`\`json
{
  "type": "OUTPUT",
  "applicants": [
    { "applicantId": "<mongo id>", "isSelected": true | false }
  ]
}
\`\`\`

Your goal is to **maximize efficiency** while ensuring accurate filtering of top talent.`;

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
    if (email) {
        await sendMail(email, "Candidate Interview Status Mail", `Dear Candidate,  
    
            We appreciate your time and effort in participating in the screening round for the applied position.  
            
            ${isSelected ? "Congratulations! You have been selected for the next stage of the hiring process. Our team will reach out to you with further details soon." : "We regret to inform you that you have not been selected to proceed further at this time. However, we appreciate your interest and encourage you to apply for future opportunities with us."}  
            
            Thank you for your interest in our company.`);
    }
    return "done";
}

async function filterCandidateAgent(criteria: string, jobId: string, roundId: string) {
    const applicantDetails = await getSelectedApplicantDetails(jobId);

    const messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: SYSTEM_PROMPT
        },
        {
            role: "user",
            content: `I'm a user with following criteria, allApplicantsToFilter array will need to filter applicant based on criteria.    
            Criteria: ${criteria}
            allApplicantsToFilter: ${JSON.stringify(applicantDetails)}
        `,
        },
    ];

    const apiResponse = await client.chat.completions.create({
        model: "o3-mini",
        messages,
        response_format: { type: "json_object" }
    });

    const aiResponse: IScreeningResponse = JSON.parse(apiResponse.choices[0].message?.content || "{}");

    for (const applicant of aiResponse.applicants) {
        const email = applicantDetails.find((i: IApplicant<Pick<IOrganization, "name">>) => i._id.toString() === applicant.applicantId)?.contactInfo.email || "";
        await updateApplicantSelectedToDb(jobId, roundId, applicant.isSelected, applicant.applicantId, email);
    }
}

export default filterCandidateAgent;