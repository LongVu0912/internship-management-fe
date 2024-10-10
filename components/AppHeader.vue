<script setup>
const isOpen = ref(false)

const toggleMenu = () => {
    isOpen.value = !isOpen.value
}
</script>

<template>
    <div
         class="bg-app-primary fixed left-0 right-0 top-0 z-50 flex h-16 flex-row items-center justify-between border-b border-gray-200 px-2 md:px-24 dark:border-gray-800">
        <!-- * Start -->
        <div class="flex flex-1 flex-row gap-2">
            <UButton class="md:hidden"
                     icon="mingcute:menu-fill"
                     color="gray"
                     variant="ghost"
                     @click="toggleMenu"
                     aria-label="Menu" />
            <div class="hidden items-center gap-2 md:flex">
                <NuxtImg src="/hcmute.png" width="40" height="40" quality="80"
                         alt="hcmute" />
                <NuxtLink class="font-bold" to="/">
                    HCMUTE
                </NuxtLink>
            </div>

            <!-- * Menu bar in mobile -->
            <div class="fixed left-0 right-0 top-16 z-40 overflow-hidden shadow-md transition-all duration-300 ease-in-out md:hidden"
                 :class="{ 'max-h-64 opacity-100': isOpen, 'max-h-0 opacity-0': !isOpen }">
                <div class="bg-app-primary flex flex-col shadow-lg">
                    <UButton to="/recruitment" variant="ghost" size="lg" icon="mingcute:building-5-line" label="Tất cả công ty">
                    </UButton>
                    <UDivider size="xs" />
                    <UButton to="/" variant="ghost" size="lg" icon="mingcute:notebook-line" label="Mẫu CV">
                    </UButton>
                </div>
            </div>
        </div>

        <!-- * Center -->
        <div class="hidden flex-row md:flex">
            <UPopover mode="hover">
                <UButton color="black" variant="ghost" label="Công ty"
                         class="hover:text-primary-500 dark:hover-text-400"
                         trailing-icon="heroicons:chevron-down-16-solid" />
                <template #panel>
                    <ul class="flex flex-col gap-y-1 p-2">
                        <li
                            class="rounded-lg p-2 duration-300 hover:bg-black/5 dark:hover:bg-white/5">
                            <a href="/recruitment" class="flex items-center gap-x-4">
                                <UIcon class="h-6 w-6 self-start" name="mingcute:building-5-line" />
                                <div class="flex w-32 flex-col gap-y-1">
                                    <span class="text-sm font-bold">
                                        Tất cả công ty
                                    </span>
                                    <span class="text-xs">
                                        Thông tin các công ty đang tuyển dụng
                                    </span>
                                </div>
                            </a>
                        </li>
                    </ul>
                </template>
            </UPopover>
            <UPopover mode="hover">
                <UButton color="black" variant="ghost" label="Hồ sơ & CV"
                         class="hover:text-primary-500 dark:hover-text-400"
                         trailing-icon="heroicons:chevron-down-16-solid" />

                <template #panel>
                    <ul class="flex flex-col gap-y-1 p-2">
                        <li
                            class="rounded-lg p-2 duration-300 hover:bg-black/5 dark:hover:bg-white/5">
                            <a href="#" class="flex items-center gap-x-4">
                                <UIcon class="h-6 w-6 self-start" name="mingcute:notebook-line" />
                                <div class="flex w-32 flex-col gap-y-1">
                                    <span class="text-sm font-bold">
                                        Mẫu CV
                                    </span>
                                    <span class="text-xs">
                                        Các mẫu CV để ứng tuyển
                                    </span>
                                </div>
                            </a>
                        </li>
                    </ul>
                </template>
            </UPopover>
        </div>

        <!-- * End -->
        <div class="flex flex-1 flex-row justify-end">
            <ColorPicker />
            <ColorMode />

            <div class="mx-1 flex items-center">
                <AvatarHeader />
            </div>
        </div>
    </div>
</template>