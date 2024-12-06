import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import type Recruitment from "~/types/recruitment/Recruitment";

const { pineconeApiKey, openApiKey } = useRuntimeConfig();

class RecruitmentVectorStore {
    private pineconeClient: Pinecone;
    private index: string;
    private embeddings: OpenAIEmbeddings;

    constructor(indexName: string) {
        this.pineconeClient = new Pinecone({
            apiKey: pineconeApiKey,
        });
        this.index = indexName;
        this.embeddings = new OpenAIEmbeddings({
            openAIApiKey: openApiKey,
        });
    }

    async initializeIndex() {
        return this.pineconeClient.Index(this.index);
    }

    async upsertRecruitments(recruitments: Recruitment[]) {
        const pineconeIndex = await this.initializeIndex();

        const batchSize = 100;
        for (let i = 0; i < recruitments.length; i += batchSize) {
            const batch = recruitments.slice(i, i + batchSize);

            // Prepare texts to embed
            const textsToEmbed = batch.map(
                (recruitment) =>
                    `${recruitment.title} ${recruitment.keySkills} ${recruitment.description} ${recruitment.position}`
            );

            try {
                // Batch embedding - single API call
                const embeddings = await this.embeddings.embedDocuments(
                    textsToEmbed
                );

                const vectors = batch.map((recruitment, index) => ({
                    id: recruitment.recruitmentId,
                    values: embeddings[index],
                    metadata: {
                        title: recruitment.title,
                        keySkills: recruitment.keySkills,
                        description: recruitment.description,
                        position: recruitment.position,
                    },
                }));

                await pineconeIndex.upsert(vectors);
            } catch (error) {
                console.error(
                    `Error processing batch starting at index ${i}:`,
                    error
                );
                // Optionally, implement more robust error handling or logging
            }
        }
    }

    async findSuitableRecruitments(cvText: string, topK: number = 5) {
        const pineconeIndex = await this.initializeIndex();

        try {
            const cvEmbedding = await this.embeddings.embedQuery(cvText);

            const queryResponse = await pineconeIndex.query({
                vector: cvEmbedding,
                topK: topK,
                includeMetadata: true,
            });

            return (
                queryResponse.matches?.map((match) => ({
                    recruitmentId: match.id,
                    title: match.metadata?.title as string,
                    keySkills: match.metadata?.keySkills as string,
                    description: match.metadata?.description as string,
                    position: match.metadata?.position as string,
                    similarity: match.score,
                })) || []
            );
        } catch (error) {
            console.error("Error finding suitable recruitments:", error);
            return [];
        }
    }
}

export default RecruitmentVectorStore;
