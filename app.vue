<!-- <script setup lang="ts">

const { $api } = useNuxtApp();
const authRepository = AuthRepository($api);
const userState = useUserState();

await callOnce(async () => {
    userState.value = await authRepository.getUserState();
    console.log("app.vue", userState.value);  
});

</script> -->

<template>

    <Head>
        <Title>HCMUTE INTERNSHIP</Title>
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
