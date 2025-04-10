import { ChatCompletionMessageParam } from "openai/resources";
import createOpenAIClient from "../helper/openai";
import { IInterviewQuestion } from "@agent-xenon/interfaces";
import { ICandidateAnswerAnalysisResponse } from "../types/technical-round";

const client = createOpenAIClient();

const SYSTEM_PROMPT = `You are an AI evaluator for a recruitment platform used by HR professionals. Your role is to assess and evaluate a candidate’s response according to the designated input type.

**Input Types:**  
- "code" → Generate test cases, execute code, and evaluate correctness, performance, and quality.  
- "text" → Compare the candidate’s response to a theoretical explanation and determine correctness.  
---
### **Evaluation Process**  
#### **If Input Type = "code"**  
1. **Generate Test Cases**: Based on the problem statement, create multiple test cases, including edge cases.  
2. **Execute Code**: Run the candidate’s code with generated test cases.  
3. **Validate Output**: Compare actual vs. expected results and determine pass/fail.  
4. **Final Decision**: Clearly indicate whether the candidate’s submission is **Pass** or **Fail** based on test cases and performance. 
**note**:You will generate expected output on basis of question, promptText while create multiple test cases.

#### **If Input Type = "text"**  
1. **Analyze Question Context**: Understand the theoretical explanation behind the question.  
2. **Compare Response**: Check if the candidate’s answer aligns with the ideal explanation.  
3. **Evaluate for Accuracy, Depth, and Clarity**: Ensure correctness, completeness, and relevance.  
4. **Final Decision**: Clearly indicate whether the candidate’s response is **Pass** or **Fail** based on correctness and depth.  
---
### **Input Format**  
- **input_type**: "code" or "text"
- **question_statement**: The problem/question to be answered.  
- **answer**: The candidate’s submitted answer.  
- **promptText**: Additional constraints or instructions (optional).  
---
### **Output Format (JSON)**  
json
{
  "overallStatus": "Pass/Fail"
}`;

async function candidateAnswerAnalysisAgent(question: Pick<IInterviewQuestion, "question" | "evaluationCriteria" | "questionFormat" | "description">, answer: string): Promise<ICandidateAnswerAnalysisResponse> {
    const messages: ChatCompletionMessageParam[] = [
        { role: "system", content: SYSTEM_PROMPT },
        {
            role: "user", content: `I'm a candidate. Here is my code with question statement, my answer as a input format given. You have an extra prompt given to understand question. so you can create test cases, expected output according to question statement accurately. 
        
        question statement: ${question.question}\n${question.description}
        extra prompt: ${question.evaluationCriteria}\n
        input format: ${question.questionFormat}\n
        answer: ${answer}`
        }
    ]

    const assistentResponse = await client.chat.completions.create({
        // model: "gpt-4o-mini",
        model: "o3-mini",
        messages,
        response_format: { type: "json_object" },
    });

    const output = JSON.parse(assistentResponse.choices[0].message?.content || "{}");

    return output;
}

export default candidateAnswerAnalysisAgent;