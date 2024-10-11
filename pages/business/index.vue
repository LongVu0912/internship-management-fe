<script setup lang="ts">
import type Business from '~/types/business/Business';

definePageMeta({
    layout: 'business',
    middleware: 'business',
})

// * Imports
const { $apiToken } = useNuxtApp();
const businessRepository = BusinessRepository($apiToken);
const route = useRoute();

// * Refs
const isPageLoading = ref(true);
const business = ref<Business>();

// * Lifecycle
onBeforeMount(async () => {
    const apiResponse = await businessRepository.getBusinessById({
        businessId: route.params.businessId as string,
    });

    if (apiResponse.code != 200) {
        showError({
            statusCode: 404,
            statusMessage: "Page not found",
        })
    }

    business.value = apiResponse.result;

    isPageLoading.value = false;
})
</script>

<template>
    <div v-if="isPageLoading">
        <Loading />
    </div>
</template>