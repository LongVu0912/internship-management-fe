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

const student = ref<Student>();

const state = reactive({
    oldPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined
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
</script>

<template>
    <div v-if="isPageLoading">
        <Loading />
    </div>
    <div v-else>
        <div class="flex flex-col gap-2">
            <div class="text-xl font-medium">
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

        <UDivider label="" size="xs" class="my-4" />

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

        <UDivider label="" size="xs" class="my-4" />

        <div class="flex flex-row justify-between gap-2">
            <div></div>
            <div class="flex gap-2">
                <UButton color="primary" variant="outline" @click="isForgotPasswordModalOpen = true">Đổi mật khẩu
                </UButton>
                <UButton color="primary">Cập nhật</UButton>
            </div>
        </div>
    </div>

    <!-- * Forgot password -->
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
            <div>
                <UInput type="file" size="sm" icon="i-heroicons-folder" accept=".pdf" @change="handleInputCVFile" />
                <UButton class="mt-6 w-full rounded-md" size="lg" block @click="handleUploadCV" :loading="isSubmitting">
                    Cập nhật
                </UButton>
            </div>
        </UCard>
    </UModal>
</template>