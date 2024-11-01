<script setup lang="ts">
import type SidebarItem from '~/types/ui/SidebarItem';

const sidebarState = useSidebarState();

const sidebarItems: SidebarItem[] = [
    {
        icon: "mingcute:profile-line",
        label: "Hồ sơ",
        to: "/instructor",
    },
    {
        icon: "mingcute:group-line",
        label: "Sinh viên",
        to: "/instructor/student",
    },
    {
        icon: "mingcute:settings-3-line",
        label: "Cài đặt",
        to: "/instructor/settings",
    }
]
</script>

<template>
    <div class="bg-app-primary min-h-screen">
        <PanelSidebar :items="sidebarItems" />
        <div class="lg:ml-[--sidebar-width]">
            <PanelHeader />
            <div class="px-6 pb-4 pt-20" @click="sidebarState = false">
                <slot></slot>
            </div>
        </div>
    </div>
</template>