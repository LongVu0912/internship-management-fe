<script setup lang="ts">
import type Instructor from '~/types/instructor/Instructor';

definePageMeta({
    layout: 'home',
    middleware: "logged",
})

// * Imports
const route = useRoute();
const { $apiToken } = useNuxtApp();
const instructorRepository = InstructorRepository($apiToken);

// * Refs
const instructor = ref<Instructor>();
const isPageLoading = ref(true);

// * Lifecycle
onBeforeMount(async () => {
    const instructorId = route.params.instructorId as string;
    const apiResponse = await instructorRepository.getInstructorData({
        instructorId: instructorId,
    });

    if (apiResponse.code != 200) {
        showError({
            statusCode: 404,
            statusMessage: "Page not found",
        })
    }

    instructor.value = apiResponse.result;
    isPageLoading.value = false;
})
</script>

<template>
    <Loading v-if="isPageLoading" />
    <div v-else class="flex flex-col items-center">
        <UCard class="w-full shadow-md md:w-4/5 lg:w-2/3">
            <template #header>
                <div class="flex flex-row items-center gap-4">
                    <div class="shrink-0">
                        <UAvatar
                                 size="xl"
                                 :alt="instructor?.profile.fullname" />
                    </div>
                    <div class="text-xl font-bold">
                        {{ instructor?.profile.fullname }}
                    </div>
                </div>
            </template>
            <div class="flex gap-4 py-2">
                <div class="flex w-full flex-col justify-between gap-4 md:flex-row">
                    <div class="flex w-full flex-col gap-4">
                        <div class="text-xl font-bold leading-6">
                            Thông tin cá nhân
                        </div>
                        <div class="flex w-full flex-col gap-3 md:flex-row">
                            <div class="space-y-3 md:w-1/2">
                                <div class="flex flex-row items-center gap-2">
                                    <UIcon name="mingcute:building-3-line" class="h-6 w-6 flex-shrink-0" />
                                    <div class="flex flex-col">
                                        <div class="font-bold">Khoa</div>
                                        <div>{{ instructor?.faculty.facultyId + ' - ' + instructor?.faculty.name }}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-2">
                                    <UIcon name="mingcute:mail-line" class="h-6 w-6 flex-shrink-0" />
                                    <div class="flex flex-col">
                                        <div class="font-bold">Email</div>
                                        <div>{{ instructor?.profile.email }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-3 md:w-1/2">
                                <div class="flex flex-row items-center gap-2">
                                    <UIcon name="mingcute:phone-line" class="h-6 w-6 flex-shrink-0" />
                                    <div class="flex flex-col">
                                        <div class="font-bold">Số điện thoại</div>
                                        <div>{{ instructor?.profile.phoneNumber }}</div>
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-2">
                                    <UIcon name="mingcute:user-info-line" class="h-6 w-6 flex-shrink-0" />
                                    <div class="flex flex-col">
                                        <div class="font-bold">Giới tính</div>
                                        <div>{{ instructor?.profile.isMale ? 'Nam' : 'Nữ' }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <UDivider size="xs" />
                        <div class="text-xl font-bold leading-6">
                            Bio
                        </div>
                        <NewLineText :text="instructor?.profile.bio" />
                    </div>
                </div>
            </div>
        </UCard>
    </div>
</template>