<script setup lang="ts">
const { t } = useI18n();
</script>

<template>

    <Head>
        <title>{{ t('title') }}</title>
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
