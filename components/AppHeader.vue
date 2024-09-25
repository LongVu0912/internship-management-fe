<script setup lang="ts">
import Role from '~/types/enums/Role';

const { $api, $apiToken } = useNuxtApp();
const authRepository = AuthRepository($api);
const jwtRepository = JwtRepository($api);

const username = ref<string>('');
const isLogged = ref(false);

const userRole = ref<Role>();

onBeforeMount(async () => {
    isLogged.value = await jwtRepository.isLogged();
    userRole.value = await jwtRepository.getRole();

    if (isLogged.value) {
        username.value = await jwtRepository.getProfileName();
    }
})

const handleLoginButton = () => {
    navigateTo('/login');
}

const logout = async () => {
    await authRepository.logout();
    navigateTo('/login');
}

const items = [
    [
        {
            slot: 'account',
            label: 'Account',
            disabled: true
        }
    ],
    [
        {
            slot: 'setting',
            label: 'Setting',
            icon: 'mingcute:settings-5-line',
            click: () => {
                if (userRole.value == Role.ADMIN) {
                    navigateTo("/admin");
                }
                else {
                    navigateTo("/student");
                }
            },
        }
    ],
    [
        {
            slot: 'logout',
            label: 'Logout',
            icon: 'mingcute:exit-fill',
            click: () => logout(),
        }
    ]
]
</script>

<template>
    <div
         class="bg-app-primary fixed z-40 flex h-16 w-full flex-row items-center justify-between border-b border-gray-200 shadow-sm dark:border-gray-800">
        <!-- * Start -->
        <div class="ml-4">
            <UButton class="lg:hidden"
                     icon="mingcute:menu-line"
                     color="gray"
                     variant="ghost"
                     aria-label="Theme" />
            <div class="hidden flex-row items-center gap-2 lg:flex">
                <NuxtImg src="/hcmute.png" width="40" height="40" quality="80" alt="hcmute" loading="lazy"
                         placeholder />
                <div class="font-bold">
                    TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT TP.HCM
                </div>
            </div>
        </div>

        <!-- * Center -->
        <div>

        </div>

        <!-- * End -->
        <div class="mr-2 flex flex-row items-center">
            <ColorPicker />
            <ColorMode />

            <div class="ml-1 flex items-center">
                <UDropdown v-if="isLogged" :items="items"
                           :ui="{ width: 'w-auto min-w-40', padding: 'p-1.5', item: { disabled: 'cursor-text select-text' } }"
                           :popper="{ placement: 'bottom-start' }">
                    <UAvatar alt="Tester" />

                    <template #account="{ item }">
                        <div class="text-left">
                            <div class="font-normal">
                                Đăng nhập bởi
                            </div>
                            <div class="font-semibold">
                                {{ username }}
                            </div>
                        </div>
                    </template>

                    <template #item="{ item }">
                        <span class="truncate">{{ item.label }}</span>

                        <UIcon :name="item.icon"
                               class="ms-auto h-4 w-4 flex-shrink-0" />
                    </template>

                    <template #setting="{ item }">
                        <div class="text-left">
                            Cài đặt
                        </div>
                        <UIcon :name="item.icon"
                               class="ms-auto h-4 w-4 flex-shrink-0" />
                    </template>

                    <template #logout="{ item }">
                        <div class="text-left">
                            Đăng xuất
                        </div>

                        <UIcon :name="item.icon"
                               class="ms-auto h-4 w-4 flex-shrink-0" />
                    </template>
                </UDropdown>

                <UButton v-else label="Đăng nhập" variant="outline" color="primary" @click="handleLoginButton" />
            </div>
        </div>
    </div>
</template>
