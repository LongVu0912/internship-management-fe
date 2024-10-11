<script setup lang="ts">
import type Recruitment from '~/types/recruitment/Recruitment';

definePageMeta({
    layout: "business",
    middleware: "business",
});

// * Imports
const { $apiToken } = useNuxtApp();
const recruitmentRepository = RecruitmentRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const isPageLoading = ref(true);
const isCreatingRecruitment = ref(false);
const recruitment = ref<Recruitment>({} as Recruitment);

// * Lifecycle
onBeforeMount(async () => {
    isPageLoading.value = false;
});

// * Functions
const handleCreateRecruitment = async () => {
    const apiResponse = await recruitmentRepository.createRecruitment(recruitment.value);

    if (apiResponse.code === 200) {
        nuxtToast({
            description: 'Tạo tin tuyển dụng thành công',
            type: 'success',
        });
        isCreatingRecruitment.value = false
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}
</script>

<template>
    <div v-if="isPageLoading">
        <Loading />
    </div>
    <div v-else>
        <div v-if="!isCreatingRecruitment" class="flex flex-col justify-between gap-2 md:flex-row">
            <div class="flex flex-col gap-2 md:flex-row">
                <UInput placeholder="Tìm theo bài tuyển dụng..."
                        class="w-64"
                        size="sm"
                        :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
                    <template #trailing>
                        <UButton icon="heroicons:magnifying-glass-16-solid" color="primary"
                                 class="-me-2.5 rounded-none rounded-r-md" type="submit" />
                    </template>
                </UInput>
            </div>
            <div>
                <UButton color="primary" @click="isCreatingRecruitment = true">Tạo tuyển dụng</UButton>
            </div>
        </div>

        <div v-else>
            <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                            Tạo tin tuyển dụng
                        </div>
                    </div>
                </template>

                <div class="flex flex-col gap-3">
                    <div class="text-base font-semibold">THÔNG TIN TUYỂN DỤNG</div>

                    <div>
                        <div class="font-medium">Tựa đề</div>
                        <UInput v-model="recruitment.title" />
                    </div>

                    <div>
                        <div class="font-medium">Mô tả</div>
                        <UTextarea size="lg" color="gray" :rows="3" class="w-full" v-model="recruitment.description">
                        </UTextarea>
                    </div>

                    <div class="flex flex-col gap-4 md:flex-row">
                        <div class="w-full">
                            <div class="font-medium">Địa điểm</div>
                            <UInput v-model="recruitment.location" />
                        </div>
                        <div class="w-full">
                            <div class="font-medium">Loại</div>
                            <UInput v-model="recruitment.type" />
                        </div>
                    </div>

                    <div class="flex flex-col gap-4 md:flex-row">
                        <div class="w-full">
                            <div class="font-medium">Ngày làm việc</div>
                            <UInput v-model="recruitment.workingDay" />
                        </div>
                        <div class="w-full">
                            <div class="font-medium">Giờ làm việc</div>
                            <UInput v-model="recruitment.workingHour" />
                        </div>
                    </div>

                    <div class="flex flex-col gap-4 md:flex-row">
                        <div class="w-full">
                            <div class="font-medium">Kỹ năng</div>
                            <UInput v-model="recruitment.keySkills" />
                        </div>
                        <div class="w-full">
                            <div class="font-medium">Vị trí</div>
                            <UInput v-model="recruitment.position" />
                        </div>
                    </div>
                </div>

                <template #footer>
                    <div class="flex justify-end">
                        <UButton class="mr-2" color="gray" variant="ghost" @click="isCreatingRecruitment = false">
                            Huỷ
                        </UButton>
                        <UButton color="primary" @click="handleCreateRecruitment">
                            Tạo
                        </UButton>
                    </div>
                </template>
            </UCard>
        </div>
    </div>
</template>