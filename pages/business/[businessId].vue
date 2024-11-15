<script setup lang="ts">
import type Business from '~/types/business/Business';

definePageMeta({
    layout: 'home',
    middleware: 'logged',
})

// * Imports
const { $apiToken } = useNuxtApp();
const businessRepository = BusinessRepository($apiToken);
const route = useRoute();

// * Refs
const isPageLoading = ref(true);
const business = ref<Business>();

// * Lifecycle
onBeforeMount(async () => {
    const apiResponse = await businessRepository.getBusinessData({
        businessId: route.params.businessId as string,
    });

    if (apiResponse.code !== 200) {
        showError({
            statusCode: 404,
            statusMessage: "Page not found",
        })
    }

    business.value = apiResponse.result;

    isPageLoading.value = false;
})
</script>

<template>

    <Head>
        <Title>{{ business?.name }}</Title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
    </Head>
    <Loading v-if="isPageLoading" />
    <div v-else class="flex flex-col items-center">
        <UCard class="w-full shadow-md md:w-4/5 lg:w-2/3">
            <template #header>
                <div class="flex flex-row items-center gap-4">
                    <div class="shrink-0">
                        <UAvatar
                                 size="xl"
                                 :alt="business?.name" />
                    </div>
                    <div class="text-xl font-bold">
                        {{ business?.name }}
                    </div>
                </div>
            </template>
            <div class="flex flex-col gap-4 py-2">
                <div class="flex w-full flex-col justify-between gap-4 md:flex-row">
                    <div class="flex flex-col gap-4 md:w-1/2">
                        <div class="text-xl font-bold leading-6">
                            Tổng quan
                        </div>
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:location-3-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Địa điểm</div>
                                    <div>{{ business?.location }}</div>
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:book-3-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Ngành</div>
                                    <div>{{ business?.industry }}</div>
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:calendar-2-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Ngày làm việc</div>
                                    <div>{{ business?.workingDay }}</div>
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:time-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Giờ làm việc</div>
                                    <div>{{ business?.workingHour }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-4 rounded-lg bg-gray-500/5 p-4 md:w-1/2">
                        <div class="text-xl font-bold leading-9">
                            Người quản lý
                        </div>
                        <div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:user-2-line" class="h-6 w-6 flex-shrink-0" />
                                <div>{{ business?.managedBy.fullname }}</div>
                                <UBadge variant="subtle">{{ business?.managedBy.isMale ? "Nam" : "Nữ" }}</UBadge>
                            </div>
                        </div>
                        <UDivider size="xs" />
                        <div class="flex flex-row items-center gap-2">
                            <UIcon name="mingcute:phone-line" class="h-6 w-6 flex-shrink-0" />
                            <div>{{ business?.managedBy.phoneNumber }}</div>
                        </div>
                        <div class="flex flex-row items-center gap-2">
                            <UIcon name="mingcute:mail-line" class="h-6 w-6 flex-shrink-0" />
                            <div>{{ business?.managedBy.email }}</div>
                        </div>
                        <div class="flex flex-row items-center gap-2">
                            <UIcon name="mingcute:webhook-line" class="h-6 w-6 flex-shrink-0" />
                            <div>{{ business?.businessWebsite }}</div>
                        </div>
                        <UDivider size="xs" />
                        <div class="text-xl font-bold leading-6">
                            Bio
                        </div>
                        <NewLineText :text="business?.managedBy.bio" />
                    </div>
                </div>
                <UDivider size="xs" />
                <div class="text-xl font-bold leading-6">
                    Giới thiệu
                </div>
                <NewLineText :text="business?.overview" />
            </div>

            <template #footer>
                <div class="flex justify-end">
                    <UButton icon="mingcute:back-line" label="Quay lại" size="lg" color="primary"
                             @click="useRouter().back" />
                </div>
            </template>
        </UCard>
    </div>
</template>