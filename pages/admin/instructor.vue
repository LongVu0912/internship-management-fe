<script setup lang="ts">
import type Instructor from '~/types/instructor/Instructor';

definePageMeta({
    layout: "admin",
    middleware: 'admin',
});

// * Imports
const { $apiToken } = useNuxtApp();
const instructorRepository = InstructorRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const isDataLoading = ref(true);
const instructorList = ref<Instructor[]>([]);

// * Lifecycle
onBeforeMount(async () => {
    await fetchData();
});

// * Functions
const fetchData = async () => {
    isDataLoading.value = true;

    const apiResponse = await instructorRepository.getAllInstructor();

    if (apiResponse.code === 200) {
        instructorList.value = apiResponse.result;

        isDataLoading.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

// * Data
const items = (row: any) => [
    [
        {
            label: 'Hồ sơ',
            icon: 'mingcute:profile-line',
        },
        {
            label: 'Sửa',
            icon: 'i-heroicons-pencil-square-20-solid',
        },
    ],
    [
        {
            label: 'Lưu trữ',
            icon: 'i-heroicons-archive-box-20-solid',
        },
        {
            label: 'Di chuyển',
            icon: 'i-heroicons-arrow-right-circle-20-solid',
        }
    ],
    [
        {
            label: 'Xoá',
            icon: 'i-heroicons-trash-20-solid',
        }
    ]
]

const columns = [
    {
        key: 'name',
        label: 'Họ tên'
    },
    {
        key: 'email',
        label: 'Email'
    },
    {
        key: 'phoneNumber',
        label: 'Số điện thoại'
    },
    {
        key: 'actions'
    }
]
</script>

<template>
    <UTable :loading="isDataLoading" class="rounded-lg border border-gray-100 dark:border-gray-700"
            :columns="columns"
            :rows="instructorList">
        <template #name-data="{ row }">
            <div class="font-medium">
                {{ row.profile.fullname }}
            </div>
            <UBadge class="mt-1 w-10 justify-center" color="gray" variant="outline">
                {{ row.profile.isMale ? "Nam" : "Nữ" }}
            </UBadge>
        </template>

        <template #email-data="{ row }">
            <div class="font-medium">
                {{ row.profile.email }}
            </div>
            <UBadge class="mt-1 w-10 justify-center" color="gray" variant="outline">
                {{ row.faculty.facultyId }}
            </UBadge>
        </template>

        <template #phoneNumber-data="{ row }">
            <div class="font-medium">
                {{ row.profile.phoneNumber }}
            </div>
        </template>

        <template #actions-data="{ row }">
            <UDropdown :items="items(row)">
                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
            </UDropdown>
        </template>
    </UTable>
</template>