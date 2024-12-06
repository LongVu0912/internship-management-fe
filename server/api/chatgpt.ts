import OpenAI from "openai";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const openai = new OpenAI({
        apiKey: useRuntimeConfig().openApiKey,
    });

    // const systemInstruction =

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content:
                    '`Provide Job Recommendations:\nIf the data does not resemble a job find request, return the following JSON object with no codeblock or markdown:\n{\n"isValidRequest" : boolean,\n"matchingRecruitments": [\n{\n"recruitmentId": string,\n"title": string,\n"confidence": number,\n"explanation": string\n}\n]\n}\n- recruitmentId must be the recruitmentId from the provided data, not any other field.\n- title must be the title from the provided data, not any other field.\n- isValidRequest: true if the input resembles a request to find or a description of a job, otherwise false.\n- matchingRecruitments: A list of the top 5 job recruitmentIds and titles ranked by suitability or if it. If no jobs match or the data is not a request, return an empty array.\n- confidence: A numerical value between 0 and 1 representing the confidence level of the matching recruitments. A higher value indicates higher confidence.\n- explanation: A textual description providing details on how the matching recruitments were determined, including any relevant criteria or algorithms used.\n`',
            },
            {
                role: "user",
                content: body.message + JSON.stringify(body.recruitments),
            },
        ],
    });

    const content = completion.choices[0].message.content;

    if (content) {
        console.log(JSON.parse(content));
        return JSON.parse(content);
    } else {
        console.error("Completion content is null");
    }
});
