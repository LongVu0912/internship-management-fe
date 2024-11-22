<script setup lang="ts">
import type GradePoint from '~/types/business/GradePoint';
import Status from '~/types/enums/Status';
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
const businessRepository = BusinessRepository($apiToken);
const appUtils = AppUtils();
const nuxtToast = useNuxtToast();
const route = useRoute();

// * Refs
const isTableLoading = ref(true);
const confirmDialog = ref({
    isOpen: false,
    title: 'Xác nhận yêu cầu ứng tuyển',
    description: '',
    isApproved: false,
    recruitmentRequestId: '',
})

const messageModal = ref({
    isOpen: false,
    message: '',
})

const gradePointModal = ref({
    isOpen: false,
    isSubmitting: false,
    gradePoint: {} as GradePoint,
})

const sort = ref<any>({
    column: 'businessStatus',
    direction: 'asc'
})

const pageConfig = reactive(new PageConfig());
pageConfig.orders.push(new Order("businessStatus"));
pageConfig.filters.push(new Filter("student.profile.fullname"));
const studentRequestRecruitmentList = ref<StudentRequestRecruitment[]>([]);

// * Lifecycle
onBeforeMount(async () => {
    pageConfig.orders[0].sortOrderType = "ASC";
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
        status: Status.APPROVED,
    })

    if (apiResponse.code !== 200 || apiResponse.result === false) {
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
        status: Status.REJECT,
    })

    if (apiResponse.code !== 200 || apiResponse.result === false) {
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

const openConfirmDialog = (recruitmentRequestId: string, description: string, isApproved: boolean) => {
    confirmDialog.value.recruitmentRequestId = recruitmentRequestId;
    confirmDialog.value.isApproved = isApproved;
    confirmDialog.value.description = description;
    confirmDialog.value.isOpen = true;
}

const onDialogConfirm = () => {
    if (confirmDialog.value.isApproved) {
        approveStudentRequest(confirmDialog.value.recruitmentRequestId)
    }
    else {
        rejectStudentRequest(confirmDialog.value.recruitmentRequestId);
    }
    confirmDialog.value.isOpen = false;
}

const openGradePointModal = (studentRequestRecruitment: StudentRequestRecruitment) => {
    gradePointModal.value.gradePoint.recruitmentRequestId = studentRequestRecruitment.recruitmentRequestId || '';
    gradePointModal.value.isOpen = true;
}

const closeGradePointModal = () => {
    gradePointModal.value = {
        isOpen: false,
        isSubmitting: false,
        gradePoint: {} as GradePoint,
    }
}

const handleGradePoint = async () => {
    if (gradePointModal.value.gradePoint.point < 0 || gradePointModal.value.gradePoint.point > 10) {
        nuxtToast({
            description: "Điểm phải từ 0 đến 10",
            type: "info"
        })
        return;
    }

    gradePointModal.value.isSubmitting = true;

    const apiResponse = await businessRepository.gradePoint(gradePointModal.value.gradePoint);

    if (apiResponse.code !== 200) {
        nuxtToast({
            description: apiResponse.message,
            type: "error",
        })
    }
    else {
        nuxtToast({
            description: "Chấm điểm thành công",
            type: 'success',
        });
        fetchTableData();
        closeGradePointModal();
    }

    gradePointModal.value.isSubmitting = false;
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
        key: 'point',
        label: 'Điểm thực tập',
        class: 'text-center',
        sortable: true
    },
    {
        key: 'actions',
        label: 'Hành động'
    }
]

const itemsPending = (row: any) => [
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
            icon: 'mingcute:check-fill',
            click: () => {
                openConfirmDialog(row.recruitmentRequestId, "Bạn có chắc muốn đồng ý sinh viên này", true);
            }
        },
        {
            label: 'Từ chối',
            icon: 'mingcute:close-fill',
            click: () => {
                openConfirmDialog(row.recruitmentRequestId, "Bạn có chắc muốn từ chối sinh viên này", false);
            }
        },
    ]
]

const itemsApprovedAndCompleted = (row: any) => [
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
            label: 'Chấm điểm',
            icon: 'mingcute:edit-2-line',
            click: () => {
                openGradePointModal(row);
            }
        },
    ]
]

const itemsReject = (row: any) => [
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

            <div class="flex flex-col justify-between gap-2 px-4 py-3 xl:flex-row">
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
                                 :total="pageConfig.totalRecords" :disabled="isTableLoading" />
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
                            variant="subtle">
                        {{ appUtils.convertStatus(row.businessStatus) }}
                    </UBadge>
                </template>

                <template #messageToBusiness-data="{ row }">
                    <div @click="openMessageModal(row.messageToBusiness)" class="cursor-pointer">
                        {{ appUtils.subLongText(row.messageToBusiness) }}
                    </div>
                </template>

                <template #point-data="{ row }">
                    <div class="text-center" v-if="row.point != null">
                        <UBadge class="w-10 justify-center" :label="row.point" size="md" variant="outline"/>
                    </div>
                </template>

                <template #actions-data="{ row }">
                    <UDropdown v-if="row.businessStatus == Status.PENDING" :items="itemsPending(row)">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                    </UDropdown>

                    <UDropdown v-else-if="row.businessStatus == Status.REJECT" :items="itemsReject(row)">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                    </UDropdown>

                    <UDropdown v-else :items="itemsApprovedAndCompleted(row)">
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

    <UModal v-model="gradePointModal.isOpen" prevent-close>
        <form @submit.prevent="handleGradePoint">
            <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="text-base font-semibold">
                            Chấm điểm cho sinh viên
                        </div>
                        <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                                 @click="closeGradePointModal" />
                    </div>
                </template>

                <div class="space-y-4">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Điểm</div>
                        <UInput v-model="gradePointModal.gradePoint.point" size="lg" type="number" placeholder="10"
                                required />
                    </div>

                    <div class="w-full space-y-1">
                        <div class="font-medium">Tin nhắn tới sinh viên</div>
                        <UTextarea :rows="5" v-model="gradePointModal.gradePoint.messageToStudent" type="text" size="lg"
                                   color="gray" required placeholder="Đánh giá, nhận xét sinh viên" />
                    </div>
                </div>

                <template #footer>
                    <div class="flex justify-end">
                        <div>
                            <UButton :loading="gradePointModal.isSubmitting" class="w-full rounded-md" size="md"
                                     color="primary"
                                     type="submit"
                                     block>
                                Chấm điểm
                            </UButton>
                        </div>
                    </div>
                </template>
            </UCard>
        </form>
    </UModal>

    <ConfirmDialog :isOpen="confirmDialog.isOpen" :title="confirmDialog.title" :description="confirmDialog.description"
                   :onCancel="() => confirmDialog.isOpen = false" :onConfirm="onDialogConfirm" />
</template>