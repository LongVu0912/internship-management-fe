<script setup lang="ts">
definePageMeta({
    layout: "account",
});
</script>

<template>
    <div class="p-4">
        <div class="text-lg font-medium">
            Account
        </div>
        <div class="text-sm font-normal">
            Real-time information about your account
        </div>
        <UDivider label="" size="xs" class="my-4" />

        <div class="flex flex-row items-center">
            <UAvatar
                     size="lg"
                     src="/avatar.png"
                     alt="Avatar" />
            <div class="ml-4 flex flex-col justify-center gap-1">
                <UBadge
                        size="md"
                        color="gray"
                        label="Hoàng Long Vũ" />
                <div class="ml-1 text-sm">
                    21110FIE2
                </div>
            </div>
        </div>

        <UDivider label="" size="xs" class="my-4" />

        <div class="text-lg font-semibold">
            Email
        </div>
        <div>
            <UBadge
                    icon="heroicons:envelope-16-solid"
                    size="md"
                    color="gray"
                    label="21110113@student.hcmute.edu.vn" />
        </div>

        <UDivider label="" size="xs" class="my-4" />

        <div class="text-lg font-medium">
            Password
        </div>
        <div class="text-sm font-normal">
            Modify your current password
        </div>
        <div class="mt-2">
            <div class="flex flex-row gap-4">
                <UInput
                        icon="heroicons:key-16-solid"
                        size="sm"
                        color="white"
                        placeholder="Current password" />
                <UInput
                        icon="heroicons:key-16-solid"
                        size="sm"
                        color="white"
                        placeholder="New password" />
            </div>
        </div>

        <UDivider label="" size="xs" class="my-4" />

        <div class="text-lg font-medium">
            Information
        </div>
        <div class="text-sm font-normal">
            Update your personal information
        </div>
    </div>
</template>