<script setup lang="ts">

</script>

<template>
    <div
         class="bg-app-primary fixed z-40 flex h-16 w-full flex-row items-center justify-between border-b border-gray-200 shadow-sm dark:border-gray-800">
        <!-- * Start -->
        <div class="ml-4">
            <UButton class="lg:hidden"
                     icon="mingcute:menu-line"
                     color="gray"
                     variant="ghost"
                     aria-label="Theme" />
            <div class="hidden flex-row items-center gap-2 lg:flex">
                <NuxtImg src="/hcmute.png" width="40" height="40" quality="80" alt="hcmute" />
                <div class="font-bold">
                    TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT TP.HCM
                </div>
            </div>
        </div>

        <!-- * Center -->
        <div>

        </div>

        <!-- * End -->
        <div class="mr-2 flex flex-row items-center">
            <ColorPicker />
            <ColorMode />

            <div class="ml-1 flex items-center">
                <AvatarHeader />   
            </div>
        </div>
    </div>
</template>
