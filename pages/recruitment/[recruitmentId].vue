<script setup lang="ts">
import type Recruitment from '~/types/recruitment/Recruitment';

definePageMeta({
    layout: 'home',
    middleware: 'logged',
})

// * Imports
const { $apiToken } = useNuxtApp();
const recruitmentRepository = RecruitmentRepository($apiToken);
const nuxtToast = useNuxtToast();
const route = useRoute();

// * Refs
const isPageLoading = ref(true);
const isConfirmDialogOpen = ref(false);
const recruitment = ref<Recruitment>();

// * Lifecycle
onBeforeMount(async () => {
    const apiResponse = await recruitmentRepository.getRecruitmentById({
        recruitmentId: route.params.recruitmentId as string,
    });

    console.log(apiResponse);
    if (apiResponse.code != 200) {
        showError({
            statusCode: 404,
            statusMessage: "Page not found",
        })
    }

    recruitment.value = apiResponse.result;

    isPageLoading.value = false;
})

const onDialogConfirm = async () => {
    nuxtToast({
        description: "Chưa làm xong",
    })
}

const onDialogCancel = () => {

}

</script>

<template>

    <Head>
        <Title>{{ recruitment?.title }}</Title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
    </Head>
    <Loading v-if="isPageLoading" />
    <div v-else class="px-4 md:px-28">
        <UCard>
            <template #header>
                <div class="text-xl font-bold">
                    {{ recruitment?.title }}
                </div>
            </template>
            <div class="flex flex-col gap-4 py-4">
                <div class="flex w-full flex-col gap-2 text-base md:flex-row">
                    <div class="md:w-1/2">
                        <div class="flex flex-col gap-3">
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:building-3-line" class="h-6 w-6 flex-shrink-0" />
                                <div>{{ recruitment?.business.name }}</div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:location-3-line" class="h-6 w-6 flex-shrink-0" />
                                <div>{{ recruitment?.location }}</div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:user-2-line" class="h-6 w-6 flex-shrink-0" />
                                <div>{{ recruitment?.position }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="md:w-1/2">
                        <div class="flex flex-col gap-3">
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:briefcase-2-line" class="h-6 w-6 flex-shrink-0" />
                                <div>{{ recruitment?.type }}</div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:calendar-2-line" class="h-6 w-6 flex-shrink-0" />
                                <div>{{ recruitment?.workingDay }}</div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:time-line" class="h-6 w-6 flex-shrink-0" />
                                <div>{{ recruitment?.workingHour }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <UDivider />
                <div>
                    <div class="text-lg font-bold leading-9">Kỹ năng</div>
                    <p>
                        {{ recruitment?.keySkills }}
                    </p>
                </div>
                <UDivider />
                <div>
                    <div class="text-lg font-bold leading-9">Mô tả công việc</div>
                    <p>
                        {{ recruitment?.description }}
                    </p>
                </div>
            </div>

            <template #footer>
                <div class="flex flex-row justify-end">
                    <div class="flex flex-row gap-2">
                        <UButton label="Xem công ty" size="lg"
                                 @click="navigateTo(`/business/${recruitment?.business.businessId}`)" />
                        <UButton label="Ứng tuyển ngay" size="lg" color="primary" @click="isConfirmDialogOpen = true" />
                    </div>
                </div>
            </template>
        </UCard>
    </div>
    <ConfirmDialog :isOpen="isConfirmDialogOpen" title="Ứng tuyển"
                   description="Bạn có chắc muốn ứng tuyển công việc này?"
                   :onConfirm="onDialogConfirm" :onCancel="onDialogCancel" @hideDialog="isConfirmDialogOpen = false" />
</template>