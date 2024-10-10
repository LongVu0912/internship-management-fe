<script setup lang="ts">
definePageMeta({
    layout: 'home',
})

// * Imports
const route = useRoute();

// * Refs
const isPageLoading = ref(true);

// * Lifecycle
onBeforeMount(async () => {
    isPageLoading.value = false;
})


</script>

<template>
    {{ route.params.id }}
</template>