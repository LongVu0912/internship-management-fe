<script setup lang="ts">
import { Filter } from '~/types/page_config/Filter';
import { Order } from '~/types/page_config/Order';
import { PageConfig } from '~/types/page_config/PageConfig';
import type StudentRequestRecruitment from '~/types/student/StudentRequestRecruitment';

definePageMeta({
    layout: "student",
    middleware: "student",
});

const { $apiToken } = useNuxtApp();
const studentRepository = StudentRepository($apiToken);
const nuxtToast = useNuxtToast();
const appUtils = AppUtils();

// * Refs
const isTableLoading = ref(true);
const messageModal = ref({
    isOpen: false,
    message: '',
})
const pageConfig = reactive(new PageConfig());
pageConfig.orders.push(new Order("recruitment.title"));
pageConfig.filters.push(new Filter("recruitment.title"));
const studentRequestRecruitmentList = ref<StudentRequestRecruitment[]>([]);

const sort = ref<any>({
    column: 'recruitment.title',
    direction: 'desc'
})

// * Lifecycle
onBeforeMount(async () => {
    await fetchTableData();
})

// * Functions
const fetchTableData = async () => {

    isTableLoading.value = true;
    const apiResponse = await studentRepository.getAllStudentRecruitmentsRequestPaging(pageConfig);
    if (apiResponse.code === 200) {
        pageConfig.update(apiResponse.result.pageConfig)

        studentRequestRecruitmentList.value = apiResponse.result.data;

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

const openMessageModal = (message: string) => {
    messageModal.value.message = message;
    messageModal.value.isOpen = true;
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
        key: 'recruitment.title',
        label: 'Thực tập',
        sortable: true,
    },
    {
        key: 'businessStatus',
        label: 'Trạng thái',
        sortable: true,
    },
    {
        key: 'messageToBusiness',
        label: 'Tin nhắn tới doanh nghiệp',
        sortable: true,
    },
    {
        key: 'actions',
        label: 'Hành động'
    }
]

const selectedColumns = ref([...columns]);

const items = (row: any) => [
    [
        {
            label: 'Chi tiết tuyển dụng',
            icon: 'mingcute:profile-line',
            click: () => {
                navigateTo(`/recruitment/${row.recruitment.recruitmentId}`, {
                    open: {
                        target: '_blank',
                    }
                })
            }
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
            <UButton icon="mingcute:add-circle-line" to="/recruitment" target="_blank" color="primary"
                     label="Tìm thực tập" />
        </div>

        <UCard class="w-full" :ui="{
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
            footer: { padding: 'p-4' }
        }">

            <template #header>
                <h1 class="text-center text-xl font-semibold text-gray-900 dark:text-white">
                    Danh sách đăng ký thực tập
                </h1>
            </template>

            <div class="flex flex-col justify-between gap-2 px-4 py-3 md:flex-row">
                <form @submit.prevent="searchTable">
                    <UInput placeholder="Tìm tên thực tập..." class="min-w-64" size="sm" color="white"
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

            <UTable class="rounded-lg" :columns="selectedColumns" :loading="isTableLoading"
                    :rows="studentRequestRecruitmentList"
                    sort-mode="manual" v-model:sort="sort">

                <template #recruitment.title-data="{ row }">
                    <NuxtLink class="font-semibold" :to="`/recruitment/${row.recruitment.recruitmentId}`"
                              target="_blank">
                        {{ row.recruitment.title }}
                    </NuxtLink>
                </template>

                <template #businessStatus-data="{ row }">
                    <UBadge class="w-20 justify-center" :color="appUtils.statusBadge(row.businessStatus)"
                            variant="subtle">
                        {{ appUtils.convertStatus(row.businessStatus) }}
                    </UBadge>
                </template>

                <template #messageToBusiness-data="{ row }">
                    <div @click="openMessageModal(row.messageToBusiness)" class="cursor-pointer">
                        {{ row.messageToBusiness.substring(0, 20) + '...' }}
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

    <UModal v-model="messageModal.isOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-base font-semibold">
                        Tin nhắn
                    </div>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="messageModal.isOpen = false" />
                </div>
            </template>

            <div class="py-2">
                {{ messageModal.message }}
            </div>
        </UCard>
    </UModal>
</template>