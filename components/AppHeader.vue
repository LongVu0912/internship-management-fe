<script setup>

</script>

<template>
    <div
         class="bg-app-primary fixed left-0 right-0 top-0 z-50 flex h-16 flex-row items-center justify-between border-b border-gray-200 px-2 md:px-24 dark:border-gray-800">
        <div class="flex flex-row items-center gap-2">
            <UButton class="lg:hidden"
                     icon="mingcute:menu-line"
                     color="gray"
                     variant="ghost"
                     aria-label="Theme" />
            <div class="hidden items-center gap-2 lg:flex">
                <NuxtImg src="/hcmute.png" width="40" height="40" quality="80"
                         alt="hcmute" />
                <div class="font-bold">
                    HCMUTE
                </div>
            </div>
        </div>

        <!-- * Center -->
        <div class="flex flex-row">
            <UPopover mode="hover">
                <UButton color="black" variant="ghost" label="Công ty"
                         trailing-icon="heroicons:chevron-down-16-solid" />

                <template #panel>
                    <ul class="flex flex-col gap-y-1 p-2">
                        <li
                            class="rounded-lg p-2 duration-300 hover:bg-black/5 dark:hover:bg-white/5">
                            <a href="#" class="flex items-center gap-x-4">
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
        <div class="mr-2 flex flex-row items-center">
            <ColorPicker />
            <ColorMode />

            <div class="mx-1 flex items-center">
                <AvatarHeader />
            </div>
        </div>
    </div>
</template>