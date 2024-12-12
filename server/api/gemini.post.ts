import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const genAI = new GoogleGenerativeAI(useRuntimeConfig().geminiKey);

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `You are a recruitment matcher that validates find the most suitable job IDs from a given list of recruitments.

Your tasks:
1. Find Jobs Based on User Input
Validate the Job Search Request:
Check if the user has provided a specific job search query. A valid request can be:
A field or specialization (e.g., ReactJS, Data Analyst, IT, Marketing).
A geographical location (if applicable, e.g., "in New York City" or "remote").
Additional description (if any, e.g., position,..).
3. Plan the Job Search:
Look for job opportunities ONLY relevant to the user’s input.
Ensure the search aligns with the provided information.
Try to find at least 5 results If you just find 4 results, only response that, no addition other jobs that not related to the input.
For example, when a user enters "data", it only searches for jobs related to the data, not other jobs.
4. Provide Job Recommendations:

If the data does not resemble a job find request, return the following JSON object with no codeblock or markdown:
{
"isValidRequest" : boolean,
"matchingRecruitments": [
{
"recruitmentId": string,
"title": string
}
]
}
- recruitmentId is must be the recruitmentId input the provided data, not any field else.
- isValidRequest: true if the input resembles a request to find or a description of a job, otherwise false.
- matchingRecruitments: A list of the top 5 job recruitmentIds and titles ranked by suitability or if it. If no jobs match or the data is not a request, return an empty array.
`,
    });

    const generationConfig = {
        temperature: 0.1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
    };

    // Start the chat session with the model using the input data
    const chatSession = model.startChat({
        generationConfig,
        history: [
            {
                role: "user",
                parts: [
                    {
                        text: JSON.stringify({
                            chatInput: body.message,
                            recruitments: body.recruitments,
                        }),
                    },
                ],
            },
        ],
    });

    const result = await chatSession.sendMessage(body.message);
    const content = result.response.text();

    return JSON.parse(content);
});