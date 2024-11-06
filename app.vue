<template>

    <Head>
        <Title>HCMUTE INTERNSHIP</Title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
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
