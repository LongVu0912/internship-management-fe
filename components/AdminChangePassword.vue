<script setup lang="ts">
// ? Emit event to parent component to close dialog
const emit = defineEmits(['hideModal']);

const props = defineProps<{
    isOpen: boolean;
    profileId: string;
}>();

// * Imports
const { $apiToken } = useNuxtApp();
const nuxtToast = useNuxtToast();
const authRepository = AuthRepository($apiToken);

// * Refs
const changePasswordModal = ref({
    isOpen: false,
    isSubmitting: false,
})

const changePasswordState = reactive({
    newPassword: "",
    confirmPassword: ""
});

// * Functions
const hideModal = () => {
    changePasswordModal.value.isOpen = false;
    changePasswordState.newPassword = "";
    changePasswordState.confirmPassword = "";
    emit('hideModal');
};

const submitChangePassword = async () => {
    if (!changePasswordState.newPassword || !changePasswordState.confirmPassword) {
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

    changePasswordModal.value.isSubmitting = true;

    const apiResponse = await authRepository.adminChangePassword({
        profileId: props.profileId,
        newPassword: changePasswordState.newPassword,
    });

    if (apiResponse.code === 200) {
        nuxtToast({
            description: "Đổi mật khẩu thành công",
            type: "success",
        });
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }

    changePasswordModal.value.isSubmitting = false;
    hideModal();
};

// * Watches
watch(() => props.isOpen, (newValue) => {
    changePasswordModal.value.isOpen = newValue;
});
</script>

<template>
    <UModal v-model="changePasswordModal.isOpen" prevent-close>
        <form @submit.prevent="submitChangePassword">
            <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="text-base font-semibold">
                            Đổi mật khẩu
                        </div>
                        <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                                 @click="hideModal" />
                    </div>
                </template>

                <div class="space-y-2">
                    <div class="mb-2 text-sm font-medium">Mật khẩu mới</div>
                    <UInput v-model="changePasswordState.newPassword" type="password" icon="mingcute:key-2-line"
                            size="lg" color="gray"
                            required autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Xác nhận mật khẩu</div>
                    <UInput v-model="changePasswordState.confirmPassword" type="password" icon="mingcute:key-2-line"
                            size="lg" required
                            color="gray" autocomplete="on" />
                </div>

                <template #footer>
                    <UButton :loading="changePasswordModal.isSubmitting" class="w-full rounded-md" size="lg"
                             color="primary"
                             type="submit"
                             block>
                        Đổi mật khẩu
                    </UButton>
                </template>
            </UCard>
        </form>
    </UModal>
</template>