<script setup lang="ts">
import { Filter } from '~/types/page_config/Filter';
import { PageConfig } from '~/types/page_config/PageConfig';
import type Student from '~/types/student/Student';

definePageMeta({
    layout: 'admin',
    middleware: 'admin',
})

// * Imports
const { $apiToken } = useNuxtApp();
const adminRepository = AdminRepository($apiToken);
const studentRepository = StudentRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const isDataLoading = ref(true);
const isInputModalOpen = ref(false);
const isSubmitting = ref(false);
const excelFile = ref<File | null>(null);

const fullNameFilter = ref(new Filter("profile.fullname"));
const pageConfig = reactive(new PageConfig());
pageConfig.filters.push(fullNameFilter.value);
const studentList = ref<Student[]>([]);

// * Lifecycle
onBeforeMount(async () => {
    await fetchData();
});

// * Functions
const fetchData = async () => {
    isDataLoading.value = true;

    const apiResponse = await adminRepository.getStudentPaging(pageConfig);

    if (apiResponse.code === 200) {
        studentList.value = apiResponse.result.data;

        pageConfig.update(apiResponse.result.pageConfig);

        isDataLoading.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

// * Watches
watch(
    () => pageConfig.currentPage,
    async (currentPage) => {
        await fetchData();
    }
)

// * Functions
const handleInputExcelFile = (event: any) => {
    if (event && event.length > 0) {
        excelFile.value = event[0];
    } else {
        excelFile.value = null;
    }
};

const handleImportStudents = async () => {
    isSubmitting.value = true;

    if (excelFile.value == null) {
        nuxtToast({
            description: "Hãy chọn file Excel"
        })
        isSubmitting.value = false;
        return;
    }

    const apiResponse = await studentRepository.importStudents({
        file: excelFile.value,
    });

    if (apiResponse.code === 200) {
        nuxtToast({
            description: "Thêm sinh viên thành công",
            type: "success",
        });
        fetchData();
        isInputModalOpen.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }

    isSubmitting.value = false;
}

const searchData = async () => {
    if (pageConfig.currentPage !== 1) {
        pageConfig.currentPage = 1;
    } else {
        await fetchData();
    }
}

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
            click: nuxtToast,
        },
    ],
    [
        {
            label: 'Lưu trữ',
            icon: 'i-heroicons-archive-box-20-solid',
            click: nuxtToast,
        },
        {
            label: 'Di chuyển',
            icon: 'i-heroicons-arrow-right-circle-20-solid',
            click: nuxtToast,
        }
    ],
    [
        {
            label: 'Xoá',
            icon: 'i-heroicons-trash-20-solid',
            click: nuxtToast,
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
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="mb-2 flex flex-col justify-between gap-2 md:flex-row">
            <div class="flex flex-col gap-2 md:flex-row">
                <form @submit.prevent="searchData">
                    <UInput v-model="pageConfig.filters[0].value"
                            placeholder="Tìm tên sinh viên..."
                            class="w-64"
                            size="sm"
                            :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
                        <template #trailing>
                            <UButton icon="heroicons:magnifying-glass-16-solid" color="primary"
                                     class="-me-2.5 rounded-none rounded-r-md" type="submit" />
                        </template>
                    </UInput>
                </form>
            </div>
            <div>
                <UButton color="primary" @click="isInputModalOpen = true;">Nhập</UButton>
            </div>
        </div>

        <UTable :loading="isDataLoading" class="rounded-lg border border-gray-100 dark:border-gray-700"
                :columns="columns"
                :rows="studentList">
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
                    <USelect v-model.number="pageConfig.pageSize" :options="[5, 6, 7, 8, 9, 10]" />
                </div>
                <UPagination :max="7" v-model="pageConfig.currentPage" :page-count="pageConfig.pageSize"
                             :total="pageConfig.totalRecords" />
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
                <UInput type="file" size="sm" icon="i-heroicons-folder" accept=".xlsx" @change="handleInputExcelFile" />
            </div>

            <template #footer>
                <UButton :loading="isSubmitting" color="primary" class="w-full rounded-md" size="lg" block
                         @click="handleImportStudents">
                    Nhập dữ liệu
                </UButton>
            </template>
        </UCard>
    </UModal>
</template>
