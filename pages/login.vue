<script setup lang="ts">
definePageMeta({
    layout: "blank",
    colorMode: "light",
});
import Role from '~/types/enums/Role';
const { $showToast, $api } = useNuxtApp();
const { t } = useI18n();

const userRepository = UserRepository($api);

const isOpen = ref(false);

const roles = Object.values(Role);
// * Remove guest role
roles.shift();
const role = ref(roles[0])

// * For login and forgot password
const username = ref("");
const password = ref("");
const email = ref("");

onMounted(() => {
    // * Set primary color in login page
    useAppConfig().ui.primary = "blue";
});

const handleLogin = async () => {
    if (username.value === "" || password.value === "") {
        $showToast({
            title: t('notification'),
            description: 'Please enter username and password',
        });
        return;
    }

    try {
        const response = await userRepository.login({
            username: username.value,
            password: password.value,
        });

        if (response.code === 200) {
            $showToast({
                title: t('notification'),
                description: 'Login successfully',
                type: 'success',
            });
        }
        else {
            $showToast({
                title: t('notification'),
                description: response.message,
                type: 'error',
            });
        }
    } catch (error) {
        $showToast({
            title: t('notification'),
            description: 'Login failed',
            type: 'error',
        });
    }
};

const handleForgotPassword = () => {
    $showToast({
        title: 'Notification',
        description: 'Reset password successfully',
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
                <form class="flex w-full flex-col sm:w-3/5 md:w-2/3" @submit.prevent="handleLogin">
                    <div class="mb-2 mt-4 text-sm font-medium">Username</div>
                    <UInput v-model="username"
                            type="text"
                            icon="material-symbols:account-circle-full"
                            size="lg"
                            color="primary"
                            autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Password</div>
                    <UInput v-model="password"
                            type="password"
                            icon="material-symbols:password"
                            size="lg"
                            color="primary"
                            autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Role</div>
                    <USelect v-model="role"
                             icon="material-symbols:manage-accounts-outline"
                             :options="roles"
                             color="primary"
                             size="lg" />
                    <div class="mt-4 text-sm font-medium">
                        Forgot password?
                        <button class="text-primary" @click="isOpen = true" type="button">
                            Click here
                        </button>
                    </div>

                    <UButton class="mt-4 w-full rounded-md" size="lg" type="submit" block>
                        Login
                    </UButton>
                </form>
            </div>
        </div>
    </div>

    <UModal v-model="isOpen" prevent-close>
        <UCard
               :ui="{ body: { padding: 'px-4 pb-4 lg:px-8 lg:pb-8' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', strategy: 'override' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Forgot password
                    </h3>
                    <UButton color="gray" variant="ghost" icon="material-symbols:close-rounded" class="-my-1"
                             @click="isOpen = false" />
                </div>
            </template>
            <div>
                <form class="flex w-full flex-col justify-start" @submit.prevent="handleForgotPassword">
                    <div class="mb-2 mt-4 text-sm font-medium">Username</div>
                    <UInput v-model="username" type="text" icon="material-symbols:account-circle-full" size="lg"
                            color="primary"
                            autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Email</div>
                    <UInput v-model="email" type="email" icon="material-symbols:mail-outline-rounded" size="lg"
                            color="primary"
                            autocomplete="on" />
                    <UButton class="mt-4 w-full rounded-md" size="lg" type="submit" block>
                        Forgot password
                    </UButton>
                </form>
            </div>
        </UCard>
    </UModal>
</template>