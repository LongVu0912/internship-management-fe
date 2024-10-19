<script setup lang="ts">
import type Instructor from '~/types/instructor/Instructor';
import type Profile from '~/types/profile/Profile';
import type Recruitment from '~/types/recruitment/Recruitment';
import type RecruitmentRequest from '~/types/recruitment/RecruitmentRequest';
import { InstructorRepository } from '~/utils/InstructorRepository';

definePageMeta({
    layout: 'home',
    middleware: 'logged',
})

// * Imports
const { $apiToken } = useNuxtApp();
const instructorRepository = InstructorRepository($apiToken);
const recruitmentRepository = RecruitmentRepository($apiToken);
const nuxtToast = useNuxtToast();
const route = useRoute();

// * Refs
const isPageLoading = ref(true);
const isInstructorDataLoading = ref(false);
const isConfirmDialogOpen = ref(false);

const instructors = ref<Instructor[]>();

const selectedInstructorProfile = ref<Profile>({} as Profile);
const instructorProfiles = ref<Profile[]>([]);

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
    isInstructorDataLoading.value = true;

    const apiResponse = await instructorRepository.getAllInstructor();

    if (apiResponse.code != 200) {
        showError({
            statusCode: 404,
            statusMessage: "Page not found",
        })
    }

    instructors.value = apiResponse.result;

    await instructors.value?.forEach((instructor) => {
        instructorProfiles.value.push(instructor.profile);
    })

    recruitmentRequest.value.recruitmentId = recruitmentId;
    selectedInstructorProfile.value = instructorProfiles.value[0];

    isInstructorDataLoading.value = false;
    isConfirmDialogOpen.value = true;
}

const onDialogConfirm = async () => {
    recruitmentRequest.value.instructorId = selectedInstructorProfile.value?.profileId;
    console.log(recruitmentRequest.value);

    const apiResponse = await recruitmentRepository.requestRecruitment(recruitmentRequest.value);

    if (apiResponse.code === 200) {
        nuxtToast({
            description: 'Gửi yêu cầu thành công',
            type: 'success',
            timeout: 2000,
        });

        isConfirmDialogOpen.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
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
    <template v-else>
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
                        <UButton label="Ứng tuyển ngay" size="lg" color="primary" :loading="isInstructorDataLoading"
                                 @click="openConfirmDialog(recruitment?.recruitmentId || '')" />
                    </div>
                </div>
            </template>
        </UCard>
    </template>

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

            <div>
                <div class="mb-2 text-base font-medium">Tin nhắn tới doanh nghiệp</div>
                <UTextarea :rows="3" v-model="recruitmentRequest.messageToBusiness" type="text" size="lg" color="gray"
                           placeholder="Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) và nêu rõ mong muốn, lý do bạn muốn ứng tuyển cho vị trí này." />
                <div class="mb-2 mt-4 text-base font-medium">Giảng viên hướng dẫn</div>
                <USelectMenu size="lg" color="gray" :options="instructorProfiles" option-attribute="fullname"
                             v-model="selectedInstructorProfile">
                </USelectMenu>
                <div class="mb-2 mt-4 text-base font-medium">Tin nhắn tới giảng viên</div>
                <UTextarea :rows="3" color="gray" v-model="recruitmentRequest.messageToInstructor" type="text" size="lg"
                           placeholder="Tin nhắn tới giảng viên yêu cầu hướng dẫn thực tập" />
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