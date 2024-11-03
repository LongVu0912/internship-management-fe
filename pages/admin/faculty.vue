<script setup lang="ts">
import type Faculty from '~/types/faculty/Faculty';
import type { Major } from '~/types/major/Major';

definePageMeta({
    layout: 'admin',
    middleware: 'admin',
})

// * Imports
const { $apiToken } = useNuxtApp();
const adminRepository = AdminRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const isPageLoading = ref(true);
const isMajorModalOpen = ref(false);
const facultyList = ref<Faculty[]>();
const majorList = ref<Major[]>();
const currentFacultyId = ref('');
const currentPage = ref(1);
const pageSize = ref(5);

const rows = computed(() => {
    return facultyList.value?.slice((currentPage.value - 1) * pageSize.value, (currentPage.value) * pageSize.value)
})

// * Lifecycle
onBeforeMount(async () => {
    await fetchData();
    isPageLoading.value = false;
});

// * Functions
const fetchData = async () => {
    const apiResponse = await adminRepository.getAllFaculties();

    if (apiResponse.code == 200) {
        facultyList.value = apiResponse.result;
    }
    else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

const handleOpenMajorModal = async (facultyId: string) => {
    currentFacultyId.value = facultyId;
    const apiResponse = await adminRepository.getMajorsByFacultyId({
        facultyId: facultyId
    });
    if (apiResponse.code == 200) {
        majorList.value = apiResponse.result;
    }
    else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
    isMajorModalOpen.value = true;
}

const handleUndoneButton = () => {
    nuxtToast({
        description: "Chưa làm xong",
    })
}

// * Data
const items = (row: any) => [
    [
        {
            label: 'Danh sách ngành',
            icon: 'mingcute:book-3-line',
            click: () => {
                handleOpenMajorModal(row.facultyId);
            },
        },
        {
            label: 'Sửa',
            icon: 'i-heroicons-pencil-square-20-solid',
            click: handleUndoneButton,
        },
    ],
    [
        {
            label: 'Lưu trữ',
            icon: 'i-heroicons-archive-box-20-solid',
            click: handleUndoneButton,
        },
        {
            label: 'Di chuyển',
            icon: 'i-heroicons-arrow-right-circle-20-solid',
            click: handleUndoneButton,
        }
    ],
    [
        {
            label: 'Xoá',
            icon: 'i-heroicons-trash-20-solid',
            click: handleUndoneButton,
        }
    ]
]

const columns = [
    {
        key: 'facultyId',
        label: 'ID',
        class: '',
    },
    {
        key: 'name',
        label: 'Tên'
    },
    {
        key: 'actions'
    }
]
</script>

<template>
    <Loading v-if="isPageLoading" />
    <div v-else>
        <UTable class="rounded-lg border border-gray-100 dark:border-gray-700" :columns="columns" :rows="rows">
            <template #facultyId-data="{ row }">
                <UBadge class="flex w-14 justify-center" size="md" variant="outline" :label="row.facultyId" />
            </template>

            <template #name-data="{ row }">
                <div class="font-medium">
                    {{ row.name }}
                </div>
            </template>

            <template #actions-data="{ row }">
                <UDropdown :items="items(row)">
                    <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                </UDropdown>
            </template>
        </UTable>

        <div class="flex justify-end">
            <div class="flex flex-row items-center gap-2">
                <USelect v-model.number="pageSize" :options="[5, 6, 7, 8, 9, 10]" />
                <UPagination :max="7" v-model="currentPage" :page-count="pageSize"
                             :total="facultyList?.length || 0" />
            </div>
        </div>
    </div>

    <UModal v-model="isMajorModalOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Các ngành {{ currentFacultyId }}
                    </h3>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="isMajorModalOpen = false" />
                </div>
            </template>
            <div class="py-2">
                <div class="flex flex-col gap-2">
                    <UBadge color="gray" size="lg" v-for="major in majorList">
                        {{ major.name }}
                    </UBadge>
                </div>
            </div>
        </UCard>
    </UModal>
</template>
