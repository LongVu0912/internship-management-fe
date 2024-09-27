<script setup lang="ts">
import Role from '~/types/enums/Role';

// * Imports
const { $api, $apiToken } = useNuxtApp();
const authRepository = AuthRepository($api);
const jwtRepository = JwtRepository($api);

// * Refs
const username = ref<string>('');
const isLogged = ref(false);
const userRole = ref<Role>();

// * Lifecycle
onBeforeMount(async () => {
    isLogged.value = await jwtRepository.isLogged();
    userRole.value = await jwtRepository.getRole();

    if (isLogged.value) {
        username.value = await jwtRepository.getProfileName();
    }
})

// * Functions
const logout = async () => {
    await authRepository.logout();
    navigateTo('/login');
}

const handleLoginButton = () => {
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
            label: 'Cài đặt',
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
            label: 'Đăng xuất',
            icon: 'mingcute:exit-fill',
            click: () => logout(),
        }
    ]
]
</script>

<template>
    <ClientOnly>
        <UDropdown v-if="isLogged"
                   :items="items"
                   :ui="{ item: { disabled: 'cursor-text select-text' } }">
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
    </ClientOnly>
</template>