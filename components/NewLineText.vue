<script setup lang="ts">
const props = defineProps<{
    text?: string;
}>();

const splitLines = computed(() => {
    return props.text?.split('\n');
});
</script>

<template>
    <div>
        <p v-for="(line, index) in splitLines" :key="index">
            {{ line }}
        </p>
    </div>
</template>