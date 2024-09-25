<script setup lang="ts">
import { PageConfig } from '~/types/student/PageConfig';
import type Student from '~/types/student/Student';

definePageMeta({
    layout: 'admin',
    middleware: 'admin',
})

const { $apiToken } = useNuxtApp();
const adminRepository = AdminRepository($apiToken);

const searchTerm = ref('');
const currentPage = ref(1);
const pageSize = ref(6);

const numericPageSize = computed({
    get: () => pageSize.value,
    set: (value) => {
        pageSize.value = Number(value);
    },
});

const pageConfig = ref(new PageConfig());
const studentList = ref<Student[]>([]);

const fetchData = async () => {
    pageConfig.value.update({
        currentPage: currentPage.value,
        pageSize: pageSize.value,
        fullname: searchTerm.value,
    });
    const apiResponse = await adminRepository.getAllStudentPaging(pageConfig.value);
    studentList.value = apiResponse.result.data;
    pageConfig.value.update(apiResponse.result.pageConfig);
}

onMounted(async () => {
    await fetchData();
});

watch([currentPage, pageSize], () => {
    fetchData();
});

const columns = [
    {
        key: 'id',
        label: 'MSSV'
    },
    {
        key: 'name',
        label: 'Tên'
    },
    {
        key: 'gender',
        label: 'Giới tính'
    },
    {
        key: 'email',
        label: 'Email'
    },
    {
        key: 'major',
        label: 'Ngành'
    },
    {
        key: 'actions'
    }
]

const items = (row: any) => [
    [
        {
            label: 'Sửa',
            icon: 'i-heroicons-pencil-square-20-solid',
        },
        {
            label: 'Nhân bản',
            icon: 'i-heroicons-document-duplicate-20-solid'
        }
    ],
    [
        {
            label: 'Lưu trữ',
            icon: 'i-heroicons-archive-box-20-solid'
        },
        {
            label: 'Di chuyển',
            icon: 'i-heroicons-arrow-right-circle-20-solid'
        }
    ],
    [
        {
            label: 'Xoá',
            icon: 'i-heroicons-trash-20-solid'
        }
    ]
]
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="flex flex-row justify-between">
            <UForm :state="pageConfig" @submit.prevent="fetchData">
                <UInput v-model="searchTerm" placeholder="Tìm tên sinh viên..."
                        :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
                    <template #trailing>
                        <UButton icon="heroicons:magnifying-glass-16-solid" color="primary"
                                 class="-me-2.5 rounded-none rounded-r-md" type="submit" />
                    </template>
                </UInput>
            </UForm>
            <UButton>Import</UButton>
        </div>
        <UTable class="rounded-lg border border-gray-100 dark:border-gray-700" :columns="columns" :rows="studentList">
            <template #id-data="{ row }">
                {{ row.studentId }}
            </template>

            <template #name-data="{ row }">
                {{ row.profile.fullname }}
            </template>

            <template #gender-data="{ row }">
                {{ row.profile.gender }}
            </template>

            <template #email-data="{ row }">
                {{ row.profile.email }}
            </template>

            <template #major-data="{ row }">
                {{ row.major.name }}
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
                    <USelect v-model="numericPageSize" :options="[5, 6, 7, 8, 9, 10]" />
                </div>
                <UPagination :max="7" v-model="currentPage" :page-count="pageSize"
                             :total="pageConfig?.totalRecords || 0" />
            </div>
        </div>
    </div>
</template>
