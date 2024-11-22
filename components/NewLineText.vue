<script setup lang="ts">
const props = defineProps<{
    text?: string;
}>();

const formattedText = computed(() => {
    return props.text ? props.text.replace(/\n/g, '<br>') : '';
});
</script>

<template>
    <div class="break-words" v-html="formattedText"></div>
</template>
