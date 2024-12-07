import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import type Recruitment from "~/types/recruitment/Recruitment";

const { pineconeApiKey, openApiKey } = useRuntimeConfig();

class RecruitmentVectorStore {
    private pineconeClient: Pinecone;
    private index: string;
    private embeddings: OpenAIEmbeddings;
    private lastRecruitmentHash: string = "";

    constructor(indexName: string) {
        this.pineconeClient = new Pinecone({
            apiKey: pineconeApiKey,
        });
        this.index = indexName;
        this.embeddings = new OpenAIEmbeddings({
            openAIApiKey: openApiKey,
        });
    }
    private async generateRecruitmentHash(recruitments: Recruitment[]): Promise<string> {
        const sortedRecruitments = recruitments.sort((a, b) => 
            (a.recruitmentId ?? '').localeCompare(b.recruitmentId ?? '')
        );
        
        const recruitmentString = sortedRecruitments.map(r => 
            `${r.recruitmentId}:${r.title}:${r.keySkills}:${r.description}:${r.position}`
        ).join('|');
        
        const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(recruitmentString));
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    private async findChangedRecruitments(recruitments: Recruitment[]): Promise<{
        unchangedIds: string[],
        changedRecruitments: Recruitment[]
    }> {
        const pineconeIndex = await this.initializeIndex();
        const existingIds = recruitments.map(r => r.recruitmentId).filter(id => id);
        
        const existingVectors = await pineconeIndex.fetch(existingIds);
        
        const unchangedIds: string[] = [];
        const changedRecruitments: Recruitment[] = [];
        
        recruitments.forEach(recruitment => {
            if (!recruitment.recruitmentId) return;
            
            const existingVector = existingVectors.records[recruitment.recruitmentId];
            if (!existingVector || 
                existingVector.metadata?.title !== recruitment.title ||
                existingVector.metadata?.keySkills !== recruitment.keySkills ||
                existingVector.metadata?.description !== recruitment.description ||
                existingVector.metadata?.position !== recruitment.position) {
                changedRecruitments.push(recruitment);
            } else {
                unchangedIds.push(recruitment.recruitmentId);
            }
        });
        
        return { unchangedIds, changedRecruitments };
    }

    async initializeIndex() {
        return this.pineconeClient.Index(this.index);
    }

    async upsertRecruitments(recruitments: Recruitment[]) {
        const newHash = await this.generateRecruitmentHash(recruitments);
        
        if (newHash === this.lastRecruitmentHash) {
            console.log('Recruitment data unchanged, skipping update');
            return;
        }
        
        const pineconeIndex = await this.initializeIndex();
        const { unchangedIds, changedRecruitments } = await this.findChangedRecruitments(recruitments);
        
        console.log(`Found ${unchangedIds.length} unchanged and ${changedRecruitments.length} changed recruitments`);
        
        if (changedRecruitments.length > 0) {
            const batchSize = 100;
            for (let i = 0; i < changedRecruitments.length; i += batchSize) {
                const batch = changedRecruitments.slice(i, i + batchSize);
                
                const vectorPromises = batch.map(async (recruitment) => {
                    const textToEmbed = `
                        ${recruitment.title} 
                        ${recruitment.keySkills} 
                        ${recruitment.description} 
                        ${recruitment.position}
                    `;
                    
                    const embedding = await this.embeddings.embedQuery(textToEmbed);
                    
                    return {
                        id: recruitment.recruitmentId,
                        values: embedding,
                        metadata: {
                            title: recruitment.title,
                            keySkills: recruitment.keySkills,
                            description: recruitment.description,
                            position: recruitment.position
                        }
                    };
                });

                const vectors = await Promise.all(vectorPromises);
                await pineconeIndex.upsert(vectors);
            }
        }
        
        this.lastRecruitmentHash = newHash;
    }

    async findSuitableRecruitments(cvText: string, topK: number = 5) {
        const pineconeIndex = await this.initializeIndex();
        
        const cvEmbedding = await this.embeddings.embedQuery(cvText);

        const queryResponse = await pineconeIndex.query({
                vector: cvEmbedding,
                topK: topK,
                includeMetadata: true
        });

        return queryResponse.matches?.map(match => ({
            recruitmentId: match.id,
            title: match.metadata?.title as string,
            keySkills: match.metadata?.keySkills as string,
            description: match.metadata?.description as string,
            position: match.metadata?.position as string,
            similarity: match.score
        })) || [];
    }
}

export default RecruitmentVectorStore;
