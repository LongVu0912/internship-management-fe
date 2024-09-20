<script setup>
const sidebarState = useSidebarState();
</script>

<template>
    <div
         class="bg-app-primary fixed bottom-0 top-0 z-50 h-screen w-[--sidebar-width] overflow-y-auto border-r border-gray-200 p-2 transition-transform duration-500 ease-in-out lg:translate-x-0 dark:border-gray-800"
         :class="sidebarState ? 'translate-x-0' : 'translate-x-[-100%]'">
        <div class="flex flex-row items-center justify-between p-2">
            <div class="flex flex-row items-center">
                <img src="/hcmute.png" class="h-10 w-10" alt="hcmute" />
                <a class="m-2 font-sans text-xl font-bold" href="/">HCMUTE</a>
            </div>
            <UButton class="lg:hidden"
                     color="gray"
                     variant="ghost"
                     @click="sidebarState = false"
                     icon="mingcute:close-fill">
            </UButton>
        </div>

        <div class="flex flex-col gap-2 p-2">
            <UDivider label="" size="xs" />
            <UButton icon="mingcute:user-setting-line"
                     color="gray"
                     variant="ghost"
                     label="Account"
                     to="/account"
                     activeClass="link-active">
            </UButton>
            <UButton icon="mingcute:profile-line"
                     color="gray"
                     variant="ghost"
                     label="Profile"
                     to="/account/profile"
                     activeClass="link-active" />
            <UDivider label="" size="xs" class="mb-2 mt-2" />
        </div>
    </div>
</template>
