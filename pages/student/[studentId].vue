<script setup lang="ts">
import type Student from '~/types/student/Student';

definePageMeta({
    layout: 'home',
})

// * Imports
const route = useRoute();
const { $apiToken } = useNuxtApp();
const appUtils = AppUtils();
const studentRepository = StudentRepository($apiToken);
const backendUrl = window.localStorage.getItem("backendUrl") || useRuntimeConfig().public.backendUrl;

// * Refs
const student = ref<Student>();
const isPageLoading = ref(true);

// * Lifecycle
onBeforeMount(async () => {
    const studentId = route.params.studentId as string;
    const response = await studentRepository.getStudentProfileById({
        studentId: studentId,
    });

    if (response.code != 200) {
        showError({
            statusCode: 404,
            statusMessage: "Page not found",
        })
    }

    student.value = response.result;
    isPageLoading.value = false;
})
</script>

<template>
    <Loading v-if="isPageLoading" />
    <div v-else class="flex flex-col">
        <div class="flex flex-col justify-between gap-2 md:flex-row">
            <div class="h-auto w-full border border-gray-500 p-4">
                <div class="flex flex-row items-center">
                    <div>
                        <UAvatar
                                 size="lg"
                                 :alt="student?.profile.fullname" />
                    </div>
                    <div class="ml-4 flex flex-col justify-center gap-1">
                        <div class="flex flex-col gap-2">
                            <div>
                                <UBadge
                                        size="md"
                                        color="gray"
                                        :label="student?.profile.username" />
                            </div>
                            <div class="flex gap-2">
                                <UBadge v-if="student?.isSeekingIntern"
                                        size="md"
                                        color="green"
                                        variant="outline"
                                        label="Đang tìm việc" />
                                <UBadge v-else
                                        size="md"
                                        color="red"
                                        variant="outline"
                                        label="Không tìm việc" />
                            </div>
                        </div>
                    </div>
                </div>
                <UDivider label="" size="xs" class="my-4" />
                <div class="flex flex-col gap-2">
                    <div class="text-xl font-semibold">
                        Thông tin cá nhân
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center gap-2">
                            <UIcon name="mingcute:user-4-line" class="h-6 w-6" />
                            <UBadge
                                    size="md"
                                    color="gray"
                                    :label="student?.profile.fullname" />
                        </div>
                        <div class="flex items-center gap-2">
                            <UIcon name="mingcute:birthday-2-line" class="h-6 w-6" />
                            <UBadge
                                    size="md"
                                    color="gray"
                                    :label="student?.dob" />
                        </div>
                        <div class="flex items-center gap-2">
                            <UIcon name="mingcute:mail-line" class="h-6 w-6" />
                            <UBadge
                                    size="md"
                                    color="gray"
                                    :label="student?.profile.email" />
                        </div>
                        <div class="flex items-center gap-2">
                            <UIcon name="mingcute:phone-line" class="h-6 w-6" />
                            <UBadge
                                    size="md"
                                    color="gray"
                                    :label="student?.profile.phoneNumber" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="h-auto w-full border border-gray-500 p-4">
                <div class="flex flex-col gap-2">
                    <div class="text-xl font-medium">
                        Bio
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center gap-2">
                            <UIcon name="mingcute:school-line" class="h-6 w-6" />
                            <UBadge
                                    size="md"
                                    color="gray"
                                    :label="student?.year" />
                        </div>
                        <div class="flex items-center gap-2">
                            <UIcon name="mingcute:building-3-line" class="h-6 w-6" />
                            <UBadge
                                    size="md"
                                    color="gray"
                                    :label="student?.major.faculty.name" />
                        </div>
                        <div class="flex items-center gap-2">
                            <UIcon name="mingcute:book-3-line" class="h-6 w-6" />
                            <UBadge
                                    size="md"
                                    color="gray"
                                    :label="student?.major.name" />
                        </div>
                        <div class="text-justify text-sm font-normal">
                            {{ student?.profile.bio }}
                        </div>
                    </div>
                </div>
                <UDivider label="" size="xs" class="my-4" />

                <div class="flex flex-col items-start gap-2">
                    <div class="text-lg font-medium">
                        CV
                    </div>
                    <UButton v-if="student?.profile.uploadContent != undefined" variant="outline"
                             color="gray"
                             target="_blank"
                             :to="backendUrl + `/file/${student?.profile.uploadContent.uploadContentId}`">
                        {{ student?.profile.uploadContent?.fileName }}
                    </UButton>
                </div>
            </div>
        </div>
    </div>
</template>