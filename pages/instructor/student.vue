<script setup lang="ts">
import InstructorStatus from '~/types/enums/InstructorStatus';
import { Order } from '~/types/page_config/Order';
import { PageConfig } from '~/types/page_config/PageConfig';
import type InstructorRequest from '~/types/request/InstructorRequest';

definePageMeta({
    layout: 'instructor',
    middleware: 'instructor',
})

// * Imports
const { $apiToken } = useNuxtApp();
const instructorRepository = InstructorRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const isDataLoading = ref(true);
const pageConfig = reactive(new PageConfig());
const order = ref(new Order("instructorStatus"));
pageConfig.orders.push(order.value);
const instructorRequests = ref<InstructorRequest[]>([]);

// * Lifecycle
onBeforeMount(async () => {
    fetchData();
})

// * Functions
const fetchData = async () => {
    isDataLoading.value = true;

    const apiResponse = await instructorRepository.getAllInstructorRequestOfInstructorPaging({
        pageConfig: pageConfig,
    });

    if (apiResponse.code === 200) {
        instructorRequests.value = apiResponse.result.data;

        pageConfig.update(apiResponse.result.pageConfig);

        isDataLoading.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

const approveRequest = async (instructorRequestId: string) => {
    const apiResponse = await instructorRepository.setRequestStatus({
        instructorRequestId: instructorRequestId,
        status: InstructorStatus.APPROVED,
    })

    if (apiResponse.code !== 200) {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
        return;
    }

    if (apiResponse.result == false) {
        nuxtToast({
            description: apiResponse.message,
            type: 'info',
        });
        return;
    }

    nuxtToast({
        description: "Đồng ý thành công",
        type: 'success',
    });

    fetchData();
}

const rejectRequest = async (instructorRequestId: string) => {
    const apiResponse = await instructorRepository.setRequestStatus({
        instructorRequestId: instructorRequestId,
        status: InstructorStatus.REJECT,
    })

    if (apiResponse.code !== 200) {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
        return;
    }

    if (apiResponse.result == false) {
        nuxtToast({
            description: apiResponse.message,
            type: 'info',
        });
        return;
    }

    nuxtToast({
        description: "Đồng ý thành công",
        type: 'success',
    });

    fetchData();
}

// * Data
const items = (row: any) => [
    [
        {
            label: 'Hồ sơ sinh viên',
            icon: 'mingcute:profile-line',
            click: () => {
                navigateTo(`/student/${row.student.studentId}`, {
                    open: {
                        target: '_blank',
                    }
                })
            }
        },
    ],
    [
        {
            label: 'Đồng ý',
            icon: 'mingcute:check-line',
            click: () => {
                approveRequest(row.instructorRequestId)
            },
        },
        {
            label: 'Từ chối',
            icon: 'mingcute:close-line',
            click: () => {
                rejectRequest(row.instructorRequestId)
            },
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

const columns = [
    {
        key: 'name',
        label: 'Tên',
        rowClass: 'whitespace-nowrap'
    },
    {
        key: 'recruitment',
        label: 'Thực tập',
        rowClass: 'min-w-32'
    },
    {
        key: 'instructorStatus',
        label: 'Trạng thái'
    },
    {
        key: 'messageToInstructor',
        label: 'Tin nhắn',
        rowClass: 'break-all max-w-96'
    },
    {
        key: 'actions'
    }
]

const statusBadge = (instructorStatus: string) => {
    if (instructorStatus == InstructorStatus.PENDING)
        return "gray";
    if (instructorStatus == InstructorStatus.REJECT)
        return "red";
    if (instructorStatus == InstructorStatus.APPROVED)
        return "teal";
    if (instructorStatus == InstructorStatus.COMPLETED)
        return "green";

    return "gray"
};
</script>

<template>
    <div class="flex flex-col gap-2">
        <UTable :loading="isDataLoading" class="rounded-lg border border-gray-100 dark:border-gray-700"
                :columns="columns"
                :rows="instructorRequests">
            <template #name-data="{ row }">
                <UTooltip text="Hồ sơ sinh viên">
                    <div class="flex flex-col">
                        <NuxtLink class="font-semibold"
                                  :to="`/student/${row.student.studentId}`"
                                  target="_blank">
                            {{ row.student.profile.fullname }}
                        </NuxtLink>
                        <div>
                            <UBadge class="mt-1" color="primary" variant="outline">
                                {{ row.student.studentId }}
                            </UBadge>
                        </div>
                    </div>
                </UTooltip>
            </template>

            <template #major-data="{ row }">
                <div class="font-medium">
                    {{ row.student.major.name }}
                </div>
                <UBadge class="mt-1 justify-center" color="gray" variant="outline">
                    {{ row.student.major.faculty.name }}
                </UBadge>
            </template>

            <template #recruitment-data="{ row }">
                <UTooltip text="Công việc thực tập">
                    <NuxtLink v-if="row.recruitmentId != null" class="font-semibold"
                              :to="`/recruitment/${row.recruitmentId}`"
                              target="_blank">
                        {{ row.recruitmentTitle }}
                    </NuxtLink>
                    <div v-else class="font-semibold">
                        Chưa có
                    </div>
                </UTooltip>
            </template>

            <template #instructorStatus-data="{ row }">
                <UBadge class="w-20 justify-center" :color="statusBadge(row.instructorStatus)" variant="outline">
                    {{ row.instructorStatus }}
                </UBadge>
            </template>

            <template #actions-data="{ row }">
                <UDropdown :items="items(row)">
                    <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                </UDropdown>
            </template>
        </UTable>

        <div class="flex justify-end">
            <div class="flex flex-row items-center gap-2">
                <USelect v-model.number="pageConfig.pageSize" :options="[5, 6, 7, 8, 9, 10]" />
                <UPagination :max="7" v-model="pageConfig.currentPage" :page-count="pageConfig.pageSize"
                             :total="pageConfig.totalRecords" />
            </div>
        </div>
    </div>
</template>