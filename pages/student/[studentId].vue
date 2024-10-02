<script setup lang="ts">
import type Student from '~/types/student/Student';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

definePageMeta({
    layout: 'home',
    middleware: "logged",
})

// * Imports
const route = useRoute();
const { $apiToken } = useNuxtApp();
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
    <div v-else class="px-4 lg:px-12">
        <div class="flex flex-col justify-between gap-2 md:flex-row md:gap-12">
            <div class="flex w-full flex-col gap-2">
                <div class="text-xl font-semibold">
                    Tài khoản
                </div>
                <div class="flex flex-row items-center gap-4">
                    <div>
                        <UAvatar
                                 size="xl"
                                 :alt="student?.profile.fullname" />
                    </div>
                    <div class="flex flex-col justify-center gap-1">
                        <div class="flex flex-col gap-2">
                            <div>
                                <UBadge
                                        size="lg"
                                        color="gray"
                                        variant="solid"
                                        :label="student?.profile.username" />
                            </div>
                            <div class="flex gap-2">
                                <UBadge v-if="student?.isSeekingIntern"
                                        size="lg"
                                        color="green"
                                        variant="outline"
                                        label="Đang tìm việc" />
                                <UBadge v-else
                                        size="lg"
                                        color="red"
                                        variant="outline"
                                        label="Không tìm việc" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <UDivider size="xs" class="my-2 flex md:hidden" />

            <div class="flex w-full flex-col gap-2">
                <div class="text-xl font-semibold">
                    CV
                </div>
                <div class="flex flex-row items-center gap-4">
                    <UButton v-if="student?.profile.uploadContent != undefined" variant="link"
                             target="_blank"
                             :to="backendUrl + `/file/${student?.profile.uploadContent.uploadContentId}`">
                        {{ student?.profile.uploadContent?.fileName }}
                    </UButton>
                </div>
            </div>
        </div>

        <UDivider size="xs" class="mb-4 mt-6" />

        <div class="flex flex-col justify-between gap-2 md:flex-row md:gap-12">
            <div class="flex w-full flex-col gap-2">
                <div class="text-xl font-semibold">
                    Thông tin cá nhân
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                        <UInput icon="mingcute:user-4-line"
                                class="w-full"
                                :model-value="student?.profile.fullname"
                                disabled />
                    </div>
                    <div class="flex items-center gap-2">
                        <UInput icon="mingcute:birthday-2-line"
                                class="w-full"
                                :model-value="format(student?.dob ? new Date(student.dob) : new Date(), 'd MMM, yyy', { locale: vi })"
                                disabled />
                    </div>
                    <div class="flex items-center gap-2">
                        <UInput icon="mingcute:mail-line"
                                class="w-full"
                                :model-value="student?.profile.email"
                                disabled />
                    </div>
                    <div class="flex items-center gap-2">
                        <UInput icon="mingcute:phone-line"
                                class="w-full"
                                :model-value="student?.profile.phoneNumber"
                                disabled />
                    </div>
                </div>
            </div>

            <UDivider size="xs" class="my-2 flex md:hidden" />

            <div class="flex w-full flex-col gap-2">
                <div class="text-xl font-medium">
                    Bio
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                        <UInput icon="mingcute:user-info-line"
                                class="w-full"
                                :model-value="student?.profile.isMale ? 'Nam' : 'Nữ'"
                                disabled />
                    </div>
                    <div class="flex items-center gap-2">
                        <UInput icon="mingcute:school-line"
                                class="w-full"
                                :model-value="student?.year.toString()"
                                disabled />
                    </div>
                    <div class="flex items-center gap-2">
                        <UInput icon="mingcute:building-3-line"
                                class="w-full"
                                :model-value="student?.major.faculty.name"
                                disabled />
                    </div>
                    <div class="flex items-center gap-2">
                        <UInput icon="mingcute:book-3-line"
                                class="w-full"
                                :model-value="student?.major.name"
                                disabled />
                    </div>
                </div>
            </div>
        </div>

        <UDivider size="xs" class="mb-4 mt-6" />

        <div class="flex w-full flex-col gap-2">
            <div class="text-xl font-medium">
                Mô tả
            </div>
            <UTextarea :ui="{ base: 'disabled:cursor-text disabled:select-text', placeholder: 'placeholder-gray-900 dark:placeholder-gray-100' }"
                       disabled
                       size="lg"
                       color="gray" :rows="5" :model-value="student?.profile.bio" class="w-full">
            </UTextarea>
        </div>
    </div>
</template>