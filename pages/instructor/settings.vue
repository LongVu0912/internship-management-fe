<script setup lang="ts">

definePageMeta({
    layout: 'instructor',
    middleware: 'instructor',
})

// * Imports
const { $apiToken } = useNuxtApp();
const businessRepository = BusinessRepository($apiToken);

// * Refs
const isPageLoading = ref(true);

// * Lifecycle
onBeforeMount(async () => {

})
</script>

<template>
    <div>
        <ChangePassword />
    </div>
</template>