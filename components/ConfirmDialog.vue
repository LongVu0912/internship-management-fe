<script setup lang="ts">
// ? Emit event to parent component to close dialog
const emit = defineEmits(['hideDialog']);

// * Props
const props = defineProps<{
    isOpen: boolean;
    title: string;
    description: string;
    onCancel: () => void;
    onConfirm: () => void;
}>();

// * Refs
const isOpen = ref(false);

// * Watches
watch(() => props.isOpen, (newValue) => {
    isOpen.value = newValue;
});

// * Functions
const hideDialog = () => {
    isOpen.value = false;
    emit('hideDialog');
};

const onCancelButton = () => {
    props.onCancel();
    hideDialog();
};

const onConfirmButton = () => {
    props.onConfirm();
    hideDialog();
};
</script>

<template>
    <UModal v-model="isOpen" prevent-close>
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        {{ props.title }}
                    </h3>
                </div>
            </template>

            <div>
                {{ props.description }}
            </div>

            <template #footer>
                <div class="flex justify-end">
                    <UButton class="mr-2" color="gray" variant="ghost" @click="onCancelButton">
                        Huỷ
                    </UButton>
                    <UButton color="primary" @click="onConfirmButton">
                        Xác nhận
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>