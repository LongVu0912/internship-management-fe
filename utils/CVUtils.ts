import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";
import type ApiResponse from "~/types/ApiResponse";
import type Business from "~/types/business/Business";
interface CacheEntry {
    timestamp: number;
    results: any;
}

interface Cache {
    [key: string]: CacheEntry;
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
const searchCache: Cache = {};

const generateCacheKey = (query: string): string => {
    // Convert string to UTF-8 bytes, then to hex string for safe caching
    return Array.from(new TextEncoder().encode(query.toLowerCase().trim()))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

const getCachedResults = (query: string) => {
    const key = generateCacheKey(query);
    const entry = searchCache[key];
    
    if (!entry) return null;
    
    // Check if cache has expired
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
        delete searchCache[key];
        return null;
    }
    
    return entry.results;
};

const cacheResults = (query: string, results: any) => {
    const key = generateCacheKey(query);
    searchCache[key] = {
        timestamp: Date.now(),
        results
    };
};
export const CVUtils = () => {
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
                apiResponse.message = "Không phi file cv hợp lệ (pdf)";
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
        return new Promise((resolve) => {
            let apiResponse = {
                code: 200,
                message: "",
                result: "",
            } as ApiResponse;

            const fileReader = new FileReader();

            fileReader.onload = async (e: any) => {
                const typedarray = new Uint8Array(e.target.result);
                try {
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    const numPages = pdf.numPages;
                    let textContent = "";

                    for (let i = 1; i <= numPages; i++) {
                        const page = await pdf.getPage(i);
                        const text = await page.getTextContent();
                        const textItems = text.items.map(
                            (item: any) => item.str
                        );
                        textContent += textItems.join(" ") + " ";
                    }

                    const processedText =
                        extractImportantInformation(textContent);
                    apiResponse.result = processedText;
                    resolve(apiResponse);
                } catch (err: any) {
                    apiResponse.code = 400;
                    apiResponse.message = err.message;
                    resolve(apiResponse);
                }
            };

            try {
                fileReader.readAsArrayBuffer(file);
            } catch {
                apiResponse.message = "Không phải CV hợp lệ";
                apiResponse.code = 400;
                resolve(apiResponse);
            }
        });
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
                        location,
                        workingDay,
                        workingHour,
                        business,
                        status,
                    } = recruitment;
                    return {
                        recruitmentId,
                        title: title || "N/A",
                        description: description || "N/A",
                        type: type || "N/A",
                        keySkills: keySkills || "N/A",
                        position: position || "N/A",
                        location: location || "N/A",
                        workingDay: workingDay || "N/A",
                        workingHour: workingHour || "N/A",
                        business: business,
                        status: status || "ACTIVE",
                    };
                }
                return null;
            })
            .filter((recruitment) => recruitment !== null);
    };

    const extractImportantInformation = (cvText: string) => {
        return `
        Skills and Experience Summary:
        ${cvText}

        Please analyze my background and experience for job matching.
    `.trim();
    };

    const findSuitableInternship = async (
        cvText: string,
        businesses: Business[]
    ) => {
        try {
            const cachedResults = getCachedResults(cvText);
            if (cachedResults) {
                return {
                    code: 200,
                    message: "Retrieved from cache",
                    result: cachedResults
                };
            }

            const recruitments = await extractRecruitments(businesses);
            const processedCvText = extractImportantInformation(cvText);

            const matchingRecruitments = await $fetch("/api/vector", {
                method: "post",
                body: {
                    processedCvText: processedCvText,
                    recruitments: recruitments,
                },
            });

            const validatedRecruitments = await $fetch("/api/gemini", {
                method: "post",
                body: {
                    message: processedCvText,
                    recruitments: matchingRecruitments,
                },
            });

            // Cache the results
            cacheResults(cvText, validatedRecruitments);

            return {
                code: 200,
                message: "",
                result: validatedRecruitments,
            };
        } catch (error: any) {
            return {
                code: 400,
                message: `Failed to find suitable jobs: ${error.message}`,
                result: null,
            };
        }
    };

    return {
        processPdfFromFile,
        processUrl,
        findSuitableInternship,
    };
};
