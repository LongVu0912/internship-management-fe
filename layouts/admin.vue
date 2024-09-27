<script setup lang="ts">
import type AvatarItem from '~/types/AvatarItem';
import type SidebarItem from '~/types/SidebarItem';

const sidebarState = useSidebarState();

const sidebarItems: SidebarItem[] = [
    {
        icon: "mingcute:user-setting-line",
        label: "Sinh viên",
        to: "/admin",
    },
    {
        icon: "mingcute:building-3-line",
        label: "Khoa",
        to: "/admin/faculty",
    },
    {
        icon: "mingcute:settings-3-line",
        label: "Cài đặt",
        to: "/admin/settings",
    }
]

const avatarItem: AvatarItem = {
    username: "Tester",
    avatar: "/avatar.png",
    logout: () => {
        console.log("Logged out");
    }
}

</script>

<template>
    <div class="bg-app-primary min-h-screen">
        <PanelSidebar :items="sidebarItems" />
        <div class="lg:ml-[--sidebar-width]">
            <PanelHeader :avatarItem="avatarItem" />
            <div class="px-6 pb-4 pt-20" @click="sidebarState = false">
                <slot></slot>
            </div>
        </div>
    </div>
</template>