<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
const { locale } = useI18n();

const currentLocale = ref('en');

// * Get user locale from storage or set default to 'en'
const userLocale = useStorage('locale', 'en');

onMounted(() => {
    // * Set locale from storage
    useI18n().setLocale(userLocale.value);
    // * Set current locale
    currentLocale.value = userLocale.value;
});

const locales = [
    {
        name: 'Tiếng Việt',
        value: 'vi'
    },
    {
        name: 'English',
        value: 'en',
    },
]

watch(currentLocale, (newLocale) => {
    // * Set new locale
    locale.value = newLocale;
    // * Save to storage
    userLocale.value = newLocale;
});

</script>

<template>
    <ClientOnly>
        <div class="fixed bottom-0 right-0 z-50 flex justify-end p-4">
            <div class="flex-end">
                <USelect v-model="currentLocale" :options="locales" option-attribute="name" />
            </div>
        </div>
    </ClientOnly>
</template>