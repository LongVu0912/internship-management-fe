<script setup lang="ts">
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
const isPageLoading = ref(true);
const isDataLoading = ref(true);
const isCreatingRecruitment = ref(false);
const recruitment = ref<Recruitment>({} as Recruitment);
const recruitmentList = ref<Recruitment[]>({} as Recruitment[]);

const pageConfig = reactive(new PageConfig());

// * Lifecycle
onBeforeMount(async () => {
    isPageLoading.value = false;
    await fetchData();
});

// * Functions
const fetchData = async () => {
    isDataLoading.value = true;

    const apiResponse = await recruitmentRepository.getAllBusinessRecruitmentPaging({
        pageConfig: pageConfig,
    });

    if (apiResponse.code !== 200) {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
        return;
    }

    recruitmentList.value = apiResponse.result.data;
    pageConfig.update(apiResponse.result.pageConfig);

    isDataLoading.value = false;
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
    isCreatingRecruitment.value = false
}

// * Watches
watch(
    [() => pageConfig.currentPage, () => pageConfig.pageSize],
    async ([newCurrentPage, newPageSize], [oldCurrentPage, oldPageSize]) => {
        if (newPageSize !== oldPageSize) {
            pageConfig.currentPage = 1;
        }
        await fetchData();
    }
)

// * Data
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
        key: 'title',
        label: 'Tên'
    },
    {
        key: 'type',
        label: 'Loại'
    },
    {
        key: 'workingDay',
        label: 'Ngày làm việc'
    },
    {
        key: 'workingHour',
        label: 'Giờ làm việc'
    },
    {
        key: 'actions'
    }
]
</script>

<template>
    <div v-if="isPageLoading">
        <Loading />
    </div>
    <div v-else>
        <div v-if="!isCreatingRecruitment" class="flex flex-col gap-2">
            <div class="flex flex-col justify-between gap-2 md:flex-row">
                <div class="flex flex-col gap-2 md:flex-row">
                </div>
                <div>
                    <UButton color="primary" @click="isCreatingRecruitment = true">Tạo tuyển dụng</UButton>
                </div>
            </div>

            <UTable :loading="isDataLoading" class="rounded-lg border border-gray-100 dark:border-gray-700"
                    :columns="columns"
                    :rows="recruitmentList">
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

                    <div>
                        <div class="font-medium">Tựa đề</div>
                        <UInput v-model="recruitment.title" />
                    </div>

                    <div>
                        <div class="font-medium">Mô tả</div>
                        <UTextarea size="lg" color="gray" :rows="3" class="w-full" v-model="recruitment.description">
                        </UTextarea>
                    </div>

                    <div class="flex flex-col gap-4 md:flex-row">
                        <div class="w-full">
                            <div class="font-medium">Địa điểm</div>
                            <UInput v-model="recruitment.location" />
                        </div>
                        <div class="w-full">
                            <div class="font-medium">Loại</div>
                            <UInput v-model="recruitment.type" />
                        </div>
                    </div>

                    <div class="flex flex-col gap-4 md:flex-row">
                        <div class="w-full">
                            <div class="font-medium">Ngày làm việc</div>
                            <UInput v-model="recruitment.workingDay" />
                        </div>
                        <div class="w-full">
                            <div class="font-medium">Giờ làm việc</div>
                            <UInput v-model="recruitment.workingHour" />
                        </div>
                    </div>

                    <div class="flex flex-col gap-4 md:flex-row">
                        <div class="w-full">
                            <div class="font-medium">Kỹ năng</div>
                            <UInput v-model="recruitment.keySkills" />
                        </div>
                        <div class="w-full">
                            <div class="font-medium">Vị trí</div>
                            <UInput v-model="recruitment.position" />
                        </div>
                    </div>
                </div>

                <template #footer>
                    <div class="flex justify-end">
                        <UButton class="mr-2" color="gray" variant="ghost" @click="isCreatingRecruitment = false">
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