<script setup lang="ts">
import type Faculty from '~/types/faculty/Faculty';
import type Major from '~/types/major/Major';
import { Filter } from '~/types/page_config/Filter';
import { Order } from '~/types/page_config/Order';
import { PageConfig } from '~/types/page_config/PageConfig';

definePageMeta({
    layout: 'admin',
    middleware: 'admin',
})

// * Imports
const { $apiToken } = useNuxtApp();
const facultyRepository = FacultyRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const isTableLoading = ref(true);
const majorModal = ref({
    isOpen: false,
    isSavingMajor: false,
    isCreatingMajor: false,
    currentFacultyId: '',
    newMajor: {} as Major,
});

const saveFacultyModal = ref({
    isOpen: false,
    isCreateMode: true,
    isSavingFaculty: false,
    faculty: {} as Faculty
})

const sort = ref<any>({
    column: 'facultyId',
    direction: 'desc'
})

const pageConfig = reactive(new PageConfig());
pageConfig.orders.push(new Order("name"));
pageConfig.filters.push(new Filter("name"));

const facultyList = ref<Faculty[]>();
const majorList = ref<Major[]>();

// * Lifecycle
onBeforeMount(async () => {
    await fetchTableData();
});

// * Functions
const fetchTableData = async () => {
    isTableLoading.value = true;

    const apiResponse = await facultyRepository.getFacultyPaging(pageConfig);

    if (apiResponse.code === 200) {
        facultyList.value = apiResponse.result.data;

        pageConfig.update(apiResponse.result.pageConfig);

        isTableLoading.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

const searchTable = async () => {
    if (pageConfig.currentPage !== 1) {
        pageConfig.currentPage = 1;
    } else {
        fetchTableData();
    }
}

const openMajorModal = async (facultyId: string) => {
    majorModal.value.currentFacultyId = facultyId;
    const apiResponse = await facultyRepository.getMajorsByFacultyId({
        facultyId: facultyId
    });

    if (apiResponse.code === 200) {
        majorList.value = apiResponse.result;
        majorModal.value.isOpen = true;
    }
    else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

const openSaveFacultyModal = (isCreateMode: boolean) => {
    saveFacultyModal.value.isCreateMode = isCreateMode;
    saveFacultyModal.value.isOpen = true;
}

const handleSaveFaculty = async () => {
    saveFacultyModal.value.isSavingFaculty = true;

    const apiResponse = await facultyRepository.saveFaculty(saveFacultyModal.value.faculty);

    if (apiResponse.code !== 200) {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
    else {
        nuxtToast({
            description: "Lưu khoa thành công",
            type: "success",
        });
        saveFacultyModal.value.isOpen = false;
    }

    fetchTableData();
    saveFacultyModal.value.isSavingFaculty = false;
}

const handleEditMajor = async (index: any) => {
    majorModal.value.isSavingMajor = true;

    if (majorList.value) {
        const editMajor = majorList.value[index];
        editMajor.facultyId = majorModal.value.currentFacultyId;

        const apiResponse = await facultyRepository.saveMajor(editMajor);

        if (apiResponse.code !== 200) {
            nuxtToast({
                description: apiResponse.message,
                type: 'error',
            });
        }
        else {
            nuxtToast({
                description: "Chỉnh sửa ngành thành công",
                type: "success",
            });
        }

        fetchTableData();
        majorModal.value.isSavingMajor = true;
    } else {
        nuxtToast({
            description: 'Lỗi, hãy thử lại sau',
            type: 'error',
        });
    }
}

const handleCreateMajor = async (index: any) => {
    if (!majorModal.value.isCreatingMajor) {
        majorModal.value.isCreatingMajor = true;
    }
    else {
        majorModal.value.newMajor.majorId = '';
        majorModal.value.newMajor.facultyId = majorModal.value.currentFacultyId;
        const apiResponse = await facultyRepository.saveMajor(majorModal.value.newMajor);

        if (apiResponse.code !== 200) {
            nuxtToast({
                description: apiResponse.message,
                type: 'error',
            });
        }
        else {
            nuxtToast({
                description: "Thêm ngành mới thành công",
                type: "success",
            });
            
            majorModal.value.isCreatingMajor = false;
            majorModal.value.newMajor = {} as Major;
            majorModal.value.isOpen = false;
            fetchTableData();
        }
    }
}

const handleCloseMajorModal = async () => {
    await fetchTableData();
    majorModal.value.isCreatingMajor = false;
    majorModal.value.isOpen = false;
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
        key: 'facultyId',
        label: 'ID',
        sortable: true
    },
    {
        key: 'name',
        label: 'Tên',
        sortable: true
    },
    {
        key: 'actions',
        label: 'Hành động'
    }
]

const selectedColumns = ref([...columns]);

const items = (row: Faculty) => [
    [
        {
            label: 'Danh sách ngành',
            icon: 'mingcute:book-3-line',
            click: () => {
                openMajorModal(row.facultyId);
            },
        },
        {
            label: 'Chỉnh sửa khoa',
            icon: 'mingcute:edit-4-line',
            click: () => {
                saveFacultyModal.value.faculty = row;
                openSaveFacultyModal(false);
            },
        },
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
            <UButton icon="mingcute:add-circle-line" color="primary" @click="openSaveFacultyModal(true)"
                     label="Thêm khoa" />
        </div>

        <UCard class="w-full" :ui="{
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
            footer: { padding: 'p-4' }
        }">

            <template #header>
                <h1 class="text-center text-xl font-semibold text-gray-900 dark:text-white">
                    Danh sách khoa
                </h1>
            </template>

            <div class="flex flex-col justify-between gap-2 px-4 py-3 md:flex-row">
                <form @submit.prevent="searchTable">
                    <UInput placeholder="Tìm tên khoa..." class="min-w-64" size="sm" color="white"
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
                                 :total="pageConfig.totalRecords" />
                </div>
            </div>

            <UTable class="rounded-lg" :columns="selectedColumns" :loading="isTableLoading" :rows="facultyList"
                    sort-mode="manual"
                    v-model:sort="sort">
                <template #facultyId-data="{ row }">
                    <UBadge class="flex w-14 justify-center" size="md" variant="subtle" :label="row.facultyId" />
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
        </UCard>
    </div>

    <UModal v-model="majorModal.isOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Các ngành {{ majorModal.currentFacultyId }}
                    </h3>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="handleCloseMajorModal" />
                </div>
            </template>

            <div class="space-y-2 py-2">
                <div class="flex flex-col gap-2">
                    <div v-for="(major, index) in majorList" class="flex w-full flex-row items-center gap-2">
                        <UInput class="w-full" size="md" color="gray" v-model:model-value="major.name" />
                        <UButton icon="mingcute:save-2-line" color="primary" variant="soft"
                                 @click="handleEditMajor(index)" />
                    </div>
                    <div class="flex w-full flex-row items-center gap-2">
                        <UInput :disabled="!majorModal.isCreatingMajor" class="w-full" size="md" color="gray"
                                v-model="majorModal.newMajor.name" placeholder="Ngành mới..." />
                        <UButton :icon="majorModal.isCreatingMajor ? 'mingcute:save-2-line' : 'mingcute:add-fill'"
                                 color="primary" variant="soft" @click="handleCreateMajor" />
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end">
                    <UButton color="primary" @click="handleCloseMajorModal" label="Hủy" />
                </div>
            </template>
        </UCard>
    </UModal>

    <UModal v-model="saveFacultyModal.isOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        {{ saveFacultyModal.isCreateMode ? 'Thêm khoa' : 'Chỉnh sửa khoa' }}
                    </h3>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="saveFacultyModal.isOpen = false" />
                </div>
            </template>

            <div class="flex flex-col gap-3">
                <div class="w-full space-y-1">
                    <div class="font-medium">Mã khoa</div>
                    <UInput :disabled="!saveFacultyModal.isCreateMode" v-model="saveFacultyModal.faculty.facultyId"
                            placeholder="FIE" />
                </div>
                <div class="w-full space-y-1">
                    <div class="font-medium">Tên khoa</div>
                    <UInput v-model="saveFacultyModal.faculty.name" placeholder="Khoa đào tạo quốc tế" />
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end">
                    <UButton class="mr-2" color="gray" variant="ghost" @click="saveFacultyModal.isOpen = false">
                        Huỷ
                    </UButton>
                    <UButton color="primary"
                             @click="handleSaveFaculty"
                             :loading="saveFacultyModal.isSavingFaculty">
                        Lưu
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>
