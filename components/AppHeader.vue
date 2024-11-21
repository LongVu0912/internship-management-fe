<script setup>
import Role from '~/types/enums/Role';

const userState = useUserState().value;

const isOpen = ref(false);

const toggleMenu = () => {
    isOpen.value = !isOpen.value
}
</script>

<template>
    <div
         class="bg-app-primary fixed left-0 right-0 top-0 z-50 flex h-16 flex-row items-center justify-between border-b border-gray-200 px-3 md:px-8 lg:px-28 dark:border-gray-800">
        <!-- * Start -->
        <div class="flex flex-1 flex-row gap-2">
            <UButton class="lg:hidden"
                     icon="mingcute:menu-fill"
                     color="gray"
                     variant="ghost"
                     @click="toggleMenu"
                     aria-label="Menu" />
            <div class="hidden items-center gap-2 lg:flex">
                <NuxtImg src="/hcmute.png" width="40" height="40"
                         format="webp"
                         alt="hcmute" />
                <NuxtLink class="font-bold" to="/">
                    HCMUTE
                </NuxtLink>
            </div>

            <!-- * Menu bar in mobile -->
            <div class="fixed left-0 right-0 top-16 z-40 overflow-hidden shadow-md transition-all duration-300 ease-in-out lg:hidden"
                 :class="{ 'max-h-64 opacity-100': isOpen, 'max-h-0 opacity-0': !isOpen }">
                <div class="bg-app-primary flex flex-col shadow-lg">
                    <UButton @click="isOpen = false" to="/recruitment"
                             variant="ghost" size="lg" icon="mingcute:building-5-line"
                             label="Tìm tuyển dụng">
                    </UButton>
                    <div v-if="userState.role === Role.ROLE_STUDENT">
                        <UDivider size="xs" />
                        <UButton @click="isOpen = false" to="/student/recruitment"
                                 variant="ghost" size="lg" icon="mingcute:bookmarks-line"
                                 label="Trạng thái tuyển dụng">
                        </UButton>
                    </div>
                    <div v-if="userState.role === Role.ROLE_STUDENT">
                        <UDivider size="xs" />
                        <UButton @click="isOpen = false" to="/student/instructor"
                                 variant="ghost" size="lg" icon="mingcute:contacts-3-line"
                                 label="Trạng thái giảng viên">
                        </UButton>
                    </div>
                    <div v-if="userState.role === Role.ROLE_BUSINESS">
                        <UDivider size="xs" />
                        <UButton @click="isOpen = false" to="/business/recruitment"
                                 variant="ghost" size="lg" icon="mingcute:contacts-3-line"
                                 label="Bài tuyển dụng đã đăng">
                        </UButton>
                    </div>
                    <div v-if="userState.role === Role.ROLE_INSTRUCTOR">
                        <UDivider size="xs" />
                        <UButton @click="isOpen = false" to="/instructor/student"
                                 variant="ghost" size="lg" icon="mingcute:group-line"
                                 label="Sinh viên yêu cầu hướng dẫn">
                        </UButton>
                    </div>
                    <div>
                        <UDivider size="xs" />
                        <UButton @click="isOpen = false" to="find"
                                 variant="ghost" size="lg" icon="mingcute:android-2-line"
                                 label="Tìm việc bằng AI với CV">
                        </UButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- * Center -->
        <div class="hidden flex-row lg:flex">
            <UPopover mode="hover">
                <UButton color="black" variant="ghost" label="Tìm tuyển dụng"
                         class="hover:text-primary-500 dark:hover-text-400"
                         trailing-icon="heroicons:chevron-down-16-solid" />
                <template #panel>
                    <ul class="flex flex-col gap-y-1 p-2">
                        <li
                            class="rounded-lg p-2 duration-300 hover:bg-black/5 dark:hover:bg-white/5">
                            <NuxtLink to="/recruitment" class="flex items-center gap-x-4">
                                <UIcon class="h-6 w-6 self-start" name="mingcute:building-5-line" />
                                <div class="flex w-32 flex-col gap-y-1">
                                    <span class="text-sm font-bold">
                                        Tìm tuyển dụng
                                    </span>
                                    <span class="text-xs">
                                        Thông tin các bài tuyển dụng đang được mở
                                    </span>
                                </div>
                            </NuxtLink>
                        </li>
                    </ul>
                </template>
            </UPopover>
            <UPopover mode="hover" v-if="userState.role === Role.ROLE_STUDENT">
                <UButton color="black" variant="ghost" label="Hồ sơ đã nộp"
                         class="hover:text-primary-500 dark:hover-text-400"
                         trailing-icon="heroicons:chevron-down-16-solid" />

                <template #panel>
                    <ul class="flex flex-col gap-y-1 p-2">
                        <li
                            class="rounded-lg p-2 duration-300 hover:bg-black/5 dark:hover:bg-white/5">
                            <NuxtLink to="/student/recruitment" class="flex items-center gap-x-4">
                                <UIcon class="h-6 w-6 self-start" name="mingcute:bookmarks-line" />
                                <div class="flex w-32 flex-col gap-y-1">
                                    <span class="text-sm font-bold">
                                        Tuyển dụng
                                    </span>
                                    <span class="text-xs">
                                        Trạng thái các tuyển dụng đã nộp
                                    </span>
                                </div>
                            </NuxtLink>
                        </li>
                        <li
                            class="rounded-lg p-2 duration-300 hover:bg-black/5 dark:hover:bg-white/5">
                            <NuxtLink to="/student/instructor" class="flex items-center gap-x-4">
                                <UIcon class="h-6 w-6 self-start" name="mingcute:contacts-3-line" />
                                <div class="flex w-32 flex-col gap-y-1">
                                    <span class="text-sm font-bold">
                                        Giảng viên
                                    </span>
                                    <span class="text-xs">
                                        Trạng thái yêu cầu giảng viên hướng dẫn
                                    </span>
                                </div>
                            </NuxtLink>
                        </li>
                    </ul>
                </template>
            </UPopover>
            <UPopover mode="hover" v-if="userState.role === Role.ROLE_BUSINESS">
                <UButton color="black" variant="ghost" label="Bài đã đăng"
                         class="hover:text-primary-500 dark:hover-text-400"
                         trailing-icon="heroicons:chevron-down-16-solid" />

                <template #panel>
                    <ul class="flex flex-col gap-y-1 p-2">
                        <li
                            class="rounded-lg p-2 duration-300 hover:bg-black/5 dark:hover:bg-white/5">
                            <NuxtLink to="/business/recruitment" class="flex items-center gap-x-4">
                                <UIcon class="h-6 w-6 self-start" name="mingcute:bookmarks-line" />
                                <div class="flex w-32 flex-col gap-y-1">
                                    <span class="text-sm font-bold">
                                        Tuyển dụng
                                    </span>
                                    <span class="text-xs">
                                        Trạng thái các bài tuyển dụng đã đăng
                                    </span>
                                </div>
                            </NuxtLink>
                        </li>
                    </ul>
                </template>
            </UPopover>
            <UPopover mode="hover" v-if="userState.role === Role.ROLE_INSTRUCTOR">
                <UButton color="black" variant="ghost" label="Sinh viên yêu cầu"
                         class="hover:text-primary-500 dark:hover-text-400"
                         trailing-icon="heroicons:chevron-down-16-solid" />

                <template #panel>
                    <ul class="flex flex-col gap-y-1 p-2">
                        <li
                            class="rounded-lg p-2 duration-300 hover:bg-black/5 dark:hover:bg-white/5">
                            <NuxtLink to="/instructor/student" class="flex items-center gap-x-4">
                                <UIcon class="h-6 w-6 self-start" name="mingcute:group-line" />
                                <div class="flex w-32 flex-col gap-y-1">
                                    <span class="text-sm font-bold">
                                        Sinh viên
                                    </span>
                                    <span class="text-xs">
                                        Danh sách sinh viên yêu cầu hướng dẫn thực tập
                                    </span>
                                </div>
                            </NuxtLink>
                        </li>
                    </ul>
                </template>
            </UPopover>
            <UPopover mode="hover">
                <UButton color="black" variant="ghost" label="Tìm việc bằng AI"
                         class="hover:text-primary-500 dark:hover-text-400"
                         trailing-icon="heroicons:chevron-down-16-solid" />

                <template #panel>
                    <ul class="flex flex-col gap-y-1 p-2">
                        <li
                            class="rounded-lg p-2 duration-300 hover:bg-black/5 dark:hover:bg-white/5">
                            <NuxtLink to="/find" class="flex items-center gap-x-4">
                                <UIcon class="h-6 w-6 self-start" name="mingcute:android-2-line" />
                                <div class="flex w-32 flex-col gap-y-1">
                                    <span class="text-sm font-bold">
                                        AI
                                    </span>
                                    <span class="text-xs">
                                        Tìm việc bằng AI với CV
                                    </span>
                                </div>
                            </NuxtLink>
                        </li>
                    </ul>
                </template>
            </UPopover>
        </div>

        <!-- * End -->
        <div class="flex flex-1 flex-row items-center justify-end">
            <AvatarHeader />
        </div>
    </div>
</template>