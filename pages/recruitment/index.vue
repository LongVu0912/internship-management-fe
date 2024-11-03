<script setup lang="ts">
import { Filter } from '~/types/page_config/Filter';
import { PageConfig } from '~/types/page_config/PageConfig';
import type Recruitment from '~/types/recruitment/Recruitment';

definePageMeta({
    layout: 'home',
})

// * Imports
const { $api } = useNuxtApp();
const recruitmentRepository = RecruitmentRepository($api);
const nuxtToast = useNuxtToast();

// * Refs
const isDataLoading = ref(true);
const titleFilter = ref(new Filter("title"));
const pageConfig = reactive(new PageConfig());
pageConfig.filters.push(titleFilter.value);
const recruitmentPaging = ref<Recruitment[]>();

// * Lifecycle
onBeforeMount(async () => {
    await fetchData();
    isDataLoading.value = false;
})

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

// * Functions
const fetchData = async () => {
    isDataLoading.value = true;
    const apiResponse = await recruitmentRepository.getRecruitmentPaging(pageConfig);

    if (apiResponse.code !== 200) {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
        return;
    }

    pageConfig.update(apiResponse.result.pageConfig);
    recruitmentPaging.value = apiResponse.result.data;

    isDataLoading.value = false;
}

const searchData = async () => {
    if (pageConfig.currentPage !== 1) {
        pageConfig.currentPage = 1;
    } else {
        await fetchData();
    }
}
</script>

<template>
    <div class="flex min-h-screen flex-col items-center p-4 dark:bg-gray-900">
        <div class="flex w-full max-w-5xl flex-col gap-6">
            <div class="flex w-full flex-col gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
                <div>
                    <form @submit.prevent="searchData">
                        <UInput icon="mingcute:search-2-fill" placeholder="Tìm theo tên công ty, tên công việc..."
                                v-model="pageConfig.filters[0].value"
                                class="w-full"
                                color="white"
                                size="sm" :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
                            <template #trailing>
                                <UButton icon="mingcute:search-2-fill" color="primary"
                                         type="submit"
                                         class="-me-2.5 rounded-none rounded-r-md" />
                            </template>
                        </UInput>
                    </form>
                </div>
                <div class="flex flex-row gap-2">
                    <USelect class="w-1/2" icon="mingcute:building-3-line" color="white" size="sm"
                             :options="['Tất cả nhà tuyển dụng', 'FPT Software', 'Viettel Cooperation', 'VNPT', 'VNG']"
                             model-value="Tất cả nhà tuyển dụng" />
                    <USelect class="w-1/2" icon="mingcute:book-3-line" color="white" size="sm"
                             :options="['Tất cả ngành', 'Công nghệ thông tin', 'Cơ khí', 'Ngôn ngữ Anh', 'Kinh tế']"
                             model-value="Tất cả ngành" />
                </div>
            </div>
            <div
                 class="flex flex-col items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-md md:flex-row dark:bg-gray-800">
                <div><b>{{ pageConfig.totalRecords }}</b> vị trí phù hợp</div>
                <div class="flex flex-row gap-2">
                    <USelect v-model.number="pageConfig.pageSize" :options="[5, 6, 7, 8, 9, 10]" />
                    <UPagination v-model="pageConfig.currentPage" :max="5" :page-count="pageConfig.pageSize"
                                 :total="pageConfig.totalRecords" />
                </div>
            </div>

            <Loading v-if="isDataLoading" />
            <div v-else class="flex flex-col gap-6">
                <div v-for="recruitment in recruitmentPaging"
                     class="hover:border-primary-500 dark:hover:border-primary-500 flex h-auto w-full transform flex-row gap-4 self-center rounded-lg bg-white p-4 shadow-md transition-transform duration-300 hover:scale-105 dark:bg-gray-800">
                    <div class="flex flex-shrink-0 items-center">
                        <NuxtImg src="/job.png" class="h-16 w-16 rounded-full md:h-32 md:w-32" quality="80"
                                 alt="job" />
                    </div>
                    <div class="flex w-full flex-col justify-between gap-4">
                        <div class="flex flex-col justify-between gap-2">
                            <div class="flex w-full flex-col justify-between md:flex-row">
                                <div class="text-lg font-semibold leading-5">
                                    {{ recruitment.title }}
                                </div>
                                <div class="text-primary text-md whitespace-nowrap font-semibold">
                                    {{ recruitment.type }}
                                </div>
                            </div>

                            <div class="flex flex-col gap-2">
                                <div class="text-md flex flex-row items-center gap-2 font-normal">
                                    <UIcon name="mingcute:building-3-line" class="h-5 w-5 flex-shrink-0" />
                                    <div class="flex flex-col">
                                        <div class="font-bold">Công ty</div>
                                        <div class="leading-5">
                                            {{ recruitment.businessName }}
                                        </div>
                                    </div>
                                </div>
                                <div class="text-md flex flex-row items-center gap-2 font-normal">
                                    <UIcon name="mingcute:location-3-line" class="h-5 w-5 flex-shrink-0" />
                                    <div class="flex flex-col">
                                        <div class="font-bold">Địa điểm</div>
                                        <div class="leading-5">
                                            {{ recruitment.location }}
                                        </div>
                                    </div>
                                </div>
                                <div class="text-md flex flex-row items-center gap-2 font-normal">
                                    <UIcon name="mingcute:calendar-2-line" class="h-5 w-5 flex-shrink-0" />
                                    <div class="flex flex-col">
                                        <div class="font-bold">Giờ làm việc</div>
                                        <div class="leading-5">
                                            {{ recruitment.workingDay }} từ
                                            {{ recruitment.workingHour }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="flex flex-row justify-between">
                                <div class="flex flex-col items-center gap-2 md:flex-row">
                                </div>
                                <div>
                                    <UButton color="primary" variant="solid" size="md"
                                             :to="`/recruitment/${recruitment.recruitmentId}`">Chi tiết
                                    </UButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>