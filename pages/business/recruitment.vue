<script setup lang="ts">
definePageMeta({
    layout: "business",
    middleware: "business",
});

// * Imports
const { $apiToken } = useNuxtApp();
const nuxtToast = useNuxtToast();

// * Refs
const isPageLoading = ref(true);
const isCreatingRecruitment = ref(false);

// * Lifecycle
onBeforeMount(async () => {
    isPageLoading.value = false;
});
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
                        <UInput color="white" />
                    </div>

                    <div>
                        <div class="font-medium">Mô tả</div>
                        <UTextarea size="lg" color="white" :rows="3" class="w-full">
                        </UTextarea>
                    </div>
                </div>

                <template #footer>
                    <div class="flex justify-end">
                        <UButton class="mr-2" color="gray" variant="ghost" @click="isCreatingRecruitment = false">
                            Huỷ
                        </UButton>
                        <UButton color="primary" @click="isCreatingRecruitment = false">
                            Tạo
                        </UButton>
                    </div>
                </template>
            </UCard>
        </div>
    </div>
</template>