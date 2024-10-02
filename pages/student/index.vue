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
const userRepository = UserRepository($apiToken);
const studentRepository = StudentRepository($apiToken);
const nuxtToast = useNuxtToast();
const backendUrl = window.localStorage.getItem("backendUrl") || useRuntimeConfig().public.backendUrl;

// * Refs
const isPageLoading = ref(true);
const isForgotPasswordModalOpen = ref(false);
const isCVModalOpen = ref(false);
const isSubmitting = ref(false);
const cvFile = ref<File | null>(null);
const isConfirmDialogOpen = ref(false);
const isUpdating = ref(false);

const student = ref<Student>();

const state = reactive({
    oldPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined
});

const studentUpdateInformation = reactive({
    dob: ref(new Date()),
    phoneNumber: '',
    bio: '',
    isMale: false,
    isSeekingIntern: false,
    email: '',
});

// Computed property to map boolean to string
const genderOptions = ['Nữ', 'Nam'];

const gender = computed({
    get: () => (studentUpdateInformation.isMale ? 'Nam' : 'Nữ'),
    set: (value: string) => {
        studentUpdateInformation.isMale = (value === 'Nam');
    }
});

// * Lifecycle
onBeforeMount(async () => {
    fetchData();
});

// * Functions
const fetchData = async () => {
    isPageLoading.value = true;

    const apiResponse = await studentRepository.getStudentProfile();

    if (apiResponse.code === 200) {
        student.value = apiResponse.result;

        studentUpdateInformation.bio = student.value?.profile.bio || '';
        studentUpdateInformation.dob = student.value?.dob ? new Date(student.value.dob) : new Date();
        studentUpdateInformation.isMale = student.value?.profile.isMale || false;
        studentUpdateInformation.isSeekingIntern = student.value?.isSeekingIntern || false;
        studentUpdateInformation.phoneNumber = student.value?.profile.phoneNumber || '';
        studentUpdateInformation.email = student.value?.profile.email || '',

            isPageLoading.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

const submitChangePassword = async () => {
    if (!state.oldPassword || !state.newPassword || !state.confirmPassword) {
        nuxtToast({
            description: "Hãy nhập đầy đủ thông tin",
            type: "info",
        });
        return;
    }

    if (state.newPassword !== state.confirmPassword) {
        nuxtToast({
            description: "Mật khẩu xác nhận không khớp",
            type: "error",
        });
        return;
    }

    if (state.oldPassword == state.newPassword) {
        nuxtToast({
            description: "Mật khẩu mới không được trùng với mật khẩu cũ",
            type: "error",
        });
        return;
    }

    isSubmitting.value = true;

    const apiResponse = await userRepository.changePassword({
        oldPassword: state.oldPassword,
        newPassword: state.newPassword,
    });

    if (apiResponse.code === 200) {
        nuxtToast({
            description: "Đổi mật khẩu thành công",
            type: "success",
        });
        isForgotPasswordModalOpen.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
    isSubmitting.value = false;
};

const handleInputCVFile = (event: any) => {
    if (event && event.length > 0) {
        cvFile.value = event[0];
    } else {
        cvFile.value = null;
    }
};

const handleUploadCV = async () => {
    isSubmitting.value = true;

    if (cvFile.value == null) {
        nuxtToast({
            description: "Hãy chọn file PDF"
        })
        isSubmitting.value = false;
        return;
    }

    const apiResponse = await studentRepository.uploadCV({
        cv: cvFile.value,
    });

    if (apiResponse.code === 200) {
        nuxtToast({
            description: "Cập nhật CV thành công",
            type: "success",
        });
        fetchData();
        isCVModalOpen.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
    isSubmitting.value = false;
}

const handleUpdateButton = () => {
    if (isUpdating.value == false) {
        isUpdating.value = true;
    }
    else {
        isConfirmDialogOpen.value = true;
    }
}

const onDialogConfirm = async () => {
    const studentUpdateObject = {
        dob: studentUpdateInformation.dob.toISOString().split('T')[0], // Format date as "YYYY-MM-DD"
        profile: {
            isMale: studentUpdateInformation.isMale,
            bio: studentUpdateInformation.bio,
            phoneNumber: studentUpdateInformation.phoneNumber,
            email: studentUpdateInformation.email
        },
    };

    const apiResponse = await studentRepository.updateProfile(studentUpdateObject);

    if (apiResponse.code === 200) {
        nuxtToast({
            description: "Cập nhật thông tin thành công",
            type: "success",
        });
        fetchData();
        isUpdating.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

const onDialogCancel = () => {
    isUpdating.value = false;
}

</script>

<template>
    <div v-if="isPageLoading">
        <Loading />
    </div>
    <div v-else>
        <div class="flex flex-col justify-between gap-2 md:flex-row md:gap-12">
            <div class="flex w-full flex-col gap-2">
                <div class="text-lg font-semibold">
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
                                <UBadge v-if="studentUpdateInformation.isSeekingIntern"
                                        size="lg"
                                        color="green"
                                        variant="outline"
                                        label="Đang tìm việc" />
                                <UBadge v-else
                                        size="lg"
                                        color="red"
                                        variant="outline"
                                        label="Không tìm việc" />
                                <UButton v-if="isUpdating"
                                         variant="solid"
                                         color="gray"
                                         icon="mingcute:refresh-3-line"
                                         class="border-primary-500 border"
                                         @click="studentUpdateInformation.isSeekingIntern = !studentUpdateInformation.isSeekingIntern">
                                </UButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <UDivider size="xs" class="my-2 flex md:hidden" />

            <div class="flex w-full flex-col gap-2">
                <div class="text-lg font-semibold">
                    CV
                </div>
                <div class="flex flex-row items-center gap-4">
                    <UButton v-if="student?.profile.uploadContent != undefined" variant="link" color="gray"
                             target="_blank"
                             :to="backendUrl + `/file/${student?.profile.uploadContent.uploadContentId}`">
                        {{ student?.profile.uploadContent?.fileName }}
                    </UButton>
                    <UButton variant="outline" color="gray" icon="mingcute:upload-2-fill" @click="isCVModalOpen = true">
                    </UButton>
                </div>
            </div>
        </div>

        <UDivider size="xs" class="mb-4 mt-6" />

        <div class="flex flex-col justify-between gap-2 md:flex-row md:gap-12">
            <div class="flex w-full flex-col gap-2">
                <div class="text-lg font-semibold">
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
                        <UInput v-if="!isUpdating" icon="mingcute:birthday-2-line"
                                class="w-full"
                                :model-value="format(studentUpdateInformation.dob, 'd MMM, yyy', { locale: vi })"
                                disabled />
                        <UPopover v-else class="w-full" :popper="{ placement: 'bottom-start' }">
                            <UButton :ui="{ base: 'disabled:opacity-100' }"
                                     class="border-primary-500 w-full rounded-md border"
                                     :label="format(studentUpdateInformation.dob, 'd MMM, yyy', { locale: vi })"
                                     color="gray"
                                     size="md"
                                     :disabled="!isUpdating">
                                <template #leading>
                                    <UIcon name="mingcute:birthday-2-line"
                                           class="h-5 w-5 text-gray-900 dark:text-gray-100" />
                                </template>
                            </UButton>

                            <template #panel="{ close }">
                                <DatePicker class="w-full" v-model="studentUpdateInformation.dob" @close="close" />
                            </template>
                        </UPopover>
                    </div>
                    <div class="flex items-center gap-2">
                        <UInput icon="mingcute:mail-line" type="email"
                                :class="['w-full rounded-md', { 'border-primary-500 border': isUpdating }]"
                                v-model="studentUpdateInformation.email" :disabled="!isUpdating" />
                    </div>
                    <div class="flex items-center gap-2">
                        <UInput icon="mingcute:phone-line"
                                :class="['w-full rounded-md', { 'border-primary-500 border': isUpdating }]"
                                v-model="studentUpdateInformation.phoneNumber" :disabled="!isUpdating" />
                    </div>
                </div>
            </div>

            <UDivider size="xs" class="my-2 flex md:hidden" />

            <div class="flex w-full flex-col gap-2">
                <div class="text-lg font-medium">
                    Bio
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                        <UInput v-if="!isUpdating" icon="mingcute:user-info-line" class="w-full" :model-value="gender"
                                disabled />
                        <USelect v-else icon="mingcute:user-info-line" size="md" :options="genderOptions"
                                 class="border-primary-500 w-full rounded-md border" v-model="gender" />
                    </div>
                    <div class="flex items-center gap-2">
                        <UInput icon="mingcute:school-line" class="w-full" :model-value="student?.year.toString()"
                                disabled />
                    </div>
                    <div class="flex items-center gap-2">
                        <UInput icon="mingcute:building-3-line" class="w-full"
                                :model-value="student?.major.faculty.name"
                                disabled />
                    </div>
                    <div class="flex items-center gap-2">
                        <UInput icon="mingcute:book-3-line" class="w-full" :model-value="student?.major.name"
                                disabled />
                    </div>

                </div>
            </div>
        </div>

        <UDivider size="xs" class="mb-4 mt-6" />

        <div class="flex w-full flex-col gap-2">
            <div class="text-lg font-medium">
                Mô tả
            </div>
            <UTextarea :ui="{ base: 'disabled:cursor-text disabled:select-text' }" :disabled="!isUpdating" size="lg"
                       :color="!isUpdating ? 'gray' : 'primary'" :rows="5" v-model="studentUpdateInformation.bio"
                       class="w-full">
            </UTextarea>
        </div>

        <div class="mt-4 flex flex-row justify-between gap-2">
            <div></div>
            <div class="flex gap-2">
                <UButton color="primary" variant="outline" @click="isForgotPasswordModalOpen = true">Đổi mật khẩu
                </UButton>
                <UButton color="primary" @click="handleUpdateButton">
                    {{ isUpdating == true ? "Xác nhận" : "Cập nhật" }}
                </UButton>
            </div>
        </div>
    </div>

    <!-- * Modal for forgot password -->
    <UModal v-model="isForgotPasswordModalOpen" prevent-close>
        <UCard
               :ui="{ body: { padding: 'px-4 pb-4 lg:px-8 lg:pb-8' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', strategy: 'override' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Quên mật khẩu
                    </h3>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="isForgotPasswordModalOpen = false" />
                </div>
            </template>
            <div>
                <form class="flex w-full flex-col justify-start" :state="state" @submit.prevent="submitChangePassword">
                    <div class="mb-2 mt-4 text-sm font-medium">Mật khẩu cũ</div>
                    <UInput v-model="state.oldPassword" type="password" icon="mingcute:user-4-line" size="lg"
                            color="primary" autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Mật khẩu mới</div>
                    <UInput v-model="state.newPassword" type="password" icon="mingcute:mail-line" size="lg"
                            color="primary"
                            autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Xác nhận mật khẩu</div>
                    <UInput v-model="state.confirmPassword" type="password" icon="mingcute:mail-line" size="lg"
                            color="primary" autocomplete="on" />
                    <UButton :loading="isSubmitting" class="mt-6 w-full rounded-md" size="lg" type="submit" block>
                        Đổi mật khẩu
                    </UButton>
                </form>
            </div>
        </UCard>
    </UModal>

    <!-- * Modal for uploading CV -->
    <UModal v-model="isCVModalOpen" prevent-close>
        <UCard
               :ui="{ body: { padding: 'px-4 pb-4 lg:px-8 lg:pb-8' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', strategy: 'override' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Cập nhật CV
                    </h3>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="isCVModalOpen = false" />
                </div>
            </template>
            <div class="mt-4">
                <UInput type="file" size="sm" icon="i-heroicons-folder" accept=".pdf" @change="handleInputCVFile" />
                <UButton class="mt-6 w-full rounded-md" size="lg" block @click="handleUploadCV" :loading="isSubmitting">
                    Xác nhận
                </UButton>
            </div>
        </UCard>
    </UModal>

    <ConfirmDialog :isOpen="isConfirmDialogOpen" title="Cập nhật thông tin"
                   description="Bạn có chắc muốn cập nhật thông tin?" :onConfirm="onDialogConfirm"
                   :onCancel="onDialogCancel"
                   @hideDialog="isConfirmDialogOpen = false" />
</template>