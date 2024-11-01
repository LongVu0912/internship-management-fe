<script setup lang="ts">
import type Instructor from '~/types/instructor/Instructor';
import { Filter } from '~/types/page_config/Filter';
import { PageConfig } from '~/types/page_config/PageConfig';

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

const pageConfig = reactive(new PageConfig());
const fullNameFilter = ref(new Filter("profile.fullname"));
pageConfig.filters.push(fullNameFilter.value);
const instructors = ref<Instructor[]>([]);

// * Lifecycle
onBeforeMount(async () => {
    await fetchInstructorsData();
});

// * Functions
const fetchInstructorsData = async () => {
    isDataLoading.value = false;
    const apiResponse = await instructorRepository.getInstructorPaging(pageConfig);

    if (apiResponse.code != 200) {
        nuxtToast({
            description: apiResponse.message,
            type: "error",
        })
        isDataLoading.value = false;
        return false;
    }

    pageConfig.update(apiResponse.result.pageConfig);
    instructors.value = apiResponse.result.data;
    isDataLoading.value = false;
    return true;
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
            :rows="instructors">
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

    <div class="flex justify-between pt-4">
        <div>
        </div>
        <div class="flex flex-row items-center gap-2">
            <div>
                <USelect v-model.number="pageConfig.pageSize" :options="[5, 6, 7, 8, 9, 10]" />
            </div>
            <UPagination :max="7" v-model="pageConfig.currentPage" :page-count="pageConfig.pageSize"
                         :total="pageConfig.totalRecords" />
        </div>
    </div>
</template>