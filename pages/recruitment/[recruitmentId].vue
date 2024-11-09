<script setup lang="ts">
import Role from '~/types/enums/Role';
import type Recruitment from '~/types/recruitment/Recruitment';
import type RecruitmentRequest from '~/types/recruitment/RecruitmentRequest';

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
const recruitmentRequest = ref<RecruitmentRequest>({} as RecruitmentRequest);

// * Lifecycle
onBeforeMount(async () => {
    const apiResponse = await recruitmentRepository.getRecruitmentById({
        recruitmentId: route.params.recruitmentId as string,
    });

    if (apiResponse.code != 200) {
        showError({
            statusCode: 404,
            statusMessage: "Page not found",
        })
    }

    recruitment.value = apiResponse.result;

    isPageLoading.value = false;
})

// * Functions
const openConfirmDialog = async (recruitmentId: string) => {
    recruitmentRequest.value.recruitmentId = recruitmentId;
    isConfirmDialogOpen.value = true;
}

const onDialogConfirm = async () => {
    const apiResponse = await recruitmentRepository.requestRecruitment(recruitmentRequest.value);

    if (apiResponse.code !== 200) {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
        return;
    }

    nuxtToast({
        description: 'Gửi yêu cầu thành công',
        type: 'success',
    });

    isConfirmDialogOpen.value = false;
}

const onDialogCancel = () => {
    isConfirmDialogOpen.value = false;
}
</script>

<template>

    <Head>
        <Title>{{ recruitment?.title }}</Title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
    </Head>
    <Loading v-if="isPageLoading" />
    <div v-else class="flex flex-col items-center">
        <UCard class="w-full shadow-md md:w-4/5 lg:w-2/3">
            <template #header>
                <div class="text-center text-xl font-bold">
                    {{ recruitment?.title }}
                </div>
            </template>
            <div class="flex flex-col gap-4 py-4">
                <div class="flex w-full flex-col gap-2 text-base md:flex-row">
                    <div class="md:w-1/2">
                        <div class="flex flex-col gap-3">
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:building-3-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Công ty</div>
                                    <div>{{ recruitment?.business.name }}</div>
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:location-3-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Địa điểm</div>
                                    <div>{{ recruitment?.location }}</div>
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:user-2-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Vị trí</div>
                                    <div>{{ recruitment?.position }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="md:w-1/2">
                        <div class="flex flex-col gap-3">
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:briefcase-2-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Loại hình</div>
                                    <div>{{ recruitment?.type }}</div>
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:calendar-2-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Ngày làm việc</div>
                                    <div>{{ recruitment?.workingDay }}</div>
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:time-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Giờ làm việc</div>
                                    <div>{{ recruitment?.workingHour }}</div>
                                </div>
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
                                 :to="`/business/${recruitment?.business.businessId}`" />
                        <UButton v-if="useUserState().value.role === Role.ROLE_STUDENT" label="Ứng tuyển ngay" size="lg"
                                 color="primary"
                                 @click="openConfirmDialog(recruitment?.recruitmentId || '')" />
                    </div>
                </div>
            </template>
        </UCard>
    </div>

    <UModal v-model="isConfirmDialogOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-base font-semibold">
                        Bạn có chắc muốn ứng tuyển công việc này?
                    </div>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="isConfirmDialogOpen = false" />
                </div>
            </template>

            <div class="w-full space-y-1 py-2">
                <div class="mb-2 text-base font-medium">Tin nhắn tới doanh nghiệp</div>
                <UTextarea :rows="3" v-model="recruitmentRequest.messageToBusiness" type="text" size="lg" color="gray"
                           placeholder="Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) và nêu rõ mong muốn, lý do bạn muốn ứng tuyển cho vị trí này." />
            </div>

            <template #footer>
                <div class="flex justify-end">
                    <UButton class="mr-2" color="gray" variant="ghost" @click="onDialogCancel">
                        Huỷ
                    </UButton>
                    <UButton color="primary" @click="onDialogConfirm">
                        Xác nhận
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>