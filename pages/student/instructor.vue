<script setup lang="ts">
import InstructorStatus from '~/types/enums/InstructorStatus';
import type Instructor from '~/types/instructor/Instructor';
import { Filter } from '~/types/page_config/Filter';
import { PageConfig } from '~/types/page_config/PageConfig';
import type InstructorRequest from '~/types/request/InstructorRequest';

definePageMeta({
    layout: "student",
    middleware: "student",
});

// * Imports
const { $apiToken } = useNuxtApp();
const instructorRepository = InstructorRepository($apiToken);
const studentRepository = StudentRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const isPageLoading = ref(true);
const isInstructorsDataLoading = ref(false);
const isRequestModelOpen = ref(false);

// * For instructors in modal
const isSendingRequest = ref(false);
const modalPageConfig = reactive(new PageConfig());
const modalFullNameFilter = ref(new Filter("profile.fullname"));
modalPageConfig.filters.push(modalFullNameFilter.value);
const messageToInstructor = ref('');
const selectedInstructor = ref<Instructor>({} as Instructor);
const instructors = ref<Instructor[]>([]);

// * For instructor requests
const isInstructorRequestsLoading = ref(true);
const pageConfig = reactive(new PageConfig());
const fullNameFilter = ref(new Filter("instructor.profile.fullname"));
pageConfig.filters.push(fullNameFilter.value);
const instructorRequestList = ref([] as InstructorRequest[]);

// * Lifecycle
onBeforeMount(async () => {
    await fetchInstructorRequestsData();
    isPageLoading.value = false;
})

// * Functions
const fetchInstructorsData = async () => {
    const apiResponse = await instructorRepository.getInstructorPaging(modalPageConfig);

    if (apiResponse.code != 200) {
        nuxtToast({
            description: apiResponse.message,
            type: "error",
        })
        isInstructorsDataLoading.value = false;
        return false;
    }

    instructors.value = apiResponse.result.data;
    isInstructorsDataLoading.value = false;
    return true;
}

const openRequestModal = async () => {
    isInstructorsDataLoading.value = true;

    if (await fetchInstructorsData()) {
        isRequestModelOpen.value = true;
    }

    isInstructorsDataLoading.value = false;
}

const onDialogConfirm = async () => {
    isSendingRequest.value = true;
    const apiResponse = await studentRepository.requestInstructor({
        instructorId: selectedInstructor.value.instructorId,
        messageToInstructor: messageToInstructor.value,
    });

    if (apiResponse.code != 200) {
        nuxtToast({
            description: apiResponse.message,
            type: "error",
        })
        isSendingRequest.value = false;
        return;
    }

    nuxtToast({
        description: "Gửi yêu cầu thành công",
        type: "success",
    })

    await fetchInstructorsData();
    isSendingRequest.value = false;
    isRequestModelOpen.value = false;
}

const searchInstructor = async (q: string) => {
    modalPageConfig.filters[0].value = q;

    await fetchInstructorsData();

    return instructors.value;
}

const fetchInstructorRequestsData = async () => {
    isInstructorRequestsLoading.value = true;
    const apiResponse = await studentRepository.getAllStudentInstructorsRequestPaging(pageConfig);

    if (apiResponse.code === 200) {
        pageConfig.update(apiResponse.result.pageConfig)

        instructorRequestList.value = apiResponse.result.data;

        isInstructorRequestsLoading.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

const searchInstructorRequestsData = async () => {
    if (pageConfig.currentPage !== 1) {
        pageConfig.currentPage = 1;
    } else {
        await fetchInstructorRequestsData();
    }
}

// * Watch
watch(
    [() => pageConfig.currentPage, () => pageConfig.pageSize],
    async ([newCurrentPage, newPageSize], [oldCurrentPage, oldPageSize]) => {
        if (newPageSize !== oldPageSize) {
            pageConfig.currentPage = 1;
        }
        await fetchInstructorRequestsData();
    }
)

// * Data
const columns = [
    {
        key: 'instructor',
        label: 'Tên'
    },
    {
        key: 'instructorStatus',
        label: 'Trạng thái'
    },
    {
        key: 'messageToInstructor',
        label: 'Tin nhắn'
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
    <div class="flex flex-row justify-between">
        <div class="mb-2 flex flex-col justify-between gap-2 md:flex-row">
            <div class="flex flex-col gap-2 md:flex-row">
                <form @submit.prevent="searchInstructorRequestsData">
                    <UInput v-model="pageConfig.filters[0].value" placeholder="Tìm tên giảng viên..." class="w-64"
                            size="sm"
                            :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
                        <template #trailing>
                            <UButton icon="heroicons:magnifying-glass-16-solid" color="primary"
                                     class="-me-2.5 rounded-none rounded-r-md" type="submit" />
                        </template>
                    </UInput>
                </form>
            </div>
        </div>
        <div>
            <UButton color="primary" @click="openRequestModal" :loading="isInstructorsDataLoading">
                Yêu cầu giảng viên
            </UButton>
        </div>
    </div>

    <UTable class="rounded-lg border border-gray-100 dark:border-gray-700" :columns="columns"
            :loading="isInstructorRequestsLoading" :rows="instructorRequestList">
        <template #instructor-data="{ row }">
            <div class="font-bold">
                {{ row.instructor.profile.fullname }}
            </div>
        </template>

        <template #instructorStatus-data="{ row }">
            <UBadge class="w-20 justify-center" :color="statusBadge(row.instructorStatus)" variant="outline">
                {{ row.instructorStatus }}
            </UBadge>
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

    <UModal v-model="isRequestModelOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-base font-semibold">
                        Gửi yêu cầu thực tập cho giảng viên
                    </div>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="isRequestModelOpen = false" />
                </div>
            </template>

            <div class="py-2">
                <div class="mb-2 text-base font-medium">Giảng viên hướng dẫn</div>
                <USelectMenu v-model="selectedInstructor" :searchable="searchInstructor"
                             placeholder="Tìm kiếm giảng viên..." size="md" :debounce="200"
                             option-attribute="profile.fullname">
                    <template #label>
                        <div>{{ selectedInstructor.profile?.fullname || "Chọn giảng viên" }}</div>
                    </template>
                    <template #option="{ option: instructor }">
                        <div>{{ instructor.profile.fullname }}</div>
                    </template>
                </USelectMenu>

                <div class="mb-2 mt-4 text-base font-medium">Tin nhắn tới giảng viên</div>
                <UTextarea :rows="3" color="gray" v-model="messageToInstructor" type="text" size="lg"
                           placeholder="Tin nhắn tới giảng viên yêu cầu hướng dẫn thực tập" />
            </div>

            <template #footer>
                <div class="flex justify-end">
                    <UButton class="mr-2" color="gray" variant="ghost" @click="isRequestModelOpen = false">
                        Huỷ
                    </UButton>
                    <UButton color="primary" @click="onDialogConfirm" :loading="isSendingRequest">
                        Xác nhận
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>