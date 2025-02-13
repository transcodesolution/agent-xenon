import OpenAI from "openai"

const createOpenAIClient = () => {
    const client = new OpenAI();
    return client;
}

export default createOpenAIClient;