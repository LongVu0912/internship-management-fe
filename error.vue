<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
    error: Object as () => NuxtError
})
</script>

<template>

    <Head>
        <title>HCMUTE INTERNSHIP</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
    </Head>
    <div class="bg-app-primary">
        <div class="flex min-h-screen items-center justify-center bg-cover bg-center">
            <div
                 class="flex w-80 flex-col items-center justify-center rounded-md py-6 shadow-md dark:bg-gray-800">
                <div class="text-primary text-3xl font-bold">{{ error?.statusCode }}</div>
                <div class="text-xl font-semibold">{{ error?.statusMessage }}</div>
                <UButton class="mt-4" @click="navigateTo('/')" size="xl">Home</UButton>
            </div>
        </div>
    </div>
</template>
