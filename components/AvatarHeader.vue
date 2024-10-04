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
            slot: 'home',
            label: 'Trang chủ',
            icon: 'mingcute:home-3-line',
            click: () => navigateTo("/")
        },
        {
            slot: 'setting',
            label: 'Cài đặt',
            icon: 'mingcute:settings-5-line',
            click: () => {
                if (userRole.value == Role.ROLE_ADMIN) {
                    navigateTo("/admin");
                }
                else if (userRole.value == Role.ROLE_BUSINESS) {
                    navigateTo("/business");
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
    <UDropdown v-if="isLogged"
               :items="items"
               :ui="{ item: { disabled: 'cursor-text select-text' } }">
        <UAvatar :alt="username" />

        <template #account="{ item }">
            <div class="font-semibold">
                {{ username }}
            </div>
        </template>

        <template #item="{ item }">
            <span class="truncate">{{ item.label }}</span>

            <UIcon :name="item.icon"
                   class="ms-auto h-4 w-4 flex-shrink-0" />
        </template>

        <template #home="{ item }">
            <div class="text-left font-medium">
                {{ item.label }}
            </div>
            <UIcon :name="item.icon"
                   class="ms-auto h-4 w-4 flex-shrink-0" />
        </template>

        <template #setting="{ item }">
            <div class="text-left font-medium">
                {{ item.label }}
            </div>
            <UIcon :name="item.icon"
                   class="ms-auto h-4 w-4 flex-shrink-0" />
        </template>

        <template #logout="{ item }">
            <div class="text-left font-medium">
                {{ item.label }}
            </div>

            <UIcon :name="item.icon"
                   class="ms-auto h-4 w-4 flex-shrink-0" />
        </template>
    </UDropdown>

    <UButton v-else label="Đăng nhập" variant="outline" color="primary" @click="handleLoginButton" />
</template>