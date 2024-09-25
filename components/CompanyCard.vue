<template>
    <div
         class="hover:border-primary-500 dark:hover:border-primary-500 bg-content flex h-auto w-full flex-row gap-3 rounded-md border p-3 md:h-40 md:w-[800px] dark:border-gray-800">
        <div class="flex flex-shrink-0 items-center">
            <NuxtImg src="/hcmute.png" width="96" height="96" quality="80" alt="hcmute" loading="lazy" placeholder />
        </div>
        <div class="flex w-full flex-col justify-between gap-1">
            <div class="flex flex-col justify-between gap-1">
                <div class="flex w-full flex-row justify-between">
                    <div class="text-base font-semibold">
                        Tuyển thực tập sinh JAVA
                    </div>
                    <div class="text-primary whitespace-nowrap text-sm font-semibold">
                        Còn 3 ngày
                    </div>
                </div>

                <div>
                    <div class="flex flex-row items-center gap-1 text-sm font-normal">
                        <UIcon name="mingcute:building-3-line" class="h-4 w-4 flex-shrink-0" />
                        <div class="font-semibold">
                            FPT Software
                        </div>
                    </div>
                    <div class="flex flex-row items-center gap-1 text-sm font-normal">
                        <UIcon name="mingcute:location-3-line" class="h-4 w-4 flex-shrink-0" />
                        <div>
                            Đường D1, Đ. D1, Phường Tân Phú, Quận 9, Hồ Chí Minh
                        </div>
                    </div>
                    <div class="flex flex-row items-center gap-1 text-sm font-normal">
                        <UIcon name="mingcute:calendar-2-line" class="h-4 w-4 flex-shrink-0" />
                        <div>
                            Cập nhật: 12/09/2024
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="flex flex-row justify-between">
                    <div class="flex flex-row gap-2">
                        <UBadge color="primary" variant="outline" size="xs">Toàn thời gian</UBadge>
                        <UBadge color="primary" variant="outline" size="xs">1 người</UBadge>
                    </div>
                    <UButton color="primary" variant="solid" size="2xs">Chi tiết</UButton>
                </div>
            </div>
        </div>
    </div>
</template>