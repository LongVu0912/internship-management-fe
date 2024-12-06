import RecruitmentVectorStore from "../utils/RecruitmentVectorStore";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const vectorStore = new RecruitmentVectorStore("demo");

    await vectorStore.upsertRecruitments(body.recruitments);

    const matchingRecruitments = await vectorStore.findSuitableRecruitments(
        body.processedCvText
    );
    
    return matchingRecruitments;
});
