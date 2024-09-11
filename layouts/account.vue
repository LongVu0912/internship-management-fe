<script setup lang="ts">
const sidebarState = useSidebarState();
</script>
<template>
    <LanguageController />
    <div class="min-h-screen bg-white dark:bg-gray-900">
        <AccountSidebar />
        <div class="lg:ml-[--sidebar-width]">
            <AccountHeader />
            <div class="pt-16" @click="sidebarState = false">
                <slot></slot>
            </div>
        </div>
    </div>
</template>