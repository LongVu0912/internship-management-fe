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
    const apiResponse = await businessRepository.getBusinessById({
        businessId: route.params.businessId as string,
    });

    if (apiResponse.code != 200) {
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
    <div v-else class="px-4 md:px-28">
        <UCard>
            <template #header>
                <div class="flex flex-row items-center gap-4">
                    <div class="shrink-0">
                        <NuxtImg src="/hcmute.png" class="h-16 w-16 md:h-24 md:w-24" quality="80" alt="hcmute" />
                    </div>
                    <div class="text-xl font-bold">
                        {{ business?.name }}
                    </div>
                </div>
            </template>
            <div class="flex gap-4 py-2">
                <div class="flex w-full flex-col justify-between gap-4 md:flex-row">
                    <div class="flex flex-col gap-4 md:w-1/2">
                        <div class="text-xl font-bold leading-6">
                            Tổng quan
                        </div>
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:location-3-line" class="h-6 w-6 flex-shrink-0" />
                                <div>{{ business?.location }}</div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:profile-line" class="h-6 w-6 flex-shrink-0" />
                                <div>{{ business?.type }}</div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:book-3-line" class="h-6 w-6 flex-shrink-0" />
                                <div>{{ business?.industry }}</div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:calendar-2-line" class="h-6 w-6 flex-shrink-0" />
                                <div>{{ business?.workingDay }}</div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:time-line" class="h-6 w-6 flex-shrink-0" />
                                <div>{{ business?.workingHour }}</div>
                            </div>
                        </div>
                        <UDivider size="xs" />
                        <div class="text-xl font-bold leading-6">
                            Giới thiệu
                        </div>
                        <p>
                            {{ business?.overview }}
                        </p>
                    </div>

                    <div class="flex flex-col gap-4 rounded-lg bg-gray-500/5 p-4 md:w-1/2">
                        <div class="text-xl font-bold leading-9">
                            Người quản lý
                        </div>
                        <div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:user-2-line" class="h-6 w-6 flex-shrink-0" />
                                <div>{{ business?.profile.fullname }}</div>
                                <UBadge variant="outline">{{ business?.profile.isMale ? "Nam" : "Nữ" }}</UBadge>
                            </div>
                        </div>
                        <UDivider size="xs" />
                        <div class="flex flex-row items-center gap-2">
                            <UIcon name="mingcute:phone-line" class="h-6 w-6 flex-shrink-0" />
                            <div>{{ business?.profile.phoneNumber }}</div>
                        </div>
                        <div class="flex flex-row items-center gap-2">
                            <UIcon name="mingcute:mail-line" class="h-6 w-6 flex-shrink-0" />
                            <div>{{ business?.profile.email }}</div>
                        </div>
                        <UDivider size="xs" />
                        <div class="flex flex-row items-center gap-2">
                            <UIcon name="mingcute:webhook-line" class="h-6 w-6 flex-shrink-0" />
                            <div>https://business.com</div>
                        </div>
                        <div class="flex flex-row items-center gap-2">

                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end">
                    <UButton label="Quay lại" size="lg" color="primary" @click="useRouter().back" />
                </div>
            </template>
        </UCard>
    </div>
</template>