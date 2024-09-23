<script setup lang="ts">
import type AvatarItem from '~/types/AvatarItem';
const sidebarState = useSidebarState();

const props = defineProps({
    avatarItem: Object as PropType<AvatarItem>
})

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
        }
    ],
    [
        {
            slot: 'logout',
            label: 'Logout',
            icon: 'mingcute:exit-fill',
            click: () => {
                props.avatarItem?.logout();
            }
        }
    ]
]
</script>

<template>
    <div
         class="bg-app-primary fixed z-40 flex h-16 w-full flex-row items-center justify-between border-b border-gray-200 shadow-sm lg:pr-[--sidebar-width] dark:border-gray-800">
        <div class="flex flex-row">
            <UButton class="ml-2 lg:hidden"
                     icon="mingcute:menu-line"
                     color="gray"
                     variant="ghost"
                     aria-label="Theme"
                     @click="sidebarState = true" />
            <div class="ml-4 hidden font-bold lg:block">
                TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT TP.HCM
            </div>
        </div>

        <div>

        </div>
        <div class="mr-2 flex flex-row items-center gap-1">
            <ColorPicker />
            <ColorMode />
            <div class="ml-1 flex items-center">
                <UDropdown :items="items"
                           :ui="{ width: 'w-auto min-w-40', padding: 'p-1.5', item: { disabled: 'cursor-text select-text' } }"
                           :popper="{ placement: 'bottom-start' }">
                    <UAvatar :src="props.avatarItem?.avatar" :alt="props.avatarItem?.username" />

                    <template #account="{ item }">
                        <div class="text-left">
                            <div class="font-normal">
                                Đăng nhập bởi
                            </div>
                            <div class="font-semibold">
                                {{ props.avatarItem?.username }}
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
            </div>
        </div>
    </div>
</template>
