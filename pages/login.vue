<script setup lang="ts">
import Role from '~/types/enums/Role';

definePageMeta({
    colorMode: "light",
});

// * Imports
const { $api } = useNuxtApp();
const nuxtToast = useNuxtToast();
const authRepository = AuthRepository($api);

// * Refs
const isPasswordVisible = ref(false);
const isPasswordModalOpen = ref(false);
const isLoading = ref(false);
const userState = useUserState();

// ? For login and forgot password
const loginState = reactive({
    username: undefined,
    password: undefined,
    email: undefined,
});

// * Lifecycle
onBeforeMount(() => {
    useAppConfig().ui.primary = "blue";
})

// * Functions
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
        await authRepository.saveTokenToCookie(apiResponse.result.token);
        userState.value = await authRepository.getUserState();
        nuxtToast({
            description: 'Đăng nhập thành công',
            type: 'success',
            timeout: 1000,
            onCallback: () => {
                if (userState.value.role == Role.ROLE_ADMIN) {
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
</script>

<template>
    <div class="flex min-h-screen items-center justify-center bg-background-login bg-cover bg-center">
        <div
             class="flex w-3/4 flex-col items-center justify-center rounded-md bg-gray-100 p-6 shadow-xl sm:p-8 md:w-1/2 lg:w-1/2 xl:w-1/3">
            <NuxtImg src="/hcmute.png" format="webp" width="144" height="144" alt="hcmute" />
            <div class="mt-2 text-xl font-extrabold">HCMUTE INTERNSHIP</div>
            <div class="flex w-full flex-col items-center justify-center">
                <UForm :state="loginState" class="w-full sm:w-3/5 md:w-2/3" @submit="handleLoginSubmit">
                    <div class="mb-2 mt-4 text-sm font-medium">Tài khoản</div>
                    <UInput v-model="loginState.username"
                            type="text"
                            icon="mingcute:user-4-line"
                            size="lg"
                            autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Mật khẩu</div>
                    <UInput v-model="loginState.password"
                            :type="isPasswordVisible ? 'text' : 'password'"
                            icon="mingcute:key-2-line"
                            size="lg"
                            :ui="{ icon: { trailing: { pointer: 'pointer-events-auto', padding: { lg: 'px-1' } } } }">
                        <template #trailing>
                            <UButton color="gray"
                                     variant="ghost"
                                     class="rounded-md"
                                     @click="isPasswordVisible = !isPasswordVisible"
                                     :icon="isPasswordVisible ? 'heroicons:eye' : 'heroicons:eye-20-solid'" />
                        </template>
                    </UInput>
                    <div class="mt-4 text-sm font-medium">
                        Quên mật khẩu?
                        <button class="text-primary-600" @click="isPasswordModalOpen = true" type="button">
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
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-base font-semibold">
                        Quên mật khẩu
                    </div>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="isPasswordModalOpen = false" />
                </div>
            </template>

            <div>
                <UForm :state="loginState" class="flex w-full flex-col justify-start" @submit.prevent="nuxtToast">
                    <div class="mb-2 text-sm font-medium">Tài khoản</div>
                    <UInput v-model="loginState.username" type="text" icon="mingcute:user-4-line" size="lg"
                            autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Email</div>
                    <UInput v-model="loginState.email" type="email" icon="mingcute:mail-line" size="lg"
                            autocomplete="on" />
                    <UButton class="mb-4 mt-6 w-full rounded-md" size="lg" color="blue" type="submit" block>
                        Quên mật khẩu
                    </UButton>
                </UForm>
            </div>
        </UCard>
    </UModal>
</template>