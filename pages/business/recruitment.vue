<script setup lang="ts">
definePageMeta({
    layout: "business",
    middleware: "business",
});

// * Imports
const { $apiToken } = useNuxtApp();
const nuxtToast = useNuxtToast();

// * Refs
const isPageLoading = ref(true);

// * Lifecycle
onBeforeMount(async () => {

});
</script>

<template>
    <div v-if="isPageLoading">
        <Loading />
    </div>
</template>