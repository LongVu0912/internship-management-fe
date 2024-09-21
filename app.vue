<script setup lang="ts">
</script>

<template>

    <Head>
        <title>HCMUTE INTERNSHIP</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
    </Head>
    <NuxtLoadingIndicator color="primary" />
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <UNotifications :ui="{
        position: 'top-0 right-0',
        strategy: 'override',
    }" />
</template>
