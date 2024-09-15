<script setup lang="ts">
const sidebarState = useSidebarState();
</script>

<template>
    <div class="min-h-screen bg-white dark:bg-gray-900">
        <AccountSidebar />
        <div class="lg:ml-[--sidebar-width]">
            <AccountHeader />
            <div class="px-6 pb-4 pt-20" @click="sidebarState = false">
                <slot></slot>
            </div>
        </div>
    </div>
</template>