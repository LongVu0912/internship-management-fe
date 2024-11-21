<script setup lang="ts">
import type Business from '~/types/business/Business';
import { Filter } from '~/types/page_config/Filter';
import { PageConfig } from '~/types/page_config/PageConfig';
import type Recruitment from '~/types/recruitment/Recruitment';

definePageMeta({
    layout: 'home',
})

// * Imports
const img = useImage();
const { $api } = useNuxtApp();
const recruitmentRepository = RecruitmentRepository($api);
const businessRepository = BusinessRepository($api);
const nuxtToast = useNuxtToast();
const imageUrl = useRuntimeConfig().public.imageUrl;

// * Refs
const isDataLoading = ref(true);
const pageConfig = reactive(new PageConfig());
pageConfig.filters.push(new Filter("title"));
pageConfig.filters.push(new Filter("business.name"));
pageConfig.filters.push(new Filter("location"));
const recruitmentPaging = ref<Recruitment[]>();

const searchLocation = ref('');

const businessPageConfig = reactive(new PageConfig());
businessPageConfig.filters.push(new Filter("name"));
const selectedBusiness = ref<Business>({} as Business);
const businessList = ref<Business[]>([]);

// * Lifecycle
onBeforeMount(async () => {
    await fetchData();
    isDataLoading.value = false;
})

// * Functions
const fetchData = async () => {
    isDataLoading.value = true;
    pageConfig.filters[1].value = selectedBusiness?.value.name || '';
    pageConfig.filters[2].value = searchLocation.value;

    const apiResponse = await recruitmentRepository.getOpenRecruitmentPaging(pageConfig);

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

const fetchBusinessData = async () => {
    const apiResponse = await businessRepository.getBusinessPaging(businessPageConfig);

    if (apiResponse.code !== 200) {
        nuxtToast({
            description: apiResponse.message,
            type: "error",
        })
        return false;
    }

    businessList.value = apiResponse.result.data;
    return true;
}

const searchData = async () => {
    if (pageConfig.currentPage !== 1) {
        pageConfig.currentPage = 1;
    } else {
        await fetchData();
    }
}

const searchInstructor = async (q: string) => {
    businessPageConfig.filters[0].value = q;

    await fetchBusinessData();

    return businessList.value;
}

const clearFilters = () => {
    selectedBusiness.value = {} as Business;
    searchLocation.value = '';
}

const checkImage = (url: string): string => {
    const img = new Image();
    img.src = url;
    img.onerror = () => url = '/job.png';
    return url;
};

// * Watches
watch(
    [() => pageConfig.currentPage, () => pageConfig.pageSize, () => selectedBusiness.value],
    async ([newCurrentPage, newPageSize], [oldCurrentPage, oldPageSize]) => {
        if (newPageSize !== oldPageSize) {
            pageConfig.currentPage = 1;
        }
        await fetchData();
    }
)
</script>

<template>
    <div class="flex min-h-screen flex-col items-center dark:bg-gray-900">
        <div class="flex w-full flex-col gap-6 md:w-4/5 lg:w-2/3">
            <div class="flex w-full flex-col gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
                <div>
                    <form @submit.prevent="searchData">
                        <UInput icon="mingcute:search-2-fill" placeholder="Tìm theo tên công việc..."
                                v-model="pageConfig.filters[0].value"
                                class="w-full"
                                size="md" :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
                            <template #trailing>
                                <UButton icon="mingcute:search-2-fill" color="primary"
                                         type="submit"
                                         size="md"
                                         class="-me-3.5 rounded-none rounded-r-md" />
                            </template>
                        </UInput>
                    </form>
                </div>
                <div class="flex flex-col gap-2 md:flex-row">
                    <USelectMenu v-model="selectedBusiness" :searchable="searchInstructor"
                                 icon="mingcute:building-3-line"
                                 class="w-full" placeholder="Tìm kiếm giảng viên..." size="md" :debounce="200"
                                 color="gray"
                                 option-attribute="name">
                        <template #label>
                            <div>{{ selectedBusiness.name || "Tất cả công ty" }}</div>
                        </template>
                        <template #option="{ option: business }">
                            <div>{{ business.name }}</div>
                        </template>
                    </USelectMenu>
                    <UInput v-model="searchLocation" icon="mingcute:location-3-line" placeholder="Tìm theo vị trí..."
                            class="w-full"
                            size="md" :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
                    </UInput>
                    <div class="flex justify-end">
                        <UButton icon="mingcute:delete-2-line" color="primary" @click="clearFilters" />
                    </div>
                </div>
            </div>

            <div
                 class="flex flex-col items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-md md:flex-row dark:bg-gray-800">
                <div><b>{{ pageConfig.totalRecords }}</b> vị trí phù hợp</div>
                <div class="flex flex-row gap-2">
                    <USelect v-model.number="pageConfig.pageSize" :options="[5, 6, 7, 8, 9, 10]" />
                    <UPagination v-model="pageConfig.currentPage" :max="5" :page-count="pageConfig.pageSize"
                                 :total="pageConfig.totalRecords" :disabled="isDataLoading" />
                </div>
            </div>

            <Loading v-if="isDataLoading" />
            <div v-else class="flex flex-col gap-6">
                <div v-for="recruitment in recruitmentPaging"
                     class="hover:border-primary-500 dark:hover:border-primary-500 flex h-auto w-full transform flex-row gap-4 self-center rounded-lg bg-white p-4 shadow-md transition-transform duration-300 hover:scale-105 dark:bg-gray-800">
                    <div class="flex flex-shrink-0 items-center">
                        <NuxtImg :src="imageUrl + recruitment.businessImage" :placeholder="img(`/job.png`, { q: 50 })"
                                 class="h-16 w-16 rounded-full object-cover md:h-32 md:w-32" format="webp" />
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