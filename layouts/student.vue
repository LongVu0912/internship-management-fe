<script setup lang="ts">
import type AvatarItem from '~/types/ui/AvatarItem';
import type SidebarItem from '~/types/ui/SidebarItem';

const { $api } = useNuxtApp();
const authRepository = AuthRepository($api);

const sidebarState = useSidebarState();

const sidebarItems: SidebarItem[] = [
    {
        icon: "mingcute:profile-line",
        label: "Hồ sơ",
        to: "/student",
    },
    {
        icon: "mingcute:user-setting-line",
        label: "Cài đặt",
        to: "/student/profile",
    }
]

const avatarItem: AvatarItem = {
    username: "Tester",
    avatar: "/avatar.png",
    logout: () => {
        authRepository.logout();
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