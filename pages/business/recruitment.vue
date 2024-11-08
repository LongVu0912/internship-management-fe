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
const createRecruitment = ref({
    isOpen: false,
})

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
    const apiResponse = await recruitmentRepository.createRecruitment(recruitment.value);

    if (apiResponse.code !== 200) {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
        return;
    }

    nuxtToast({
        description: 'Tạo tin tuyển dụng thành công',
        type: 'success',
    });
    createRecruitment.value.isOpen = false
}

const searchTable = async () => {
    if (pageConfig.currentPage !== 1) {
        pageConfig.currentPage = 1;
    } else {
        fetchTableData();
    }
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
            label: 'Danh sách sinh viên',
            icon: 'mingcute:group-line',
            click: nuxtToast
        },
    ],
    [
        {
            label: 'Sửa',
            icon: 'mingcute:edit-4-line',
            click: nuxtToast,
        },
        {
            label: 'Dừng tuyển dụng',
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
const selectedColumns = ref([...columns]);
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="flex justify-end">
            <UButton color="primary" @click="createRecruitment.isOpen = true" label="Thêm tuyển dụng" />
        </div>

        <UCard v-if="!createRecruitment.isOpen" class="w-full" :ui="{
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
                                 :total="pageConfig.totalRecords" />
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
            </UTable>
        </UCard>

        <div v-else>
            <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                            Tạo tin tuyển dụng
                        </div>
                    </div>
                </template>

                <div class="flex flex-col gap-3">
                    <div class="text-base font-semibold">THÔNG TIN TUYỂN DỤNG</div>

                    <div class="space-y-2">
                        <div class="font-medium">Tựa đề</div>
                        <UInput v-model="recruitment.title" />
                    </div>

                    <div class="space-y-2">
                        <div class="font-medium">Mô tả</div>
                        <UTextarea size="lg" color="gray" :rows="3" class="w-full" v-model="recruitment.description">
                        </UTextarea>
                    </div>

                    <div class="flex flex-col gap-4 md:flex-row">
                        <div class="w-full space-y-2">
                            <div class="font-medium">Địa điểm</div>
                            <UInput v-model="recruitment.location" />
                        </div>
                        <div class="w-full space-y-2">
                            <div class="font-medium">Loại</div>
                            <UInput v-model="recruitment.type" />
                        </div>
                    </div>

                    <div class="flex flex-col gap-4 md:flex-row">
                        <div class="w-full space-y-2">
                            <div class="font-medium">Ngày làm việc</div>
                            <UInput v-model="recruitment.workingDay" />
                        </div>
                        <div class="w-full space-y-2">
                            <div class="font-medium">Giờ làm việc</div>
                            <UInput v-model="recruitment.workingHour" />
                        </div>
                    </div>

                    <div class="flex flex-col gap-4 md:flex-row">
                        <div class="w-full space-y-2">
                            <div class="font-medium">Kỹ năng</div>
                            <UInput v-model="recruitment.keySkills" />
                        </div>
                        <div class="w-full space-y-2">
                            <div class="font-medium">Vị trí</div>
                            <UInput v-model="recruitment.position" />
                        </div>
                    </div>
                </div>

                <template #footer>
                    <div class="flex justify-end">
                        <UButton class="mr-2" color="gray" variant="ghost" @click="createRecruitment.isOpen = false">
                            Huỷ
                        </UButton>
                        <UButton color="primary" @click="handleCreateRecruitment">
                            Tạo
                        </UButton>
                    </div>
                </template>
            </UCard>
        </div>
    </div>
</template>