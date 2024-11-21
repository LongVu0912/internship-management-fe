import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type ApiResponse from "~/types/ApiResponse";
import type Business from "~/types/business/Business";

export const CVUtils = () => {
    const genAI = new GoogleGenerativeAI(useRuntimeConfig().public.geminiKey);

    const processPdfFromBlob = async (blob: any): Promise<ApiResponse> => {
        let apiResponse = {
            code: 200,
            message: "",
            result: "",
        } as ApiResponse;

        const fileReader = new FileReader();
        fileReader.onload = async (e: any) => {
            const typedarray = new Uint8Array(e.target.result);
            try {
                const pdf = await pdfjsLib.getDocument(typedarray).promise; // Tải PDF từ blob
                const numPages = pdf.numPages;
                let textContent = "";

                for (let i = 1; i <= numPages; i++) {
                    const page = await pdf.getPage(i);
                    const text = await page.getTextContent();
                    const textItems = text.items.map((item: any) => item.str);
                    textContent += textItems.join(" ") + " ";
                }

                apiResponse.result = textContent;
            } catch (err: any) {
                apiResponse.message = err.message;
                apiResponse.code = 400;
            }
        };

        try {
            fileReader.readAsArrayBuffer(blob);
        } catch {
            apiResponse.message = "Không phải CV hợp lệ";
            apiResponse.code = 400;
        }

        return apiResponse;
    };

    const processUrl = async (url: string): Promise<ApiResponse> => {
        let apiResponse = {
            code: 200,
            message: "",
            result: "",
        } as ApiResponse;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                apiResponse.code = 400;
                apiResponse.message = "Không phải url hợp lệ";
                return apiResponse;
            }

            const contentType = response.headers.get("Content-Type") ?? "";
            const blob = await response.blob();

            let res = {} as ApiResponse;

            if (contentType === "application/pdf") {
                res = await processPdfFromBlob(blob);
            } else {
                apiResponse.code = 400;
                apiResponse.message = "Không phải file cv hợp lệ (pdf)";
                return apiResponse;
            }

            return res;
        } catch (err: any) {
            apiResponse.code = 400;
            apiResponse.message = err.message;
            return apiResponse;
        }
    };

    const processPdfFromFile = async (file: any): Promise<ApiResponse> => {
        let apiResponse = {
            code: 200,
            message: "",
            result: "",
        } as ApiResponse;

        const fileReader = new FileReader();

        fileReader.onload = async (e: any) => {
            const typedarray = new Uint8Array(e.target.result);
            try {
                const pdf = await pdfjsLib.getDocument(typedarray).promise; // Tải PDF từ file
                const numPages = pdf.numPages;
                let textContent = "";

                for (let i = 1; i <= numPages; i++) {
                    const page = await pdf.getPage(i);
                    const text = await page.getTextContent();
                    const textItems = text.items.map((item: any) => item.str);
                    textContent += textItems.join(" ") + " ";
                }

                apiResponse.result = textContent;
            } catch (err: any) {
                apiResponse.code = 400;
                apiResponse.message = err.message;
            }
        };
        try {
            fileReader.readAsArrayBuffer(file);
        } catch {
            apiResponse.message = "Không phải CV hợp lệ";
            apiResponse.code = 400;
        }
        return apiResponse;
    };

    const extractRecruitments = async (businesses: Business[]) => {
        return businesses
            .flatMap((business) => business.recruitments)
            .filter((recruitment) => recruitment)
            .map((recruitment) => {
                if (recruitment) {
                    const {
                        recruitmentId,
                        title,
                        description,
                        type,
                        keySkills,
                        position,
                    } = recruitment;
                    return {
                        recruitmentId,
                        title: title || "N/A",
                        description: description || "N/A",
                        type: type || "N/A",
                        keySkills: keySkills || "N/A",
                        position: position || "N/A",
                    };
                }
                return null;
            })
            .filter((recruitment) => recruitment !== null);
    };

    const compareWithRecruitments = async (
        cvData: string,
        businesses: Business[]
    ): Promise<ApiResponse> => {
        const recruitments = await extractRecruitments(businesses);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-002",
            systemInstruction: `You are a recruitment matcher that validates and analyzes CV data to find the most suitable job IDs from a given list of recruitments.

Your tasks:
1. **Validate the CV data**: First, check if the provided 'cvData' appears to be a valid CV. A valid CV typically includes information such as:
   - Personal details (e.g., name, contact information).
   - Work experience (e.g., job titles, companies, years of experience).
   - Skills (e.g., technical, professional skills).
   - Education (e.g., degrees, certifications).

   If the data does not resemble a CV, return the following JSON object:
   {
     "isValidCV": boolean,
     "matchingRecruitments": Object[]
   }
   - isValidCV: true if the input resembles a CV, otherwise false.
   - matchingRecruitments: A list of the top 5 job recruitments ranked by suitability include id and title. If no jobs match or the data is not a CV, return an empty array.
`,
        });

        const generationConfig = {
            temperature: 0.1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 1024,
            responseMimeType: "application/json",
        };

        try {
            const chatSession = model.startChat({
                generationConfig,
                history: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: JSON.stringify({
                                    cvData,
                                    recruitments: recruitments,
                                }),
                            },
                        ],
                    },
                ],
            });

            const result = await chatSession.sendMessage(cvData);
            const content = result.response.text();

            return {
                code: 200,
                message: "",
                result: JSON.parse(content),
            };
        } catch (err: any) {
            return {
                code: 200,
                message: `Failed to compare with recruitments: ${err.message}`,
                result: null,
            };
        }
    };

    const submitChat = async (message: string, businesses: Business[]) => {
        try {
            const recruitments = await extractRecruitments(businesses);

            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: `You are a recruitment matcher that validates  find the most suitabl job IDs from a given list of recruitments.

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
      Try to find at least 5 results If you just find 4 results, only respone that, no addition other jobs that not related to the input.
      For example, when a user enters "data", it only searches for jobs related to the data, not other jobs.
      4. Provide Job Recommendations:

   If the data does not resemble a job find request, return the following JSON object with no codeblock or markdown:
   {
        "isValidRequest" : boolean,
        "matchingJobs": [
    {
      "recruitmentId": string,
      "title": string
    }
  ]
   }
   - recruitmentId is must be the recruitmentId input the provided data, not any field else.
   - isValidRequest: true if the input resembles a request to find or a description of a job, otherwise false.
   - matchingJobs: A list of the top 5 job recruitmentIds and titles ranked by suitability or if it. If no jobs match or the data is not a request, return an empty array.
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
                                    chatInput: message,
                                    recruitments: recruitments,
                                }),
                            },
                        ],
                    },
                ],
            });

            const result = await chatSession.sendMessage(message);
            const content = result.response.text();

            // Log the raw response to check for any text or errors
            console.log("Raw Response:", content);

            const parsedData = JSON.parse(content);
        } catch (error) {
            console.error("Error comparing with recruitments:", error);
        }
    };

    return {
        processPdfFromFile,
        processUrl,
        compareWithRecruitments,
        submitChat,
    };
};
