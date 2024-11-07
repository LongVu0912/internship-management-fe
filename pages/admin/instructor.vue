<script setup lang="ts">
import type Instructor from '~/types/instructor/Instructor';
import { Filter } from '~/types/page_config/Filter';
import { Order } from '~/types/page_config/Order';
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
const isTableLoading = ref(false);

const sort = ref<any>({
    column: 'profile.fullname',
    direction: 'desc'
})

const pageConfig = reactive(new PageConfig());
pageConfig.orders.push(new Order("profile.fullname"));
pageConfig.filters.push(new Filter("profile.fullname"));
const instructorList = ref<Instructor[]>([]);

// * Lifecycle
onBeforeMount(async () => {
    await fetchTableData();
});

// * Functions
const fetchTableData = async () => {
    isTableLoading.value = true;

    const apiResponse = await instructorRepository.getInstructorPaging(pageConfig);

    if (apiResponse.code === 200) {
        instructorList.value = apiResponse.result.data;

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
const items = (row: any) => [
    [
        {
            label: 'Chi tiết',
            icon: 'mingcute:profile-line',
            click: nuxtToast,
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

const columns = [
    {
        key: 'profile.fullname',
        label: 'Họ tên',
        sortable: true,
    },
    {
        key: 'profile.email',
        label: 'Email',
        sortable: true,
    },
    {
        key: 'profile.phoneNumber',
        label: 'Số điện thoại',
        sortable: true,
    },
    {
        key: 'actions',
        label: "Hành động"
    }
]

const selectedColumns = ref([...columns]);
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="flex justify-end">
            <UButton @click="nuxtToast" color="primary" label="Thêm giảng viên" />
        </div>
        <UCard class="w-full" :ui="{
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
            footer: { padding: 'p-4' }
        }">

            <template #header>
                <h1 class="text-center text-xl font-semibold text-gray-900 dark:text-white">
                    Danh sách giảng viên
                </h1>
            </template>

            <div class="flex flex-col justify-between gap-2 px-4 py-3 md:flex-row">
                <form @submit.prevent="searchTable">
                    <UInput placeholder="Tìm tên giảng viên..." class="min-w-64" size="sm" color="white"
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

            <UTable class="rounded-lg" :columns="selectedColumns" :loading="isTableLoading" :rows="instructorList"
                    sort-mode="manual" v-model:sort="sort">

                <template #profile.fullname-data="{ row }">
                    <div class="font-medium">
                        {{ row.profile.fullname }}
                    </div>
                    <UBadge class="mt-1 w-10 justify-center" color="gray" variant="outline">
                        {{ row.profile.isMale ? "Nam" : "Nữ" }}
                    </UBadge>
                </template>

                <template #profile.email-data="{ row }">
                    <div class="font-medium">
                        {{ row.profile.email }}
                    </div>
                    <UBadge class="mt-1 w-10 justify-center" color="gray" variant="outline">
                        {{ row.faculty.facultyId }}
                    </UBadge>
                </template>

                <template #profile.phoneNumber-data="{ row }">
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
        </UCard>
    </div>
</template>