<script setup lang="ts">
import { PageConfig } from '~/types/page_config/PageConfig';
import type Recruitment from '~/types/recruitment/Recruitment';

definePageMeta({
    layout: 'home',
})

const nuxtToast = useNuxtToast();
const cvUtils = CVUtils();
const cvFile = ref<File | null>();
const isLoading = ref(false);
const matchingRecruitments = ref<Recruitment[]>([]);

const pageConfig = reactive(new PageConfig());
pageConfig.pageSize = -1;

const { $api } = useNuxtApp();
const businessRepository = BusinessRepository($api);

const handleInputCVFile = (event: any) => {
    if (event && event.length > 0) {
        cvFile.value = event[0];
    } else {
        cvFile.value = null;
    }
};

const processCV = async () => {
    isLoading.value = true;

    if (cvFile.value?.type != "application/pdf") {
        nuxtToast({
            description: "Chỉ chấp nhận pdf",
            type: "error"
        })
        isLoading.value = false;
        return;
    }

    const apiResponse = await cvUtils.processPdfFromFile(cvFile.value);

    if (apiResponse.code != 200) {
        nuxtToast({
            description: apiResponse.message,
            type: "error"
        })
    }

    else {
        const businessesResponse = await businessRepository.getBusinessWithRecruitmentsPaging(pageConfig);

        const businesses = businessesResponse.result.data;

        const responseRecruitments = await cvUtils.compareWithRecruitments(apiResponse.result, businesses);

        if (responseRecruitments.code != 200) {
            nuxtToast({
                description: responseRecruitments.message,
                type: "error"
            })
        }
        else {
            matchingRecruitments.value = responseRecruitments?.result?.matchingRecruitments ?? [];
        }
    }

    isLoading.value = false;
}
</script>

<template>
    <div class="flex w-full flex-col items-center justify-center px-2 pt-14">
        <div class="space-y-4">
            <div class="text-center text-3xl font-bold">Tìm việc phù hợp dựa trên CV của bạn</div>

            <div class="flex flex-col items-center gap-2">
                <UInput required type="file" size="lg" icon="i-heroicons-folder" accept=".pdf"
                        class="w-full max-w-6xl"
                        @change="handleInputCVFile"
                        :ui="{ icon: { trailing: { pointer: 'pointer-events-auto', padding: { lg: 'px-1' } } } }">
                    <template #trailing>
                        <UButton color="primary"
                                 @click="processCV"
                                 :loading="isLoading"
                                 icon="mingcute:search-2-fill"
                                 class="rounded-md" />
                    </template>
                </UInput>
            </div>

            <div class="pt-12 text-center">
                <div class="flex flex-col justify-center space-y-4">
                    <div v-for="recruitment in matchingRecruitments" :key="recruitment.recruitmentId"
                         class="hover:border-primary-500 dark:hover:border-primary-500 flex h-auto w-full max-w-2xl transform flex-row gap-4 self-center rounded-lg bg-white p-4 shadow-md transition-transform duration-300 hover:scale-105 dark:bg-gray-800">
                        <NuxtLink :to="`/recruitment/${recruitment.recruitmentId}`"
                                  class="flex w-full items-center justify-center text-center text-lg font-medium hover:underline dark:text-white"
                                  target="_blank">
                            {{ recruitment.title }}
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>