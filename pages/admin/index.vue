<script setup lang="ts">
import { PageConfig } from '~/types/student/PageConfig';
import type Student from '~/types/student/Student';

definePageMeta({
    layout: 'admin',
    middleware: 'admin',
})

const { $apiToken } = useNuxtApp();
const adminRepository = AdminRepository($apiToken);
const appUtils = AppUtils();
const nuxtToast = useNuxtToast();

const isInputModalOpen = ref(false);

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
        key: 'name',
        label: 'Tên'
    },
    {
        key: 'dob',
        label: 'Ngày sinh'
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

const handleUndoneButton = () => {
    nuxtToast({
        description: "Chưa làm xong",
    })
}

const items = (row: any) => [
    [
        {
            label: 'Hồ sơ',
            icon: 'mingcute:profile-line',
            click: () => {
                navigateTo(`/student/${row.studentId}`, {
                    open: {
                        target: '_blank',
                    }
                })
            }
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
            <UButton @click="isInputModalOpen = true">Nhập</UButton>
        </div>
        <UTable class="rounded-lg border border-gray-100 dark:border-gray-700" :columns="columns" :rows="studentList">
            <template #name-data="{ row }">
                <div class="font-medium">
                    {{ row.profile.fullname }}
                </div>
                <UBadge class="mt-1" color="primary" variant="outline">
                    {{ row.studentId }}
                </UBadge>
            </template>

            <template #dob-data="{ row }">
                <div class="font-medium">
                    {{ appUtils.formatDate(row.dob) }}
                </div>
                <UBadge class="mt-1 w-10 justify-center" color="gray" variant="outline">
                    {{ row.profile.isMale ? "Nam" : "Nữ" }}
                </UBadge>
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

    <UModal v-model="isInputModalOpen" prevent-close>
        <UCard
               :ui="{ body: { padding: 'px-4 pb-4 lg:px-8 lg:pb-8' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', strategy: 'override' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Nhập dữ liệu từ file excel
                    </h3>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="isInputModalOpen = false" />
                </div>
            </template>
            <div>
                <UInput type="file" size="sm" icon="i-heroicons-folder" />
                <UButton class="mt-6 w-full rounded-md" size="lg" block @click="handleUndoneButton">
                    Nhập dữ liệu
                </UButton>
            </div>
        </UCard>
    </UModal>
</template>
