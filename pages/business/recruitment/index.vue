<script setup lang="ts">
import { Filter } from '~/types/page_config/Filter';
import { Order } from '~/types/page_config/Order';
import { PageConfig } from '~/types/page_config/PageConfig';
import type Recruitment from '~/types/recruitment/Recruitment';

definePageMeta({
    layout: "business",
    middleware: "business",
});

// * Imports
const { $apiToken } = useNuxtApp();
const recruitmentRepository = RecruitmentRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const isTableLoading = ref(true);
const createRecruitmentModal = ref({
    isOpen: false,
    isCreatingRecruitment: false,
})

const updateRecruitmentModal = ref({
    isOpen: false,
    isUpdatingRecruitment: false,
    recruitment: {} as Recruitment
})

const status = computed({
    get: () => (updateRecruitmentModal.value.recruitment.status == "OPEN" ? 'Mở' : 'Đóng'),
    set: (value: string) => {
        updateRecruitmentModal.value.recruitment.status = (value == 'Mở') ? "OPEN" : "CLOSED";
    }
});

const recruitment = ref<Recruitment>({} as Recruitment);
const sort = ref<any>({
    column: 'title',
    direction: 'desc'
})

const pageConfig = reactive(new PageConfig());
pageConfig.orders.push(new Order("title"));
pageConfig.filters.push(new Filter("title"));
const recruitmentList = ref<Recruitment[]>([]);

// * Lifecycle
onBeforeMount(async () => {
    await fetchTableData();
});

// * Functions
const fetchTableData = async () => {
    isTableLoading.value = true;

    const apiResponse = await recruitmentRepository.getAllBusinessRecruitmentPaging({
        pageConfig: pageConfig
    });

    if (apiResponse.code === 200) {
        recruitmentList.value = apiResponse.result.data;

        pageConfig.update(apiResponse.result.pageConfig);

        isTableLoading.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

const handleCreateRecruitment = async () => {
    createRecruitmentModal.value.isCreatingRecruitment = true;
    const apiResponse = await recruitmentRepository.createRecruitment(recruitment.value);

    if (apiResponse.code !== 200) {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
    else {
        nuxtToast({
            description: 'Tạo tin tuyển dụng thành công',
            type: 'success',
        });

        createRecruitmentModal.value.isOpen = false;
        fetchTableData();
    }

    createRecruitmentModal.value.isCreatingRecruitment = false;
}

const searchTable = async () => {
    if (pageConfig.currentPage !== 1) {
        pageConfig.currentPage = 1;
    } else {
        fetchTableData();
    }
}

const openUpdateRecruitmentModal = async (recruitmentId: string) => {
    const apiResponse = await recruitmentRepository.getRecruitmentById({
        recruitmentId: recruitmentId,
    })

    updateRecruitmentModal.value.recruitment = apiResponse.result;
    updateRecruitmentModal.value.isOpen = true;
}

const handleUpdateRecruitment = async () => {
    updateRecruitmentModal.value.isOpen = true;

    const apiResponse = await recruitmentRepository.updateRecruitment({
        recruitment: updateRecruitmentModal.value.recruitment
    });

    if (apiResponse.code !== 200) {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
    else {
        nuxtToast({
            description: 'Cập nhật thành công',
            type: 'success',
        });

        updateRecruitmentModal.value.isOpen = false;
        fetchTableData();
    }

    updateRecruitmentModal.value.isOpen = false;
}

const closeUpdateModal = async () => {
    await fetchTableData();
    updateRecruitmentModal.value.isOpen = false;
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
        key: 'title',
        label: 'Tên',
        sortable: true
    },
    {
        key: 'type',
        label: 'Loại',
        sortable: true
    },
    {
        key: 'workingDay',
        label: 'Ngày làm việc',
        sortable: true
    },
    {
        key: 'workingHour',
        label: 'Giờ làm việc',
        sortable: true
    },
    {
        key: 'status',
        label: 'Trạng thái',
        sortable: true
    },
    {
        key: 'actions',
        label: 'Hành động'
    }
]

const items = (row: any) => [
    [
        {
            label: 'Chi tiết tuyển dụng',
            icon: 'mingcute:profile-line',
            click: () => {
                navigateTo(`/recruitment/${row.recruitmentId}`, {
                    open: {
                        target: '_blank',
                    }
                })
            }
        },
        {
            label: 'Danh sách ứng tuyển',
            icon: 'mingcute:group-line',
            click: () => {
                navigateTo(`/business/recruitment/${row.recruitmentId}`)
            }
        },
    ],
    [
        {
            label: 'Sửa',
            icon: 'mingcute:edit-4-line',
            click: () => {
                openUpdateRecruitmentModal(row.recruitmentId);
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
const selectedColumns = ref([...columns]);
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="flex justify-end">
            <UButton icon="mingcute:add-circle-line" color="primary" @click="createRecruitmentModal.isOpen = true"
                     label="Thêm tuyển dụng" />
        </div>

        <UCard class="w-full" :ui="{
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
            footer: { padding: 'p-4' }
        }">

            <template #header>
                <h1 class="text-center text-xl font-semibold text-gray-900 dark:text-white">
                    Danh sách bài tuyển dụng
                </h1>
            </template>

            <div class="flex flex-col justify-between gap-2 px-4 py-3 md:flex-row">
                <form @submit.prevent="searchTable">
                    <UInput placeholder="Tìm tên bài tuyển dụng..." class="min-w-64" size="sm" color="white"
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

            <UTable class="rounded-lg" :columns="selectedColumns" :loading="isTableLoading" :rows="recruitmentList"
                    sort-mode="manual" v-model:sort="sort">
                <template #title-data="{ row }">
                    <NuxtLink class="font-semibold" :to="`/recruitment/${row.recruitmentId}`"
                              target="_blank">
                        {{ row.title }}
                    </NuxtLink>
                </template>

                <template #actions-data="{ row }">
                    <UDropdown :items="items(row)">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                    </UDropdown>
                </template>

                <template #status-data="{ row }">
                    <UBadge class="w-14 justify-center"
                            :color="row.status == 'OPEN' ? 'green' : 'red'"
                            size="md"
                            variant="subtle">
                        {{ row.status == 'OPEN' ? 'Mở' : 'Đóng' }}
                    </UBadge>
                </template>
            </UTable>
        </UCard>
    </div>

    <UModal :ui="{ width: 'sm:max-w-3xl' }" v-model="createRecruitmentModal.isOpen" prevent-close>
        <form @submit.prevent="handleCreateRecruitment">
            <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                            Tạo tuyển dụng
                        </h3>
                        <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                                 @click="createRecruitmentModal.isOpen = false" />
                    </div>
                </template>
                <div class="flex flex-col gap-3">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Tựa đề</div>
                        <UInput required v-model="recruitment.title" placeholder="Tuyển dụng lập trình viên" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Mô tả</div>
                        <UTextarea required size="lg" color="gray" :rows="5" class="w-full"
                                   v-model="recruitment.description"
                                   placeholder="Mô tả chi tiết về công việc, yêu cầu và quyền lợi">
                        </UTextarea>
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Kỹ năng</div>
                        <UTextarea required size="lg" color="gray" :rows="5" class="w-full"
                                   v-model="recruitment.keySkills"
                                   placeholder="JavaScript, React, Node.js">
                        </UTextarea>
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Địa điểm</div>
                        <UInput required v-model="recruitment.location" placeholder="Hà Nội, Việt Nam" />
                    </div>
                    <div class="flex flex-col gap-4 md:flex-row">
                        <div class="w-full space-y-1">
                            <div class="font-medium">Loại</div>
                            <UInput required v-model="recruitment.type" placeholder="Toàn thời gian, Bán thời gian" />
                        </div>
                        <div class="w-full space-y-1">
                            <div class="font-medium">Vị trí</div>
                            <UInput required v-model="recruitment.position" placeholder="Lập trình viên Frontend" />
                        </div>
                    </div>
                    <div class="flex flex-col gap-4 md:flex-row">
                        <div class="w-full space-y-1">
                            <div class="font-medium">Ngày làm việc</div>
                            <UInput required v-model="recruitment.workingDay" placeholder="Thứ 2 - Thứ 6" />
                        </div>
                        <div class="w-full space-y-1">
                            <div class="font-medium">Giờ làm việc</div>
                            <UInput required v-model="recruitment.workingHour" placeholder="9:00 - 18:00" />
                        </div>
                    </div>
                </div>
                <template #footer>
                    <div class="flex justify-end">
                        <UButton class="mr-2" color="gray" variant="ghost"
                                 @click="createRecruitmentModal.isOpen = false">
                            Huỷ
                        </UButton>
                        <UButton color="primary" type="submit">
                            Tạo
                        </UButton>
                    </div>
                </template>
            </UCard>
        </form>
    </UModal>

    <UModal :ui="{ width: 'sm:max-w-3xl' }" v-model="updateRecruitmentModal.isOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Cập nhật tuyển dụng
                    </h3>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="updateRecruitmentModal.isOpen = false" />
                </div>
            </template>

            <div class="flex flex-col gap-3">
                <div class="w-full space-y-1">
                    <div class="font-medium">Tựa đề</div>
                    <UInput v-model="updateRecruitmentModal.recruitment.title"
                            placeholder="Tuyển dụng lập trình viên" />
                </div>

                <div class="w-full space-y-1">
                    <div class="font-medium">Trạng thái</div>
                    <USelect size="md" color="gray" v-model="status" :options="['Mở', 'Đóng']" />
                </div>

                <div class="w-full space-y-1">
                    <div class="font-medium">Mô tả</div>
                    <UTextarea size="lg" color="gray" :rows="5" class="w-full"
                               v-model="updateRecruitmentModal.recruitment.description"
                               placeholder="Mô tả chi tiết về công việc, yêu cầu và quyền lợi">
                    </UTextarea>
                </div>

                <div class="w-full space-y-1">
                    <div class="font-medium">Kỹ năng</div>
                    <UTextarea size="lg" color="gray" :rows="5" class="w-full"
                               v-model="updateRecruitmentModal.recruitment.keySkills"
                               placeholder="JavaScript, React, Node.js">
                    </UTextarea>
                </div>

                <div class="w-full space-y-1">
                    <div class="font-medium">Địa điểm</div>
                    <UInput v-model="updateRecruitmentModal.recruitment.location" placeholder="Hà Nội, Việt Nam" />
                </div>

                <div class="flex flex-col gap-4 md:flex-row">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Loại</div>
                        <UInput v-model="updateRecruitmentModal.recruitment.type"
                                placeholder="Toàn thời gian, Bán thời gian" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Vị trí</div>
                        <UInput v-model="updateRecruitmentModal.recruitment.position"
                                placeholder="Lập trình viên Frontend" />
                    </div>
                </div>

                <div class="flex flex-col gap-4 md:flex-row">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Ngày làm việc</div>
                        <UInput v-model="updateRecruitmentModal.recruitment.workingDay" placeholder="Thứ 2 - Thứ 6" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Giờ làm việc</div>
                        <UInput v-model="updateRecruitmentModal.recruitment.workingHour" placeholder="9:00 - 18:00" />
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end">
                    <UButton class="mr-2" color="gray" variant="ghost" @click="closeUpdateModal">
                        Huỷ
                    </UButton>
                    <UButton color="primary" @click="handleUpdateRecruitment"
                             :loading="updateRecruitmentModal.isUpdatingRecruitment">
                        Cập nhật
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>