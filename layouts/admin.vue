<script setup lang="ts">
import type SidebarItem from '~/types/ui/SidebarItem';

const sidebarState = useSidebarState();

const sidebarItems: SidebarItem[] = [
    {
        icon: "mingcute:group-3-line",
        label: "Sinh viên",
        to: "/admin",
    },
    {
        icon: "mingcute:building-3-line",
        label: "Khoa",
        to: "/admin/faculty",
    },
    {
        icon: "mingcute:mortarboard-line",
        label: "Giảng viên",
        to: "/admin/instructor",
    },
    {
        icon: "mingcute:building-5-line",
        label: "Công ty",
        to: "/admin/business",
    },
    {
        icon: "mingcute:settings-3-line",
        label: "Cài đặt",
        to: "/admin/settings",
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