<script setup lang="ts">
import { Filter } from '~/types/page_config/Filter';
import { Order } from '~/types/page_config/Order';
import { PageConfig } from '~/types/page_config/PageConfig';
import type Profile from '~/types/profile/Profile';
import type Student from '~/types/student/Student';

definePageMeta({
    layout: 'admin',
    middleware: 'admin',
})

// * Imports
const { $apiToken } = useNuxtApp();
const studentRepository = StudentRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const isTableLoading = ref(true);
const inputModel = ref({
    isOpen: false,
    isSendingRequest: false,
});

const changePasswordModal = ref({
    isOpen: false,
    isSubmitting: false,
    profileId: '',
    newPassword: '',
    confirmPassword: '',
})

const adminChangePasswordModal = ref({
    isOpen: false,
    profileId: '',
})

const excelFile = ref<File | null>(null);

const sort = ref<any>({
    column: 'profile.fullname',
    direction: 'desc'
})

const pageConfig = reactive(new PageConfig());
pageConfig.orders.push(new Order("profile.fullname"));
pageConfig.filters.push(new Filter("profile.fullname"));
const studentList = ref<Student[]>([]);

// * Lifecycle
onBeforeMount(() => {
    fetchTableData();
});

// * Functions
const fetchTableData = async () => {
    isTableLoading.value = true;

    const apiResponse = await studentRepository.getStudentPaging(pageConfig);

    if (apiResponse.code === 200) {
        studentList.value = apiResponse.result.data;

        pageConfig.update(apiResponse.result.pageConfig);

        isTableLoading.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

const handleInputExcelFile = (event: any) => {
    if (event && event.length > 0) {
        excelFile.value = event[0];
    } else {
        excelFile.value = null;
    }
};

const handleImportStudents = async () => {
    if (excelFile.value == null) {
        nuxtToast({
            description: "Hãy chọn file Excel"
        })
        return;
    }

    inputModel.value.isSendingRequest = true;

    const apiResponse = await studentRepository.importStudents({
        file: excelFile.value,
    });

    if (apiResponse.code === 200) {
        nuxtToast({
            description: "Thêm sinh viên thành công",
            type: "success",
        });
        fetchTableData();
        inputModel.value.isOpen = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }

    inputModel.value.isSendingRequest = false;
}

const searchTable = async () => {
    if (pageConfig.currentPage !== 1) {
        pageConfig.currentPage = 1;
    } else {
        fetchTableData();
    }
}

const handleChangePassword = () => {
    changePasswordModal.value.isSubmitting = true;

    console.log(changePasswordModal.value);

    changePasswordModal.value.isSubmitting = false;
}

const openAdminChangePasswordModal = (row: Student) => {
    adminChangePasswordModal.value.profileId = row.profile.profileId;
    adminChangePasswordModal.value.isOpen = true;
}

// * Watches
watch(
    [() => pageConfig.currentPage, () => pageConfig.pageSize],
    ([newCurrentPage, newPageSize], [oldCurrentPage, oldPageSize]) => {
        if (!isTableLoading.value) {
            if (newPageSize !== oldPageSize) {
                pageConfig.currentPage = 1;
            }
            fetchTableData();
        }
    }
)

watch(sort, () => {
    if (!isTableLoading.value) {
        pageConfig.orders[0].sort = sort.value.column;
        pageConfig.orders[0].sortOrderType = sort.value.direction.toUpperCase();

        fetchTableData();
    }
})

// * Data
const columns = [
    {
        key: "profile.fullname",
        label: "Tên",
        sortable: true,
    },
    {
        key: "dob",
        label: "Ngày sinh",
        sortable: true,
    },
    {
        key: "profile.email",
        label: "Email",
        sortable: true,
    },
    {
        key: "major.name",
        label: "Ngành",
        sortable: true,
    },
    {
        key: "year",
        label: "Khoá",
        sortable: true,
    },
    {
        key: "actions",
        label: "Hành động"
    }
]

const selectedColumns = ref([...columns]);

const items = (row: Student) => [
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
    ],
    [
        {
            label: 'Đổi mật khẩu',
            icon: 'mingcute:key-2-line',
            click: () => {
                openAdminChangePasswordModal(row);
            },
        },
        {
            label: 'Dừng hoạt động',
            icon: 'mingcute:archive-line',
            click: nuxtToast,
        }
    ],
    [
        {
            label: 'Xoá',
            icon: 'mingcute:delete-2-line',
            click: nuxtToast,
        }
    ]
]
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="flex justify-end">
            <div class="flex flex-col gap-2 md:flex-row">
                <UButton icon="mingcute:new-folder-line" color="primary" @click="inputModel.isOpen = true"
                         label="Nhập sinh viên" />
                <CreateStudent />
            </div>
        </div>

        <UCard class="w-full" :ui="{
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
            footer: { padding: 'p-4' }
        }">

            <template #header>
                <h1 class="text-center text-xl font-semibold text-gray-900 dark:text-white">
                    Danh sách sinh viên
                </h1>
            </template>

            <div class="flex flex-col justify-between gap-2 px-4 py-3 xl:flex-row">
                <form @submit.prevent="searchTable">
                    <UInput placeholder="Tìm tên sinh viên..." class="min-w-64" size="sm" color="white"
                            v-model="pageConfig.filters[0].value"
                            :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
                        <template #trailing>
                            <UButton icon="heroicons:magnifying-glass-16-solid" color="primary"
                                     class="-me-2.5 rounded-none rounded-r-md" type="submit" />
                        </template>
                    </UInput>
                </form>
                <div class="flex flex-col gap-2 md:flex-row">
                    <USelectMenu class="min-w-56" v-model="selectedColumns" :options="columns" multiple
                                 icon="mingcute:columns-3-line" placeholder="Columns">
                        <template #label>
                            <span>Chọn cột</span>
                        </template>
                    </USelectMenu>
                    <USelectMenu v-model.number="pageConfig.pageSize" :options="['5', '6', '7', '8', '9', '10']"
                                 icon="mingcute:rows-3-line" :placeholder="pageConfig.pageSize.toString()">
                    </USelectMenu>
                    <UPagination :max="7" v-model="pageConfig.currentPage" :page-count="pageConfig.pageSize"
                                 :total="pageConfig.totalRecords" :disabled="isTableLoading" />
                </div>
            </div>

            <UTable class="rounded-lg" :columns="selectedColumns" :loading="isTableLoading" :rows="studentList"
                    sort-mode="manual"
                    v-model:sort="sort">
                <template #profile.fullname-data="{ row }">
                    <div class="flex flex-col">
                        <NuxtLink class="font-semibold" :to="`/student/${row.studentId}`"
                                  target="_blank">
                            {{ row.profile.fullname }}
                        </NuxtLink>
                        <div>
                            <UBadge class="mt-1" color="primary" variant="subtle">
                                {{ row.studentId }}
                            </UBadge>
                        </div>
                    </div>
                </template>

                <template #dob-data="{ row }">
                    <div class="font-medium">
                        {{ row.dob }}
                    </div>
                    <UBadge class="mt-1 w-10 justify-center" color="gray" variant="subtle">
                        {{ row.profile.isMale ? "Nam" : "Nữ" }}
                    </UBadge>
                </template>

                <template #profile.email-data="{ row }">
                    <div class="font-medium">
                        {{ row.profile.email }}
                    </div>
                </template>

                <template #major.name-data="{ row }">
                    <div class="font-medium">
                        {{ row.major.name }}
                    </div>
                    <UBadge class="mt-1 justify-center" color="gray" variant="subtle">
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
        </UCard>
    </div>

    <UModal v-model="inputModel.isOpen" prevent-close>
        <form @submit.prevent="handleImportStudents">
            <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                            Nhập dữ liệu từ file Excel
                        </h3>
                        <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                                 @click="inputModel.isOpen = false" />
                    </div>
                </template>

                <div class="flex flex-col justify-center">
                    <UInput required type="file" size="sm" icon="i-heroicons-folder" accept=".xlsx"
                            @change="handleInputExcelFile" />
                </div>

                <template #footer>
                    <UButton :loading="inputModel.isSendingRequest" color="primary" class="w-full rounded-md" size="lg"
                             block
                             type="submit">
                        Nhập dữ liệu
                    </UButton>
                </template>
            </UCard>
        </form>
    </UModal>

    <UModal v-model="changePasswordModal.isOpen" prevent-close>
        <form @submit.prevent="handleChangePassword">
            <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="text-base font-semibold">
                            Đổi mật khẩu
                        </div>
                        <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                                 @click="changePasswordModal.isOpen = false" />
                    </div>
                </template>
                <div class="space-y-4">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Mật khẩu mới</div>
                        <UInput required size="lg" v-model="changePasswordModal.newPassword" type="password"
                                icon="mingcute:mail-line" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Xác nhận mật khẩu</div>
                        <UInput required size="lg" v-model="changePasswordModal.confirmPassword" type="password"
                                icon="mingcute:mail-line" />
                    </div>
                </div>
                <template #footer>
                    <UButton :loading="changePasswordModal.isSubmitting" class="w-full rounded-md" size="lg"
                             color="primary"
                             type="submit"
                             block>
                        Đổi mật khẩu
                    </UButton>
                </template>
            </UCard>
        </form>
    </UModal>

    <AdminChangePassword @hideModal="adminChangePasswordModal.isOpen = false"
                         :profileId="adminChangePasswordModal.profileId" :isOpen="adminChangePasswordModal.isOpen" />
</template>
