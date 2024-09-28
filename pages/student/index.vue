<script setup lang="ts">
import type Student from '~/types/student/Student';

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
const updateInformationStudent = ref<Student>();

const state = reactive({
    oldPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined
});

const studentInformation = reactive({
    dob: '',
    phoneNumber: '',
    bio: '',
    isMale: false,
    isSeekingIntern: false,
});

// Computed property to map boolean to string
const genderOptions = ['Nữ', 'Nam'];

const gender = computed({
    get: () => (studentInformation.isMale ? 'Nam' : 'Nữ'),
    set: (value: string) => {
        studentInformation.isMale = (value === 'Nam');
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

        studentInformation.bio = student.value?.profile.bio || '';
        studentInformation.dob = student.value?.dob || '';
        studentInformation.isMale = student.value?.profile.isMale || false;
        studentInformation.isSeekingIntern = student.value?.isSeekingIntern || false;
        studentInformation.phoneNumber = student.value?.profile.phoneNumber || '';

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
        nuxtToast({
            description: "Hãy điền thông tin mới",
        })
    }
    else {
        isConfirmDialogOpen.value = true;
    }
}

const onDialogConfirm = () => {
    nuxtToast({
        description: "Chưa làm xong",
    })
    isUpdating.value = false;
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
        <div class="flex flex-col gap-2">
            <div class="text-lg font-medium">
                Tài khoản
            </div>
            <div class="text-sm font-normal">
                Thông tin tài khoản của bạn
            </div>
            <div class="flex flex-row items-center">
                <div>
                    <UAvatar
                             size="lg"
                             :alt="student?.profile.fullname" />
                </div>
                <div class="ml-4 flex flex-col justify-center gap-1">
                    <div class="flex flex-col gap-2">
                        <div>
                            <UInput
                                    class="w-full"
                                    size="sm"
                                    color="gray"
                                    :placeholder="student?.profile.username"
                                    disabled />
                        </div>
                        <div class="flex gap-2">
                            <UBadge v-if="studentInformation.isSeekingIntern"
                                    size="md"
                                    color="green"
                                    variant="outline"
                                    label="Đang tìm việc" />
                            <UBadge v-else
                                    size="md"
                                    color="red"
                                    variant="outline"
                                    label="Không tìm việc" />
                            <UButton v-if="isUpdating" variant="solid" color="gray" icon="mingcute:refresh-3-line"
                                     @click="studentInformation.isSeekingIntern = !studentInformation.isSeekingIntern">
                            </UButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <UDivider label="" size="xs" class="my-4" />

        <div class="flex flex-col justify-between gap-2 md:flex-row">
            <div class="mr-16 flex w-full flex-col gap-2">
                <div class="text-lg font-semibold">
                    Thông tin cá nhân
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                        <UInput
                                size="sm"
                                color="gray"
                                icon="mingcute:user-4-line"
                                class="w-full"
                                :placeholder="student?.profile.fullname"
                                disabled />
                    </div>
                    <div class="flex items-center gap-2">
                        <UInput
                                size="sm"
                                color="gray"
                                icon="mingcute:birthday-2-line"
                                class="w-full"
                                v-model="studentInformation.dob"
                                :disabled="!isUpdating" />
                    </div>
                    <div class="flex items-center gap-2">
                        <UInput
                                size="sm"
                                color="gray"
                                icon="mingcute:mail-line"
                                class="w-full"
                                :placeholder="student?.profile.email"
                                disabled />
                    </div>
                    <div class="flex items-center gap-2">
                        <UInput
                                size="sm"
                                color="gray"
                                icon="mingcute:phone-line"
                                class="w-full"
                                v-model="studentInformation.phoneNumber"
                                :disabled="!isUpdating" />
                    </div>
                </div>
            </div>

            <div class="mr-16 flex w-full flex-col gap-2">
                <div class="text-lg font-medium">
                    Bio
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                        <USelect
                                 icon="mingcute:user-info-line"
                                 color="white"
                                 size="sm"
                                 class="w-full"
                                 :options="genderOptions"
                                 v-model="gender"
                                 :disabled="!isUpdating" />
                    </div>
                    <div class="flex items-center gap-2">
                        <UInput
                                size="sm"
                                color="gray"
                                icon="mingcute:school-line"
                                class="w-full"
                                :placeholder="student?.year.toString()"
                                disabled />
                    </div>
                    <div class="flex items-center gap-2">
                        <UInput
                                size="sm"
                                color="gray"
                                icon="mingcute:building-3-line"
                                class="w-full"
                                :placeholder="student?.major.faculty.name"
                                disabled />
                    </div>
                    <div class="flex items-center gap-2">
                        <UInput
                                size="sm"
                                color="gray"
                                icon="mingcute:book-3-line"
                                class="w-full"
                                :placeholder="student?.major.name"
                                disabled />
                    </div>

                </div>
            </div>
        </div>

        <UDivider label="" size="xs" class="my-4" />

        <div class="flex flex-col justify-center gap-2 md:flex-row">
            <div class="flex w-full flex-col gap-2">
                <div class="text-lg font-medium">
                    CV
                </div>
                <div class="flex flex-row gap-2">
                    <UButton v-if="student?.profile.uploadContent != undefined" variant="outline"
                             color="gray"
                             target="_blank"
                             :to="backendUrl + `/file/${student?.profile.uploadContent.uploadContentId}`">
                        {{ student?.profile.uploadContent?.fileName }}
                    </UButton>
                    <UButton variant="outline" color="gray" icon="mingcute:upload-2-fill" @click="isCVModalOpen = true">
                    </UButton>
                </div>
            </div>

            <div class="flex w-full flex-col gap-2">
                <div class="text-lg font-medium">
                    Mô tả
                </div>

                <div v-if="!isUpdating" class="text-justify text-sm font-normal">
                    {{ student?.profile.bio }}
                </div>
                <UTextarea v-else
                           size="lg"
                           color="gray"
                           v-model="studentInformation.bio"
                           class="w-full"></UTextarea>
            </div>
        </div>

        <UDivider label="" size="xs" class="my-4" />

        <div class="flex flex-row justify-between gap-2">
            <div></div>
            <div class="flex gap-2">
                <UButton color="primary" variant="outline" @click="isForgotPasswordModalOpen = true">Đổi mật khẩu
                </UButton>
                <UButton color="primary" @click="handleUpdateButton">{{ isUpdating == true ? "Xác nhận" : "Cập nhật" }}
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
                            color="primary"
                            autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Mật khẩu mới</div>
                    <UInput v-model="state.newPassword" type="password" icon="mingcute:mail-line" size="lg"
                            color="primary"
                            autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Xác nhận mật khẩu</div>
                    <UInput v-model="state.confirmPassword" type="password" icon="mingcute:mail-line" size="lg"
                            color="primary"
                            autocomplete="on" />
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