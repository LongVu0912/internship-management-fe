<script setup lang="ts">

// * Imports
const { $apiToken } = useNuxtApp();
const nuxtToast = useNuxtToast();
const authRepository = AuthRepository($apiToken);

// * Refs
const isPasswordVisible1 = ref(false);
const isPasswordVisible2 = ref(false);
const isPasswordVisible3 = ref(false);
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

    const apiResponse = await authRepository.changePassword({
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
        <form @submit.prevent="submitChangePassword">
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

                <div class="flex w-full flex-col justify-start">
                    <div class="mb-2 text-sm font-medium">Mật khẩu cũ</div>
                    <UInput v-model="changePasswordState.oldPassword" :type="isPasswordVisible1 ? 'text' : 'password'"
                            icon="mingcute:key-2-line" size="lg" color="gray" required autocomplete="on"
                            :ui="{ icon: { trailing: { pointer: 'pointer-events-auto', padding: { lg: 'px-1' } } } }">
                        <template #trailing>
                            <UButton color="gray"
                                     variant="ghost"
                                     class="rounded-md"
                                     @click="isPasswordVisible1 = !isPasswordVisible1"
                                     :icon="isPasswordVisible1 ? 'heroicons:eye' : 'heroicons:eye-20-solid'" />
                        </template>
                    </UInput>
                    <div class="mb-2 mt-4 text-sm font-medium">Mật khẩu mới</div>
                    <UInput v-model="changePasswordState.newPassword" :type="isPasswordVisible2 ? 'text' : 'password'"
                            icon="mingcute:key-1-line" size="lg" color="gray" required autocomplete="on"
                            :ui="{ icon: { trailing: { pointer: 'pointer-events-auto', padding: { lg: 'px-1' } } } }">
                        <template #trailing>
                            <UButton color="gray"
                                     variant="ghost"
                                     class="rounded-md"
                                     @click="isPasswordVisible2 = !isPasswordVisible2"
                                     :icon="isPasswordVisible2 ? 'heroicons:eye' : 'heroicons:eye-20-solid'" />
                        </template>
                    </UInput>
                    <div class="mb-2 mt-4 text-sm font-medium">Xác nhận mật khẩu</div>
                    <UInput v-model="changePasswordState.confirmPassword"
                            :type="isPasswordVisible3 ? 'text' : 'password'"
                            icon="mingcute:key-1-line" size="lg" required color="gray" autocomplete="on"
                            :ui="{ icon: { trailing: { pointer: 'pointer-events-auto', padding: { lg: 'px-1' } } } }">
                        <template #trailing>
                            <UButton color="gray"
                                     variant="ghost"
                                     class="rounded-md"
                                     @click="isPasswordVisible3 = !isPasswordVisible3"
                                     :icon="isPasswordVisible3 ? 'heroicons:eye' : 'heroicons:eye-20-solid'" />
                        </template>
                    </UInput>
                </div>

                <template #footer>
                    <UButton :loading="isSubmitting" class="w-full rounded-md" size="lg" color="primary"
                             type="submit"
                             block>
                        Đổi mật khẩu
                    </UButton>
                </template>
            </UCard>
        </form>
    </UModal>
</template>