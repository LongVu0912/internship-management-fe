<script setup lang="ts">
definePageMeta({
    colorMode: "light",
});
const { $api } = useNuxtApp();

const authRepository = AuthRepository($api);
const jwtRepository = JwtRepository();
const nuxtToast = useNuxtToast();

const isOpen = ref(false);

// * For login and forgot password
const state = reactive({
    username: undefined,
    password: undefined,
    email: undefined,
});

onMounted(() => {
    // * Set primary color in login page
    useAppConfig().ui.primary = "blue";
});

const handleLogin = async () => {
    if (!state.username || !state.password) {
        nuxtToast({
            description: 'Hãy nhập đầy đủ thông tin',
            type: 'info',
        });
        return;
    }

    try {
        const response = await authRepository.login({
            username: state.username,
            password: state.password,
        });

        if (response.code === 200) {
            nuxtToast({
                description: 'Đăng nhập thành công',
                type: 'success',
                timeout: 1000,
                onCallback: () => {
                    navigateTo('/');
                }
            });
            jwtRepository.saveToken(response.result.token);
        }
        else {
            nuxtToast({
                description: 'Tài khoản hoặc mật khẩu không đúng',
                type: 'error',
            });
        }
    } catch (error) {
        nuxtToast({
            description: 'Có lỗi, vui lòng thử lại sau',
            type: 'error',
        });
    }
};

const handleForgotPassword = () => {
    nuxtToast({
        title: 'Notification',
        description: 'Cài lại mật khẩu thành công',
        type: 'success',
    });
};

</script>

<template>
    <div class="flex min-h-screen items-center justify-center bg-background-login bg-cover bg-center">
        <div
             class="flex w-3/4 flex-col items-center justify-center rounded-md bg-gray-100 p-6 shadow-xl sm:p-8 md:w-1/2 lg:w-1/2 xl:w-1/3 dark:bg-gray-800">
            <img src="/hcmute.png" class="h-36 w-36" alt="hcmute" />
            <div class="mt-2 text-xl font-extrabold">HCMUTE INTERNSHIP</div>
            <div class="flex w-full flex-col items-center justify-center">
                <UForm :state="state" class="w-full sm:w-3/5 md:w-2/3" @submit="handleLogin">
                    <div class="mb-2 mt-4 text-sm font-medium">Tài khoản</div>
                    <UInput v-model="state.username"
                            type="text"
                            icon="material-symbols:account-circle-full"
                            size="lg"
                            color="primary"
                            autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Mật khẩu</div>
                    <UInput v-model="state.password"
                            type="password"
                            icon="material-symbols:password"
                            size="lg"
                            color="primary"
                            autocomplete="on" />
                    <div class="mt-4 text-sm font-medium">
                        Quên mật khẩu?
                        <button class="text-primary" @click="isOpen = true" type="button">
                            Nhấn vào đây
                        </button>
                    </div>

                    <UButton class="mt-4 w-full rounded-md" size="lg" type="submit" block>
                        Đăng nhập
                    </UButton>

                    <UButton class="mt-2 w-full rounded-md" size="lg" variant="outline" block>
                        Đăng ký
                    </UButton>
                </UForm>
            </div>
        </div>
    </div>

    <UModal v-model="isOpen" prevent-close>
        <UCard
               :ui="{ body: { padding: 'px-4 pb-4 lg:px-8 lg:pb-8' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', strategy: 'override' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Quên mật khẩu
                    </h3>
                    <UButton color="gray" variant="ghost" icon="material-symbols:close-rounded" class="-my-1"
                             @click="isOpen = false" />
                </div>
            </template>
            <div>
                <form class="flex w-full flex-col justify-start" @submit.prevent="handleForgotPassword">
                    <div class="mb-2 mt-4 text-sm font-medium">Tài khoản</div>
                    <UInput v-model="state.username" type="text" icon="material-symbols:account-circle-full" size="lg"
                            color="primary" autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Email</div>
                    <UInput v-model="state.email" type="email" icon="material-symbols:mail-outline-rounded" size="lg"
                            color="primary" autocomplete="on" />
                    <UButton class="mt-6 w-full rounded-md" size="lg" type="submit" block>
                        Quên mật khẩu
                    </UButton>
                </form>
            </div>
        </UCard>
    </UModal>
</template>