<script setup lang="ts">
import BusinessStatus from '~/types/enums/BusinessStatus';
import { PageConfig } from '~/types/page_config/PageConfig';
import type StudentRecruitmentRequest from '~/types/student/StudentRecruitmentRequest';

definePageMeta({
    layout: "student",
    middleware: "student",
});

const isDataLoading = ref(true);
const { $apiToken } = useNuxtApp();
const studentRepository = StudentRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const pageConfig = reactive(new PageConfig());
const studentRecruitmentRequests = ref<StudentRecruitmentRequest[]>([]);

// * Lifecycle
onBeforeMount(async () => {
    await fetchStudentRecruitmentsRequest();
})

// * Functions
const fetchStudentRecruitmentsRequest = async () => {
    isDataLoading.value = true;
    const apiResponse = await studentRepository.getAllStudentRecruitmentsRequestPaging(pageConfig);

    if (apiResponse.code != 200) {
        nuxtToast({
            description: apiResponse.message,
            type: "error",
        })
        return;
    }

    pageConfig.update(apiResponse.result.pageConfig)
    studentRecruitmentRequests.value = apiResponse.result.data;

    isDataLoading.value = false;
}

// * Watch
watch(
    () => pageConfig.currentPage,
    async (currentPage) => {
        await fetchStudentRecruitmentsRequest();
    }
)

// * Data
const columns = [
    {
        key: 'recruitment.title',
        label: 'Công việc'
    },
    {
        key: 'businessStatus',
        label: 'Trạng thái'
    },
    {
        key: 'messageToBusiness',
        label: 'Tin nhắn tới doanh nghiệp'
    },
    {
        key: 'actions'
    }
]

const items = (row: any) => [
    [
        {
            label: 'Chi tiết công việc',
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
            icon: 'i-heroicons-trash-20-solid',
            click: nuxtToast,
        }
    ]
]

const statusBadge = (businessStatus: string) => {
    if (businessStatus == BusinessStatus.PENDING)
        return "gray";
    if (businessStatus == BusinessStatus.REJECT)
        return "red";
    if (businessStatus == BusinessStatus.APPROVED)
        return "teal";
    if (businessStatus == BusinessStatus.COMPLETED)
        return "green";

    return "gray"
};
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="text-center text-2xl font-semibold">Danh sách yêu cầu thực tập</div>
        
        <UTable class="rounded-lg border border-gray-100 dark:border-gray-700" :columns="columns"
                :loading="isDataLoading" :rows="studentRecruitmentRequests">
            <template #recruitment.title-data="{ row }">
                <NuxtLink class="font-semibold" :to="`/recruitment/${row.recruitment.recruitmentId}`" target="_blank">
                    {{ row.recruitment.title }}
                </NuxtLink>
            </template>

            <template #businessStatus-data="{ row }">
                <UBadge class="w-20 justify-center" :color="statusBadge(row.businessStatus)" variant="outline">
                    {{ row.businessStatus }}
                </UBadge>
            </template>

            <template #actions-data="{ row }">
                <UDropdown :items="items(row)">
                    <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                </UDropdown>
            </template>
        </UTable>

        <div class="flex justify-between">
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
</template>