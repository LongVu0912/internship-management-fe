<script setup lang="ts">
import type SidebarItem from '~/types/ui/SidebarItem';

const sidebarState = useSidebarState();

const props = defineProps({
    items: {
        type: Array as PropType<SidebarItem[]>,
        required: true,
    },
});
</script>

<template>
    <div
         class="bg-app-primary fixed bottom-0 top-0 z-50 h-screen w-[--sidebar-width] overflow-y-auto border-r border-gray-200 p-2 transition-transform duration-500 ease-in-out lg:translate-x-0 dark:border-gray-800"
         :class="sidebarState ? 'translate-x-0' : 'translate-x-[-100%]'">
        <div class="flex flex-row items-center justify-between p-2">
            <div class="flex flex-row items-center">
                <NuxtImg src="/hcmute.png" width="40" height="40"
                         format="webp"
                         alt="hcmute" />
                <NuxtLink class="m-2 font-sans text-xl font-bold" to="/">HCMUTE</NuxtLink>
            </div>
            <UButton class="lg:hidden"
                     color="gray"
                     variant="ghost"
                     @click="sidebarState = false"
                     icon="mingcute:close-fill">
            </UButton>
        </div>

        <div class="flex flex-col gap-2 p-2">
            <UDivider size="xs" />
            <UButton v-for="item in props.items"
                     :icon="item.icon"
                     color="gray"
                     variant="ghost"
                     :label="item.label"
                     :to="item.to"
                     activeClass="link-active">
            </UButton>
            <UDivider size="xs" class="my-4" />
        </div>
    </div>
</template>
