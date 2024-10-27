<script setup lang="ts">
import InstructorStatus from '~/types/enums/InstructorStatus';
import type Instructor from '~/types/instructor/Instructor';
import { Filter } from '~/types/page/Filter';
import { PageConfig } from '~/types/page/PageConfig';
import type Profile from '~/types/profile/Profile';
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
const isDataLoading = ref(true)
const isRequestModelOpen = ref(false);
const isInstructorDataLoading = ref(false);

const instructors = ref<Instructor[]>();
const messageToInstructor = ref('');
const selectedInstructorProfile = ref<Profile>({} as Profile);
const instructorProfiles = ref<Profile[]>([]);

const instructorRequestList = ref([] as InstructorRequest[]);

const currentPage = ref(1);
const pageSize = ref(5);
const fullNameFilter = ref(new Filter("instructor.profile.fullname"));
const pageConfig = ref(new PageConfig());

// * Lifecycle
onBeforeMount(async () => {
    fetchData();
})

// * Watches
watch([currentPage, pageSize], ([newCurrentPage, newPageSize], [oldCurrentPage, oldPageSize]) => {
    if (oldPageSize !== newPageSize) {
        currentPage.value = 1
    }
    fetchData();
});

// * Functions
const updatePageConfig = async () => {
    pageConfig.value.filters = [];
    pageConfig.value.filters.push(fullNameFilter.value);

    pageConfig.value.update({
        currentPage: currentPage.value,
        pageSize: pageSize.value,
    });
}

const fetchData = async () => {
    isDataLoading.value = true;

    await updatePageConfig();

    const apiResponse = await studentRepository.getAllStudentInstructorsRequestPaging(pageConfig.value);

    if (apiResponse.code === 200) {
        pageConfig.value.update(apiResponse.result.pageConfig);

        instructorRequestList.value = apiResponse.result.data;

        isDataLoading.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

const fetchInstructorsData = async () => {
    isInstructorDataLoading.value = true;

    const apiResponse = await instructorRepository.getAllInstructor();

    if (apiResponse.code != 200) {
        nuxtToast({
            description: "Không thể lấy thông tin giảng viên",
            type: "error",
        })
        return;
    }

    instructors.value = apiResponse.result;

    await instructors.value?.forEach((instructor) => {
        instructorProfiles.value.push(instructor.profile);
    })

    selectedInstructorProfile.value = instructorProfiles.value[0];
    isInstructorDataLoading.value = false;
}

const openRequestModal = async () => {
    instructorProfiles.value = [];

    await fetchInstructorsData();

    if (instructorProfiles.value.length == 0) {
        nuxtToast({
            description: "Hiện tại không có giảng viên",
            type: "error",
        })
        return;
    }

    isRequestModelOpen.value = true;
}

const onDialogConfirm = async () => {
    console.log(messageToInstructor.value);
    console.log(selectedInstructorProfile.value);

    isRequestModelOpen.value = false;
}

const onDialogCancel = () => {
    isRequestModelOpen.value = false;
}

// *  Data
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
    <div class="flex flex-col gap-2">
        <div class="mb-2 flex flex-col justify-between gap-2 md:flex-row">
            <div class="flex flex-col gap-2 md:flex-row">
                <form @submit.prevent="fetchData">
                    <UInput v-model="fullNameFilter.value"
                            placeholder="Tìm tên giảng viên..."
                            class="w-64"
                            size="sm"
                            :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
                        <template #trailing>
                            <UButton icon="heroicons:magnifying-glass-16-solid" color="primary"
                                     class="-me-2.5 rounded-none rounded-r-md" type="submit" />
                        </template>
                    </UInput>
                </form>
            </div>

            <div>
                <UButton color="primary" @click="openRequestModal" :loading="isInstructorDataLoading">Yêu cầu giảng viên
                </UButton>
            </div>
        </div>

        <UTable class="rounded-lg border border-gray-100 dark:border-gray-700" :columns="columns"
                :rows="instructorRequestList">
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
                    <USelect v-model.number="pageSize" :options="[5, 6, 7, 8, 9, 10]" />
                </div>
                <UPagination :max="7" v-model="currentPage" :page-count="pageSize" :total="pageConfig.totalRecords" />
            </div>
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
                <USelectMenu size="lg" color="gray" :options="instructorProfiles" option-attribute="fullname"
                             v-model="selectedInstructorProfile">
                </USelectMenu>
                <div class="mb-2 mt-4 text-base font-medium">Tin nhắn tới giảng viên</div>
                <UTextarea :rows="3" color="gray" v-model="messageToInstructor" type="text" size="lg"
                           placeholder="Tin nhắn tới giảng viên yêu cầu hướng dẫn thực tập" />
            </div>

            <template #footer>
                <div class="flex justify-end">
                    <UButton class="mr-2" color="gray" variant="ghost" @click="onDialogCancel">
                        Huỷ
                    </UButton>
                    <UButton color="primary" @click="onDialogConfirm">
                        Xác nhận
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>