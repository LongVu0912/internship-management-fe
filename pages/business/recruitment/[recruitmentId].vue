<script setup lang="ts">
import BusinessStatus from '~/types/enums/BusinessStatus';
import { Filter } from '~/types/page_config/Filter';
import { Order } from '~/types/page_config/Order';
import { PageConfig } from '~/types/page_config/PageConfig';
import type StudentRequestRecruitment from '~/types/student/StudentRequestRecruitment';

definePageMeta({
    layout: "business",
    middleware: "business",
});

// * Imports
const { $apiToken } = useNuxtApp();
const recruitmentRepository = RecruitmentRepository($apiToken);
const appUtils = AppUtils();
const nuxtToast = useNuxtToast();
const route = useRoute();

// * Refs
const isTableLoading = ref(true);
const messageModal = ref({
    isOpen: false,
    message: '',
})

const sort = ref<any>({
    column: 'student.profile.fullname',
    direction: 'desc'
})

const pageConfig = reactive(new PageConfig());
pageConfig.orders.push(new Order("student.profile.fullname"));
pageConfig.filters.push(new Filter("student.profile.fullname"));
const studentRequestRecruitmentList = ref<StudentRequestRecruitment[]>([]);

// * Lifecycle
onBeforeMount(async () => {
    await fetchTableData();
});

// * Functions
const fetchTableData = async () => {
    isTableLoading.value = true;

    const apiResponse = await recruitmentRepository.getAllRecruitmentRequestOfRecruitmentPaging({
        pageConfig: pageConfig,
        recruitmentId: route.params.recruitmentId.toString(),
    });

    if (apiResponse.code === 200) {
        studentRequestRecruitmentList.value = apiResponse.result.data;

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

const openMessageModal = (message: string) => {
    messageModal.value.message = message;
    messageModal.value.isOpen = true;
}

const approveStudentRequest = async (recruitmentRequestId: string) => {
    const apiResponse = await recruitmentRepository.setRecruitmentRequestStatus({
        recruitmentRequestId: recruitmentRequestId,
        status: BusinessStatus.APPROVED,
    })

    if (apiResponse.code != 200 || apiResponse.result == false) {
        nuxtToast({
            description: apiResponse.message,
            type: "error",
        })
    }
    else {
        nuxtToast({
            description: "Đồng ý thành công",
            type: 'success',
        });
        fetchTableData();
    }
}

const rejectStudentRequest = async (recruitmentRequestId: string) => {
    const apiResponse = await recruitmentRepository.setRecruitmentRequestStatus({
        recruitmentRequestId: recruitmentRequestId,
        status: BusinessStatus.REJECT,
    })

    if (apiResponse.code != 200 || apiResponse.result == false) {
        nuxtToast({
            description: apiResponse.message,
            type: "error",
        })
    }
    else {
        nuxtToast({
            description: "Từ chối thành công",
            type: 'success',
        });
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
        key: 'student.profile.fullname',
        label: 'Tên',
        sortable: true
    },
    {
        key: 'businessStatus',
        label: 'Trạng thái',
        sortable: true
    },
    {
        key: 'messageToBusiness',
        label: 'Tin nhắn',
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
            label: 'Đồng ý',
            icon: 'mingcute:check-fill',
            click: () => approveStudentRequest(row.recruitmentRequestId)
        },
        {
            label: 'Từ chối',
            icon: 'mingcute:close-fill',
            click: () => rejectStudentRequest(row.recruitmentRequestId)
        },
    ]
]
const selectedColumns = ref([...columns]);
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="flex justify-end">
            <UButton icon="mingcute:back-line" color="primary" @click="useRouter().back" label="Quay lại" />
        </div>

        <UCard class="w-full" :ui="{
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
            footer: { padding: 'p-4' }
        }">

            <template #header>
                <h1 class="text-center text-xl font-semibold text-gray-900 dark:text-white">
                    Danh sách ứng tuyển
                </h1>
            </template>

            <div class="flex flex-col justify-between gap-2 px-4 py-3 md:flex-row">
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
                                 :total="pageConfig.totalRecords" />
                </div>
            </div>

            <UTable class="rounded-lg" :columns="selectedColumns" :loading="isTableLoading"
                    :rows="studentRequestRecruitmentList"
                    sort-mode="manual" v-model:sort="sort">
                <template #student.profile.fullname-data="{ row }">
                    <NuxtLink class="font-semibold" :to="`/student/${row.student.studentId}`"
                              target="_blank">
                        {{ row.student.profile.fullname }}
                    </NuxtLink>
                </template>

                <template #businessStatus-data="{ row }">
                    <UBadge class="w-20 justify-center" :color="appUtils.statusBadge(row.businessStatus)"
                            variant="outline">
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