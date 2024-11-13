<script setup lang="ts">
import InstructorStatus from '~/types/enums/InstructorStatus';
import type Instructor from '~/types/instructor/Instructor';
import { Filter } from '~/types/page_config/Filter';
import { Order } from '~/types/page_config/Order';
import { PageConfig } from '~/types/page_config/PageConfig';
import type StudentInstructorRequest from '~/types/student/StudentRequestInstructor';

definePageMeta({
    layout: "student",
    middleware: "student",
});

// * Imports
const { $apiToken } = useNuxtApp();
const instructorRepository = InstructorRepository($apiToken);
const studentRepository = StudentRepository($apiToken);
const nuxtToast = useNuxtToast();
const appUtils = AppUtils();

// * Refs
const isTableLoading = ref(false);

const sort = ref<any>({
    column: 'instructor',
    direction: 'desc'
})

// * For table
const pageConfig = reactive(new PageConfig());
pageConfig.orders.push(new Order("instructor.profile.fullname"));
pageConfig.filters.push(new Filter("instructor.profile.fullname"));
const studentInstructorRequestList = ref([] as StudentInstructorRequest[]);

const messageModal = ref({
    isOpen: false,
    message: '',
})

// * For modal
const instructorModal = ref({
    isOpen: false,
    isOpening: false,
    isSendingRequest: false,
    messageToInstructor: '',
})
const modalPageConfig = reactive(new PageConfig());
modalPageConfig.filters.push(new Filter("profile.fullname"));
const selectedInstructor = ref<Instructor>({} as Instructor);
const instructors = ref<Instructor[]>([]);

// * Lifecycle
onBeforeMount(async () => {
    await fetchTableData();
})

// * Functions
const fetchTableData = async () => {
    isTableLoading.value = true;
    const apiResponse = await studentRepository.getAllStudentInstructorsRequestPaging(pageConfig);

    if (apiResponse.code === 200) {
        pageConfig.update(apiResponse.result.pageConfig)

        studentInstructorRequestList.value = apiResponse.result.data;

        isTableLoading.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

const fetchInstructorsData = async () => {
    const apiResponse = await instructorRepository.getInstructorPaging(modalPageConfig);

    if (apiResponse.code != 200) {
        nuxtToast({
            description: apiResponse.message,
            type: "error",
        })
        return false;
    }

    instructors.value = apiResponse.result.data;
    return true;
}

const openRequestModal = async () => {
    instructorModal.value.isOpening = true;

    if (await fetchInstructorsData()) {
        instructorModal.value.isOpen = true;
    }

    instructorModal.value.isOpening = false;
}

const sendRequestToInstructor = async () => {
    instructorModal.value.isSendingRequest = true;
    const apiResponse = await studentRepository.requestInstructor({
        instructorId: selectedInstructor.value.instructorId,
        messageToInstructor: instructorModal.value.messageToInstructor,
    });

    if (apiResponse.code != 200 || apiResponse.result == false) {
        nuxtToast({
            description: apiResponse.message,
            type: "error",
        })
    }
    else {
        nuxtToast({
            description: "Gửi yêu cầu thành công",
            type: "success",
        })
        await fetchTableData();
        instructorModal.value.isOpen = false;
    }

    instructorModal.value.isSendingRequest = false;
}

const searchInstructor = async (q: string) => {
    modalPageConfig.filters[0].value = q;

    await fetchInstructorsData();

    return instructors.value;
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
        key: 'instructor.profile.fullname',
        label: 'Tên',
        sortable: true,
    },
    {
        key: 'instructorStatus',
        label: 'Trạng thái',
        sortable: true,
    },
    {
        key: 'messageToInstructor',
        label: 'Tin nhắn',
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
            label: 'Chi tiết',
            icon: 'mingcute:profile-line',
            click: nuxtToast,
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
            <UButton icon="mingcute:file-new-line" color="primary" @click="openRequestModal"
                     :loading="instructorModal.isOpening"
                     label="Yêu cầu giảng viên" />
        </div>

        <UCard class="w-full" :ui="{
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
            footer: { padding: 'p-4' }
        }">

            <template #header>
                <h1 class="text-center text-xl font-semibold text-gray-900 dark:text-white">
                    Danh sách yêu cầu giảng viên hướng dẫn
                </h1>
            </template>

            <div class="flex flex-col justify-between gap-2 px-4 py-3 md:flex-row">
                <form @submit.prevent="searchTable">
                    <UInput placeholder="Tìm tên giảng viên..." class="min-w-64" size="sm" color="white"
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
                    :rows="studentInstructorRequestList"
                    sort-mode="manual" v-model:sort="sort">

                <template #instructor.profile.fullname-data="{ row }">
                    <NuxtLink class="font-semibold" :to="`/instructor/${row.instructor.instructorId}`"
                              target="_blank">
                        {{ row.instructor.profile.fullname }}
                    </NuxtLink>
                </template>

                <template #instructorStatus-data="{ row }">
                    <UBadge class="w-20 justify-center" :color="appUtils.statusBadge(row.instructorStatus)"
                            variant="outline">
                        {{ appUtils.convertStatus(row.instructorStatus) }}
                    </UBadge>
                </template>

                <template #messageToInstructor-data="{ row }">
                    <div @click="openMessageModal(row.messageToInstructor)" class="cursor-pointer">
                        {{ row.messageToInstructor.substring(0, 20) + '...' }}
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

    <UModal v-model="instructorModal.isOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-base font-semibold">
                        Gửi yêu cầu thực tập cho giảng viên
                    </div>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="instructorModal.isOpen = false" />
                </div>
            </template>

            <div class="flex flex-col gap-3">
                <div class="w-full space-y-1">
                    <div class="mb-2 text-base font-medium">Giảng viên hướng dẫn</div>
                    <USelectMenu v-model="selectedInstructor" :searchable="searchInstructor"
                                 placeholder="Tìm kiếm giảng viên..." size="md" :debounce="200" color="gray"
                                 option-attribute="profile.fullname">
                        <template #label>
                            <div>{{ selectedInstructor.profile?.fullname || "Chọn giảng viên" }}</div>
                        </template>
                        <template #option="{ option: instructor }">
                            <div>{{ instructor.profile.fullname }}</div>
                        </template>
                    </USelectMenu>
                </div>

                <div class="w-full space-y-1">
                    <div class="font-medium">Tin nhắn tới giảng viên</div>
                    <UTextarea :rows="3" color="gray" v-model="instructorModal.messageToInstructor" type="text"
                               size="lg"
                               placeholder="Tin nhắn tới giảng viên yêu cầu hướng dẫn thực tập" />
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end">
                    <UButton class="mr-2" color="gray" variant="ghost" @click="instructorModal.isOpen = false">
                        Huỷ
                    </UButton>
                    <UButton color="primary" @click="sendRequestToInstructor"
                             :loading="instructorModal.isSendingRequest">
                        Xác nhận
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>

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
                <NewLineText :text="messageModal.message" />
            </div>
        </UCard>
    </UModal>
</template>