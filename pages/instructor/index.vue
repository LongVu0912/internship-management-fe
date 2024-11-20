<script setup lang="ts">
import type Instructor from '~/types/instructor/Instructor';


definePageMeta({
    layout: 'instructor',
    middleware: 'instructor',
})

// * Imports
const { $apiToken } = useNuxtApp();
const instructorRepository = InstructorRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const instructor = ref<Instructor>({} as Instructor);
const isPageLoading = ref(true);
const updateModal = ref({
    isOpen: false,
    isSubmitting: false,
})

const gender = computed({
    get: () => (instructor.value.profile.isMale ? 'Nam' : 'Nữ'),
    set: (value: string) => {
        instructor.value.profile.isMale = (value === 'Nam');
    }
});

// * Lifecycle
onBeforeMount(() => {
    fetchData();
})

const fetchData = async () => {
    isPageLoading.value = true;
    const apiResponse = await instructorRepository.getMyInstructorData();

    if (apiResponse.code !== 200) {
        showError({
            statusCode: 404,
            statusMessage: "Page not found",
        })
    }

    instructor.value = apiResponse.result;
    isPageLoading.value = false;
}

const handleUpdateProfile = async () => {
    updateModal.value.isSubmitting = true;
    instructor.value.facultyId = instructor.value.faculty.facultyId;
    const apiResponse = await instructorRepository.updateInstructor(instructor.value);

    if (apiResponse.code !== 200) {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
    else {
        nuxtToast({
            description: 'Cập nhật thông tin thành công',
            type: 'success',
        });
        fetchData();
        updateModal.value.isOpen = false;
    }

    updateModal.value.isSubmitting = false;
}
</script>

<template>
    <div v-if="isPageLoading">
        <Loading />
    </div>
    <UCard v-else>
        <template #header>
            <div class="flex flex-row items-center gap-4">
                <div class="shrink-0">
                    <UAvatar
                             size="xl"
                             :alt="instructor?.profile.fullname" />
                </div>
                <div class="text-xl font-bold">
                    {{ instructor?.profile.fullname }}
                </div>
            </div>
        </template>
        <div class="flex gap-4 py-2">
            <div class="flex w-full flex-col justify-between gap-4 md:flex-row">
                <div class="flex w-full flex-col gap-4">
                    <div class="text-xl font-bold leading-6">
                        Thông tin cá nhân
                    </div>
                    <div class="flex w-full flex-col gap-3 md:flex-row">
                        <div class="space-y-3 md:w-1/2">
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:building-3-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Khoa</div>
                                    <div>{{ instructor?.faculty.facultyId + ' - ' + instructor?.faculty.name }}
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:mail-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Email</div>
                                    <div>{{ instructor?.profile.email }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-3 md:w-1/2">
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:phone-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Số điện thoại</div>
                                    <div>{{ instructor?.profile.phoneNumber }}</div>
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:user-info-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Giới tính</div>
                                    <div>{{ instructor?.profile.isMale ? 'Nam' : 'Nữ' }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <UDivider size="xs" />
                    <div class="text-xl font-bold leading-6">
                        Bio
                    </div>
                    <NewLineText :text="instructor?.profile.bio" />
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-end">
                <UButton icon="mingcute:save-2-line" label="Cập nhật" color="primary"
                         @click="updateModal.isOpen = true" />
            </div>
        </template>
    </UCard>

    <UModal :ui="{ width: 'sm:max-w-3xl' }" v-model="updateModal.isOpen" prevent-close>
        <form @submit.prevent="handleUpdateProfile">
            <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="text-base font-semibold">
                            Cập nhật thông tin
                        </div>
                        <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                                 @click="updateModal.isOpen = false" />
                    </div>
                </template>
                <div class="flex flex-col gap-3">
                    <div class="flex flex-col gap-4 md:flex-row">
                        <div class="w-full space-y-1">
                            <div class="font-medium">Số điện thoại</div>
                            <UInput required v-model="instructor.profile.phoneNumber" />
                        </div>
                        <div class="w-full space-y-1">
                            <div class="font-medium">Giới tính</div>
                            <USelect color="gray" size="md" :options="['Nữ', 'Nam']" v-model:model-value="gender" />
                        </div>
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Bio</div>
                        <UTextarea required size="lg" color="gray" :rows="5" class="w-full"
                                   v-model="instructor.profile.bio">
                        </UTextarea>
                    </div>
                </div>
                <template #footer>
                    <div class="flex justify-end">
                        <UButton class="mr-2" color="gray" variant="ghost" @click="updateModal.isOpen = false">
                            Huỷ
                        </UButton>
                        <UButton color="primary" type="submit" :loading="updateModal.isSubmitting">
                            Cập nhật
                        </UButton>
                    </div>
                </template>
            </UCard>
        </form>
    </UModal>
</template>