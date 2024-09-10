<script setup lang="ts">
// ? Emit event to parent component to close dialog
const emit = defineEmits(['hideDialog']);

const props = defineProps<{
    isOpen: boolean;
    title: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
}>();

const isOpen = ref(false);

watch(() => props.isOpen, (newValue) => {
    isOpen.value = newValue;
});

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
                {{ props.message }}
            </div>

            <template #footer>
                <div class="flex justify-end">
                    <UButton class="mr-2" color="gray" variant="ghost" @click="onCancelButton">
                        Cancel
                    </UButton>
                    <UButton color="primary" @click="onConfirmButton">
                        Confirm
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>