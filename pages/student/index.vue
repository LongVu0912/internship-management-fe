<script setup lang="ts">
import type Student from '~/types/student/Student';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

definePageMeta({
    layout: "student",
    middleware: "student",
});

// * Imports
const { $apiToken } = useNuxtApp();
const studentRepository = StudentRepository($apiToken);
const nuxtToast = useNuxtToast();
const backendUrl = window.localStorage.getItem("backendUrl") || useRuntimeConfig().public.backendUrl;

// * Refs
const isPageLoading = ref(true);

const student = ref<Student>({} as Student);

const uploadCVModal = ref({
    isOpen: false,
    isSubmitting: false,
    cvFile: null as File | null,
})

const updateStudentModal = ref({
    isOpen: false,
    isUpdating: false,
})

const gender = computed({
    get: () => (student.value.profile.isMale ? 'Nam' : 'Nữ'),
    set: (value: string) => {
        student.value.profile.isMale = (value === 'Nam');
    }
});

const birthday = computed({
    get: () => (new Date(student.value.dob)),
    set: (value: Date) => {
        student.value.dob = format(value, 'yyyy-MM-dd');
    }
})

// * Lifecycle
onBeforeMount(async () => {
    fetchData();
});

// * Functions
const fetchData = async () => {
    isPageLoading.value = true;

    const apiResponse = await studentRepository.getStudentProfile();

    if (apiResponse.code !== 200) {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
        return;
    }

    student.value = apiResponse.result;
    isPageLoading.value = false;
}

const handleInputCVFile = (event: any) => {
    if (event && event.length > 0) {
        uploadCVModal.value.cvFile = event[0];
    } else {
        uploadCVModal.value.cvFile = null;
    }
};

const handleUploadCV = async () => {
    uploadCVModal.value.isSubmitting = true;

    if (uploadCVModal.value.cvFile == null) {
        nuxtToast({
            description: "Hãy chọn file PDF"
        })
        uploadCVModal.value.isSubmitting = false;
        return;
    }

    const apiResponse = await studentRepository.uploadCV({
        cv: uploadCVModal.value.cvFile,
    });

    if (apiResponse.code === 200) {
        nuxtToast({
            description: "Cập nhật CV thành công",
            type: "success",
        });
        fetchData();
        uploadCVModal.value.isOpen = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
    uploadCVModal.value.isSubmitting = false;
}

const handleCloseUpdateModal = async () => {
    await fetchData();
    updateStudentModal.value.isOpen = false;
}

const handleUpdateProfile = async () => {
    updateStudentModal.value.isUpdating = true;

    const apiResponse = await studentRepository.updateProfile(student.value);

    if (apiResponse.code !== 200) {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
    else {
        nuxtToast({
            description: 'Cập nhật thông tin thành công',
            type: 'success',
        });
        fetchData();
        updateStudentModal.value.isOpen = false;
    }

    fetchData();
    updateStudentModal.value.isUpdating = false;
}
</script>

<template>
    <Loading v-if="isPageLoading" />
    <div v-else>
        <UCard class="w-full shadow-md">
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
                                            {{ student?.profile.email ? student?.profile.email : 'N/A' }}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-2">
                                    <UIcon name="mingcute:phone-line" class="h-6 w-6 flex-shrink-0" />
                                    <div class="flex flex-col">
                                        <div class="font-bold">Số điện thoại</div>
                                        <div>
                                            {{ student?.profile.phoneNumber ? student?.profile.phoneNumber : 'N/A' }}
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
                                            {{ student?.year ? student.year.toString() : 'N/A' }}
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

                        <div class="flex flex-row items-center gap-4">
                            <div class="text-xl font-bold leading-6">
                                CV
                            </div>
                            <UButton variant="outline" color="gray" icon="mingcute:upload-2-fill"
                                     @click="uploadCVModal.isOpen = true">
                            </UButton>
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

            <template #footer>
                <div class="flex justify-end">
                    <UButton color="primary" @click="updateStudentModal.isOpen = true">
                        Cập nhật
                    </UButton>
                </div>
            </template>
        </UCard>
    </div>

    <!-- * Modal for uploading CV -->
    <UModal v-model="uploadCVModal.isOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-base font-semibold">
                        Cập nhật CV
                    </div>
                    <UButton :disabled="uploadCVModal.isSubmitting" color="gray" variant="ghost"
                             icon="mingcute:close-fill" class="-my-1"
                             @click="uploadCVModal.isOpen = false" />
                </div>
            </template>
            <div>
                <UInput :disabled="uploadCVModal.isSubmitting" type="file" size="sm" icon="i-heroicons-folder"
                        accept=".pdf"
                        @change="handleInputCVFile" />
            </div>

            <template #footer>
                <UButton class="w-full rounded-md" size="lg" block @click="handleUploadCV" color="primary"
                         :loading="uploadCVModal.isSubmitting">
                    Xác nhận
                </UButton>
            </template>
        </UCard>
    </UModal>

    <UModal :ui="{ width: 'sm:max-w-3xl' }" v-model="updateStudentModal.isOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-base font-semibold">
                        Cập nhật CV
                    </div>
                    <UButton :disabled="updateStudentModal.isUpdating" color="gray" variant="ghost"
                             icon="mingcute:close-fill" class="-my-1"
                             @click="handleCloseUpdateModal" />
                </div>
            </template>

            <div class="flex flex-col gap-3">
                <div class="w-full space-y-1">
                    <div class="font-medium">Giới tính</div>
                    <USelect size="md" :options="['Nữ', 'Nam']" v-model="gender" />
                </div>

                <div class="w-full space-y-1">
                    <div class="font-medium">Ngày sinh</div>
                    <UPopover class="w-full" :popper="{ placement: 'bottom-start' }">
                        <UButton class="w-full" :label="format(new Date(student.dob), 'd MMM, yyy', { locale: vi })"
                                 color="white" size="md">
                        </UButton>

                        <template #panel="{ close }">
                            <DatePicker class="w-full" v-model="birthday" @close="close" />
                        </template>
                    </UPopover>
                </div>

                <div class="w-full space-y-1">
                    <div class="font-medium">Số điện thoại</div>
                    <UInput color="gray" v-model="student.profile.phoneNumber" />
                </div>

                <div class="w-full space-y-1">
                    <div class="font-medium">Bio</div>
                    <UTextarea size="lg" color="gray" :rows="5" v-model="student.profile.bio" class="w-full">
                    </UTextarea>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end">
                    <UButton class="mr-2" color="gray" variant="ghost" @click="handleCloseUpdateModal">
                        Huỷ
                    </UButton>
                    <UButton color="primary" @click="handleUpdateProfile" :loading="updateStudentModal.isUpdating">
                        Cập nhật
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>