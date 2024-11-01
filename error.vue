<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
    error: Object as () => NuxtError
})
</script>

<template>

    <Head>
        <Title>HCMUTE INTERNSHIP</Title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
    </Head>

    <div class="bg-app-primary flex min-h-screen items-center justify-center p-4">
        <div class="w-full max-w-md">
            <div class="rounded-md bg-gray-500/5">
                <div class="p-8 text-center">
                    <h1 class="mb-2 text-6xl font-bold">{{ error?.statusCode }}</h1>
                    <p class="mb-6 text-xl">{{ error?.statusMessage }}</p>
                    <UButton
                             to="/"
                             label="Trang chủ"
                             color="primary"
                             size="xl">
                    </UButton>
                </div>
            </div>
            <p class="mt-8 text-center">
                &copy; {{ new Date().getFullYear() }} HCMUTE INTERNSHIP. All rights reserved.
            </p>
        </div>
    </div>
</template>
