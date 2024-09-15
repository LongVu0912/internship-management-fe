<script setup lang="ts">
const { $api } = useNuxtApp();
const authRepository = AuthRepository($api);
const jwtRepository = JwtRepository();

const username = ref<string>('');
const isLogged = ref(false);

onMounted(async () => {
    isLogged.value = await jwtRepository.isLogged();

    if (isLogged.value) {
        const user = await jwtRepository.getUserDecodedToken();
        username.value = user?.sub;
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
            icon: 'material-symbols:settings-outline',
            click: () => navigateTo('/account'),
        }
    ],
    [
        {
            slot: 'logout',
            label: 'Logout',
            icon: 'material-symbols:logout',
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
                     icon="material-symbols:menu-rounded"
                     color="gray"
                     variant="ghost"
                     aria-label="Theme" />
            <div class="hidden flex-row items-center gap-2 lg:flex">
                <img src="/hcmute.png" class="h-10 w-10" alt="hcmute" />
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
                    <UAvatar src="/avatar.png" />

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
