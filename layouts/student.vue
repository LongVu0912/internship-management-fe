<script setup lang="ts">
import type SidebarItem from '~/types/ui/SidebarItem';

const sidebarState = useSidebarState();

const sidebarItems: SidebarItem[] = [
    {
        icon: "mingcute:profile-line",
        label: "Hồ sơ",
        to: "/student",
    },
    {
        icon: "mingcute:bookmarks-line",
        label: "Danh sách thực tập",
        to: "/student/recruitment",
    },
    {
        icon: "mingcute:contacts-3-line",
        label: "Giảng viên hướng dẫn",
        to: "/student/instructor",
    },
    {
        icon: "mingcute:user-setting-line",
        label: "Cài đặt",
        to: "/student/settings",
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