<script setup lang="ts">

// * Imports
const { $apiToken } = useNuxtApp();
const nuxtToast = useNuxtToast();
const userRepository = UserRepository($apiToken);

// * Refs
const isChangePasswordModalOpen = ref(false);
const isSubmitting = ref(false);

const changePasswordState = reactive({
    oldPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined
});

// * Functions
const submitChangePassword = async () => {
    if (!changePasswordState.oldPassword || !changePasswordState.newPassword || !changePasswordState.confirmPassword) {
        nuxtToast({
            description: "Hãy nhập đầy đủ thông tin",
            type: "info",
        });
        return;
    }

    if (changePasswordState.newPassword !== changePasswordState.confirmPassword) {
        nuxtToast({
            description: "Mật khẩu xác nhận không khớp",
            type: "error",
        });
        return;
    }

    if (changePasswordState.oldPassword == changePasswordState.newPassword) {
        nuxtToast({
            description: "Mật khẩu mới không được trùng với mật khẩu cũ",
            type: "error",
        });
        return;
    }

    isSubmitting.value = true;

    const apiResponse = await userRepository.changePassword({
        oldPassword: changePasswordState.oldPassword,
        newPassword: changePasswordState.newPassword,
    });

    if (apiResponse.code === 200) {
        nuxtToast({
            description: "Đổi mật khẩu thành công",
            type: "success",
        });
        isChangePasswordModalOpen.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
    isSubmitting.value = false;
};
</script>

<template>
    <UButton color="primary" @click="isChangePasswordModalOpen = true">
        Đổi mật khẩu
    </UButton>

    <UModal v-model="isChangePasswordModalOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-base font-semibold">
                        Đổi mật khẩu
                    </div>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="isChangePasswordModalOpen = false" />
                </div>
            </template>
            <div>
                <div class="flex w-full flex-col justify-start">
                    <div class="mb-2 text-sm font-medium">Mật khẩu cũ</div>
                    <UInput v-model="changePasswordState.oldPassword" type="password" icon="mingcute:user-4-line"
                            size="lg"
                            color="gray" autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Mật khẩu mới</div>
                    <UInput v-model="changePasswordState.newPassword" type="password" icon="mingcute:mail-line"
                            size="lg"
                            color="gray" autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Xác nhận mật khẩu</div>
                    <UInput v-model="changePasswordState.confirmPassword" type="password" icon="mingcute:mail-line"
                            size="lg"
                            color="gray" autocomplete="on" />
                </div>
            </div>

            <template #footer>
                <UButton :loading="isSubmitting" class="w-full rounded-md" size="lg" color="primary"
                         type="submit"
                         @click="submitChangePassword"
                         block>
                    Đổi mật khẩu
                </UButton>
            </template>
        </UCard>
    </UModal>
</template>