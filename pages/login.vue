<script setup lang="ts">
import Role from '~/types/enums/Role';

definePageMeta({
    colorMode: "light",
});
const { $api, $apiToken } = useNuxtApp();

const authRepository = AuthRepository($api);
const jwtRepository = JwtRepository($api);
const nuxtToast = useNuxtToast();

const isPasswordModalOpen = ref(false);
const isLoading = ref(false);

// * For login and forgot password
const loginState = reactive({
    username: undefined,
    password: undefined,
    email: undefined,
});

onMounted(() => {
    useAppConfig().ui.primary = "blue";
})

const handleLoginSubmit = async () => {
    if (!loginState.username || !loginState.password) {
        nuxtToast({
            description: 'Hãy nhập đầy đủ thông tin',
            type: 'info',
        });
        return;
    }

    isLoading.value = true;

    const apiResponse = await authRepository.login({
        username: loginState.username,
        password: loginState.password,
    });

    if (apiResponse.code === 200) {
        await jwtRepository.saveTokenToCookie(apiResponse.result.token);
        const role = await jwtRepository.getRole();

        nuxtToast({
            description: 'Đăng nhập thành công',
            type: 'success',
            timeout: 1000,
            onCallback: () => {
                if (role == Role.ADMIN) {
                    navigateTo("/admin");
                }
                else {
                    navigateTo("/");
                }
            }
        });
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }

    isLoading.value = false;
};

const handleForgotPasswordSubmit = () => {
    nuxtToast({
        description: 'Chưa làm xong',
        type: 'info',
    });
};
</script>

<template>
    <div class="flex min-h-screen items-center justify-center bg-background-login bg-cover bg-center">
        <div
             class="flex w-3/4 flex-col items-center justify-center rounded-md bg-gray-100 p-6 shadow-xl sm:p-8 md:w-1/2 lg:w-1/2 xl:w-1/3 dark:bg-gray-800">
            <NuxtImg src="/hcmute.png" quality="80" width="144" height="144" alt="hcmute" />
            <div class="mt-2 text-xl font-extrabold">HCMUTE INTERNSHIP</div>
            <div class="flex w-full flex-col items-center justify-center">
                <UForm :state="loginState" class="w-full sm:w-3/5 md:w-2/3" @submit="handleLoginSubmit">
                    <div class="mb-2 mt-4 text-sm font-medium">Tài khoản</div>
                    <UInput v-model="loginState.username"
                            type="text"
                            icon="mingcute:user-4-line"
                            size="lg"
                            color="blue"
                            autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Mật khẩu</div>
                    <UInput v-model="loginState.password"
                            type="password"
                            icon="mingcute:key-2-line"
                            size="lg"
                            color="blue"
                            autocomplete="on" />
                    <div class="mt-4 text-sm font-medium">
                        Quên mật khẩu?
                        <button class="text-blue-500" @click="isPasswordModalOpen = true" type="button">
                            Nhấn vào đây
                        </button>
                    </div>

                    <UButton :loading="isLoading" class="mt-4 w-full rounded-md" color="blue" size="lg" type="submit"
                             block>
                        Đăng nhập
                    </UButton>
                </UForm>
            </div>
        </div>
    </div>

    <UModal v-model="isPasswordModalOpen" prevent-close>
        <UCard
               :ui="{ body: { padding: 'px-4 pb-4 lg:px-8 lg:pb-8' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', strategy: 'override' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Quên mật khẩu
                    </h3>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="isPasswordModalOpen = false" />
                </div>
            </template>
            <div>
                <form class="flex w-full flex-col justify-start" @submit.prevent="handleForgotPasswordSubmit">
                    <div class="mb-2 mt-4 text-sm font-medium">Tài khoản</div>
                    <UInput v-model="loginState.username" type="text" icon="mingcute:user-4-line" size="lg" color="blue"
                            autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Email</div>
                    <UInput v-model="loginState.email" type="email" icon="mingcute:mail-line" size="lg" color="blue"
                            autocomplete="on" />
                    <UButton class="mt-6 w-full rounded-md" size="lg" type="submit" block>
                        Quên mật khẩu
                    </UButton>
                </form>
            </div>
        </UCard>
    </UModal>
</template>