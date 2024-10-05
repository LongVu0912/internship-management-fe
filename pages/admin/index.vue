<script setup lang="ts">
import { PageConfig } from '~/types/student/PageConfig';
import type Student from '~/types/student/Student';

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
const isInputModalOpen = ref(false);
const searchTerm = ref('');
const currentPage = ref(1);
const pageSize = ref(5);
const selectedMajor = ref([]);

const pageConfig = ref(new PageConfig());
const studentList = ref<Student[]>([]);

// * Lifecycle
onBeforeMount(async () => {
    await fetchData();
    isPageLoading.value = false;
});

// * Functions
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

const handleUndoneButton = () => {
    nuxtToast({
        description: "Chưa làm xong",
    })
}

// * Watches
watch([currentPage, pageSize], () => {
    fetchData();
});

// * Data
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
        key: 'year',
        label: 'Khoá'
    },
    {
        key: 'actions'
    }
]

const majors = [
    "Ngành Robot và trí tuệ nhân tạo", "Ngành Thiết kế đồ họa", "Ngành Kỹ thuật Công nghiệp",
];
</script>

<template>
    <Loading v-if="isPageLoading" />
    <div v-else class="flex flex-col gap-2">
        <div class="mb-2 flex flex-col justify-between gap-2 md:flex-row">
            <div class="flex flex-col gap-2 md:flex-row">
                <UForm :state="pageConfig" @submit.prevent="fetchData">
                    <UInput v-model="searchTerm"
                            placeholder="Tìm tên sinh viên..."
                            class="w-64"
                            size="sm"
                            :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
                        <template #trailing>
                            <UButton icon="heroicons:magnifying-glass-16-solid" color="primary"
                                     class="-me-2.5 rounded-none rounded-r-md" type="submit" />
                        </template>
                    </UInput>
                </UForm>
                <USelectMenu class="w-64" v-model="selectedMajor" :options="majors" multiple placeholder="Chọn ngành" />
            </div>
            <div>
                <UButton color="primary" @click="isInputModalOpen = true">Nhập</UButton>
            </div>
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
                    {{ row.dob }}
                </div>
                <UBadge class="mt-1 w-10 justify-center" color="gray" variant="outline">
                    {{ row.profile.isMale ? "Nam" : "Nữ" }}
                </UBadge>
            </template>

            <template #email-data="{ row }">
                <div class="font-medium">
                    {{ row.profile.email }}
                </div>
            </template>

            <template #major-data="{ row }">
                <div class="font-medium">
                    {{ row.major.name }}
                </div>
                <UBadge class="mt-1 justify-center" color="gray" variant="outline">
                    {{ row.major.faculty.name }}
                </UBadge>
            </template>

            <template #year-data="{ row }">
                <div class="font-medium">
                    {{ row.year }}
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
                    <USelect v-model.number="pageSize" :options="[5, 6, 7, 8, 9, 10]" />
                </div>
                <UPagination :max="7" v-model="currentPage" :page-count="pageSize"
                             :total="pageConfig?.totalRecords || 0" />
            </div>
        </div>
    </div>

    <UModal v-model="isInputModalOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Nhập dữ liệu từ file excel
                    </h3>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="isInputModalOpen = false" />
                </div>
            </template>
            <div class="flex flex-col justify-center">
                <UInput type="file" size="sm" icon="i-heroicons-folder" />
            </div>

            <template #footer>
                <UButton color="primary" class="w-full rounded-md" size="lg" block @click="handleUndoneButton">
                    Nhập dữ liệu
                </UButton>
            </template>
        </UCard>
    </UModal>
</template>
