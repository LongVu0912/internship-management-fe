<script setup lang="ts">
import { Filter } from '~/types/page/Filter';
import { PageConfig } from '~/types/page/PageConfig';
import type Recruitment from '~/types/recruitment/Recruitment';

definePageMeta({
    layout: 'home',
})

// * Imports
const { $apiToken } = useNuxtApp();
const recruitmentRepository = RecruitmentRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const currentPage = ref(1);
const pageSize = ref(5);
const isPageLoading = ref(true);
const titleFilter = ref(new Filter("title"));
const pageConfig = ref(new PageConfig());
const recruitmentPaging = ref<Recruitment[]>();

// * Lifecycle
onBeforeMount(async () => {
    await fetchData();
    isPageLoading.value = false;
})

// * Watch
watch([currentPage, pageSize], () => {
    fetchData();
})

// * Functions
const fetchData = async () => {
    pageConfig.value.currentPage = currentPage.value;
    pageConfig.value.pageSize = pageSize.value;

    const apiResponse = await recruitmentRepository.getRecruitmentPaging(pageConfig.value);

    if (apiResponse.code === 200) {
        recruitmentPaging.value = apiResponse.result.data;

        pageConfig.value = apiResponse.result.pageConfig;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }

    console.log(recruitmentPaging.value);

}

const handleSearch = () => {
    pageConfig.value.filters = [];
    pageConfig.value.filters.push(titleFilter.value);
    fetchData();
}

</script>

<template>
    <div class="flex flex-col items-center px-4 md:px-28">
        <div class="flex w-full flex-col gap-4">
            <div class="flex w-full flex-col gap-2">
                <div>
                    <form @submit.prevent="handleSearch">
                        <UInput icon="mingcute:search-2-fill" placeholder="Tìm theo tên công ty, tên công việc..."
                                v-model="titleFilter.value"
                                class="w-full"
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
                    <USelect class="w-1/3" icon="mingcute:building-3-line" color="gray" size="sm"
                             :options="['Tất cả nhà tuyển dụng', 'FPT Software', 'Viettel Cooperation', 'VNPT', 'VNG']"
                             model-value="Tất cả nhà tuyển dụng" />
                    <USelect class="w-1/3" icon="mingcute:book-3-line" color="gray" size="sm"
                             :options="['Tất cả ngành', 'Công nghệ thông tin', 'Cơ khí', 'Ngôn ngữ Anh', 'Kinh tế']"
                             model-value="Tất cả ngành" />
                    <USelect class="w-1/3" icon="mingcute:location-3-line" color="gray" size="sm"
                             :options="['Tất cả địa điểm', 'Thành phố Thủ Đức', 'Quận 1', 'Quận 3', 'Quận 6']"
                             model-value="Tất cả địa điểm" />
                </div>
            </div>
            <div
                 class="flex flex-col items-center justify-between gap-1 rounded-md border p-2 md:flex-row dark:border-gray-700">
                <div><b>{{ pageConfig.totalRecords }}</b> vị trí phù hợp</div>
                <div class="flex flex-row gap-2">
                    <USelect v-model.number="pageSize" :options="[5, 6, 7, 8, 9, 10]" />
                    <UPagination v-model="currentPage" :max="5" :page-count="pageSize"
                                 :total="pageConfig.totalRecords" />
                </div>
            </div>


            <Loading v-if="isPageLoading" />
            <div v-else class="flex flex-col gap-4">
                <RecruitmentCard :recruitment="recruitment" class="self-center"
                                 v-for="recruitment in recruitmentPaging" />
            </div>
        </div>
    </div>
</template>