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
    const apiResponse = await studentRepository.getStudentProfileById({
        studentId: studentId,
    });

    if (apiResponse.code !== 200) {
        showError({
            statusCode: 404,
            statusMessage: "Page not found",
        })
    }

    student.value = apiResponse.result;
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
                                 :alt="student?.profile.fullname" />
                    </div>
                    <div class="space-y-1">
                        <div class="text-xl font-bold">
                            {{ student?.profile.fullname }}
                        </div>
                        <div>
                            <UBadge v-if="student?.isSeekingIntern" size="md" color="green" variant="subtle"
                                    label="Tìm thực tập" />
                            <UBadge v-else size="md" color="red" variant="subtle" label="Đã thực tập" />
                        </div>
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
                                    <UIcon name="mingcute:user-4-line" class="h-6 w-6 flex-shrink-0" />
                                    <div class="flex flex-col">
                                        <div class="font-bold">MSSV</div>
                                        <div>
                                            {{ student?.studentId }}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-2">
                                    <UIcon name="mingcute:birthday-2-line" class="h-6 w-6 flex-shrink-0" />
                                    <div class="flex flex-col">
                                        <div class="font-bold">Ngày sinh</div>
                                        <div>
                                            {{ format(student?.dob ? new Date(student.dob) : new Date(), 'd MMM, yyy', { locale: vi }) }}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-2">
                                    <UIcon name="mingcute:mail-line" class="h-6 w-6 flex-shrink-0" />
                                    <div class="flex flex-col">
                                        <div class="font-bold">Email</div>
                                        <div>
                                            {{ student?.profile.email }}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-2">
                                    <UIcon name="mingcute:phone-line" class="h-6 w-6 flex-shrink-0" />
                                    <div class="flex flex-col">
                                        <div class="font-bold">Số điện thoại</div>
                                        <div>
                                            {{ student?.profile.phoneNumber }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-3 md:w-1/2">
                                <div class="flex flex-row items-center gap-2">
                                    <UIcon name="mingcute:user-info-line" class="h-6 w-6 flex-shrink-0" />
                                    <div class="flex flex-col">
                                        <div class="font-bold">Giới tính</div>
                                        <div>
                                            {{ student?.profile.isMale ? 'Nam' : 'Nữ' }}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-2">
                                    <UIcon name="mingcute:school-line" class="h-6 w-6 flex-shrink-0" />
                                    <div class="flex flex-col">
                                        <div class="font-bold">Khóa</div>
                                        <div>
                                            {{ student?.year.toString() }}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-2">
                                    <UIcon name="mingcute:building-3-line" class="h-6 w-6 flex-shrink-0" />
                                    <div class="flex flex-col">
                                        <div class="font-bold">Khoa</div>
                                        <div>
                                            {{ student?.major.faculty.name }}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-2">
                                    <UIcon name="mingcute:book-6-line" class="h-6 w-6 flex-shrink-0" />
                                    <div class="flex flex-col">
                                        <div class="font-bold">Ngành</div>
                                        <div>
                                            {{ student?.major.name }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <UDivider size="xs" />

                        <div class="text-xl font-bold leading-6">
                            CV
                        </div>

                        <div>
                            <UButton v-if="student?.profile.uploadContent != undefined" variant="link" target="_blank"
                                     :padded="false"
                                     :to="backendUrl + `/file/${student?.profile.uploadContent.uploadContentId}`"
                                     :label="student?.profile.uploadContent?.fileName" />
                            <div v-else class="font-normal">
                                Không có
                            </div>
                        </div>
                        <UDivider size="xs" />

                        <div class="text-xl font-bold leading-6">
                            Bio
                        </div>
                        <NewLineText :text="student?.profile.bio" />
                    </div>
                </div>
            </div>
        </UCard>
    </div>
</template>