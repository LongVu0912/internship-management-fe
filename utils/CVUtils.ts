import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";
import type ApiResponse from "~/types/ApiResponse";
import type Business from "~/types/business/Business";

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

    const findSuitableInternship = async (
        message: string,
        businesses: Business[]
    ) => {
        try {
            const recruitments = await extractRecruitments(businesses);

            const body = await $fetch("/api/find", {
                method: "post",
                body: {
                    message: message,
                    recruitments: recruitments,
                },
            });

            return {
                code: 200,
                message: "",
                result: body,
            };
        } catch (error: any) {
            return {
                code: 400,
                message: `Failed to compare with recruitments: ${error.message}`,
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
