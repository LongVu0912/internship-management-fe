<script setup lang="ts">
import type AvatarItem from '~/types/ui/AvatarItem';
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
            <div class="flex items-center">
                <AvatarHeader />
            </div>
        </div>
    </div>
</template>
