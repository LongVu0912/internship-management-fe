<script setup lang="ts">
definePageMeta({
    layout: "account",
});
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="text-xl font-medium">
            Tài khoản
        </div>
        <div class="text-sm font-normal">
            Thông tin tài khoản của bạn
        </div>
        <div class="flex flex-row items-center">
            <div>
                <UAvatar
                         size="lg"
                         src="/avatar.png"
                         alt="Avatar" />
            </div>
            <div class="ml-4 flex flex-col justify-center gap-1">
                <div class="flex flex-col gap-2">
                    <div>
                        <UBadge
                                size="md"
                                color="gray"
                                label="21110113" />
                    </div>
                    <div class="flex gap-2">
                        <UBadge
                                size="md"
                                color="green"
                                variant="outline"
                                label="Seeking" />
                        <UBadge
                                size="md"
                                color="red"
                                variant="outline"
                                label="Not Seeking" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <UDivider label="" size="xs" class="my-4" />

    <div class="flex flex-col gap-2">
        <div class="text-xl font-semibold">
            Thông tin cá nhân
        </div>
        <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
                <UIcon name="heroicons:user-circle" class="h-6 w-6" />
                <UBadge
                        size="md"
                        color="gray"
                        label="Hoàng Long Vũ" />
            </div>
            <div class="flex items-center gap-2">
                <UIcon name="heroicons:calendar-20-solid" class="h-6 w-6" />
                <UBadge
                        size="md"
                        color="gray"
                        label="22/12/2003" />
            </div>
            <div class="flex items-center gap-2">
                <UIcon name="heroicons:envelope" class="h-6 w-6" />
                <UBadge
                        size="md"
                        color="gray"
                        label="21110113@student.hcmute.edu.vn" />
            </div>
            <div class="flex items-center gap-2">
                <UIcon name="heroicons:device-phone-mobile-20-solid" class="h-6 w-6" />
                <UBadge
                        size="md"
                        color="gray"
                        label="0987654321" />
            </div>
        </div>
    </div>

    <UDivider label="" size="xs" class="my-4" />

    <div class="flex flex-col gap-2">
        <div class="text-xl font-medium">
            Bio
        </div>
        <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
                <UIcon name="heroicons:academic-cap" class="h-6 w-6" />
                <UBadge
                        size="md"
                        color="gray"
                        label="2021" />
            </div>
            <div class="flex items-center gap-2">
                <UIcon name="heroicons:book-open" class="h-6 w-6" />
                <UBadge
                        size="md"
                        color="gray"
                        label="Công nghệ thông tin" />
            </div>
            <div class="text-justify text-sm font-normal">
                I am a dedicated software developer with expertise in Java, Spring Boot, and Vue.js. I specialize in
                designing, coding, and maintaining robust software applications. My experience includes developing
                efficient
                backend systems, creating dynamic front-end interfaces, and ensuring seamless database connections.
                I am
                passionate about solving complex problems and continuously improving my skills to deliver
                high-quality
                software solutions.
            </div>
        </div>
    </div>
    <UDivider label="" size="xs" class="my-4" />

    <div class="flex flex-col items-start gap-2">
        <div class="text-lg font-medium">
            CV
        </div>
        <ULink
               to=""
               active-class="text-primary"
               inactive-class="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200">
            21110113_HoangLongVu_CV.pdf
        </ULink>
    </div>

    <UDivider label="" size="xs" class="my-4" />

    <div class="flex flex-row justify-between gap-2">
        <div></div>
        <div class="flex gap-2">
            <UButton color="primary" variant="outline">Đổi mật khẩu</UButton>
            <UButton color="primary">Cập nhật</UButton>
        </div>
    </div>
</template>