<script setup lang="ts">
import Role from '~/types/enums/Role';
import { Filter } from '~/types/page_config/Filter';
import { PageConfig } from '~/types/page_config/PageConfig';
import type Recruitment from '~/types/recruitment/Recruitment';
import type RecruitmentRequest from '~/types/recruitment/RecruitmentRequest';
import type Student from '~/types/student/Student';

definePageMeta({
    layout: 'home',
    middleware: 'logged',
})

// * Imports
const { $apiToken } = useNuxtApp();
const recruitmentRepository = RecruitmentRepository($apiToken);
const studentRepository = StudentRepository($apiToken);
const nuxtToast = useNuxtToast();
const route = useRoute();

// * Refs
const isPageLoading = ref(true);
const confirmDialog = ref({
    isOpen: false,
    isSendingRequest: false,
})

const studentPageConfig = reactive(new PageConfig());
studentPageConfig.filters.push(new Filter("profile.fullname"));
const studentList = ref<Student[]>([]);

const sort = ref<any>({
    column: 'profile.fullname',
    direction: 'desc'
})

const inviteStudentModal = ref({
    isOpen: false,
    isLoading: false,
    isSubmitting: false,
})

const recruitment = ref<Recruitment>();
const recruitmentRequest = ref<RecruitmentRequest>({} as RecruitmentRequest);

// * Lifecycle
onBeforeMount(async () => {
    const apiResponse = await recruitmentRepository.getRecruitmentById({
        recruitmentId: route.params.recruitmentId as string,
    });

    if (apiResponse.code !== 200) {
        showError({
            statusCode: 404,
            statusMessage: "Page not found",
        })
    }

    recruitment.value = apiResponse.result;

    isPageLoading.value = false;
})

// * Functions
const fetchStudentData = async () => {
    inviteStudentModal.value.isLoading = true;

    const apiResponse = await studentRepository.getAllStudentWithSeekingIntern(studentPageConfig);

    if (apiResponse.code === 200) {
        studentList.value = apiResponse.result.data;

        studentPageConfig.update(apiResponse.result.pageConfig);

        inviteStudentModal.value.isLoading = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

const openConfirmDialog = async (recruitmentId: string) => {
    recruitmentRequest.value.recruitmentId = recruitmentId;
    confirmDialog.value.isOpen = true;
}

const onDialogConfirm = async () => {
    confirmDialog.value.isSendingRequest = true;
    const apiResponse = await recruitmentRepository.requestRecruitment(recruitmentRequest.value);

    if (apiResponse.code !== 200 || apiResponse.result === false) {
        nuxtToast({
            description: apiResponse.message,
            type: "error",
        })
    }
    else {
        nuxtToast({
            description: 'Gửi yêu cầu thành công',
            type: 'success',
        });
        confirmDialog.value.isOpen = false;
    }

    confirmDialog.value.isSendingRequest = false;
}

const onDialogCancel = () => {
    recruitmentRequest.value = {} as RecruitmentRequest;
    confirmDialog.value.isOpen = false;
}

const openInviteStudentModal = async () => {
    await fetchStudentData();
    inviteStudentModal.value.isOpen = true;
}

const closeInviteStudentModal = () => {
    inviteStudentModal.value.isOpen = false;
}

const searchTable = async () => {
    if (studentPageConfig.currentPage !== 1) {
        studentPageConfig.currentPage = 1;
    } else {
        fetchStudentData();
    }
}

const handleInviteStudent = async (row: Student) => {
    inviteStudentModal.value.isSubmitting = true;

    const apiResponse = await recruitmentRepository.inviteStudent({
        recruitmentId: route.params.recruitmentId as string,
        studentId: row.profile.profileId
    });

    if (apiResponse.code !== 200 || apiResponse.result === false) {
        nuxtToast({
            description: apiResponse.message,
            type: "error",
        })
    }
    else {
        nuxtToast({
            description: `Mời thực tập thành công, sinh viên ${row.profile.fullname}`,
            type: 'success',
        });
    }

    inviteStudentModal.value.isSubmitting = false;
}

// * Watches
watch(
    [() => studentPageConfig.currentPage, () => studentPageConfig.pageSize],
    ([newCurrentPage, newPageSize], [oldCurrentPage, oldPageSize]) => {
        if (!inviteStudentModal.value.isLoading) {
            if (newPageSize !== oldPageSize) {
                studentPageConfig.currentPage = 1;
            }
            fetchStudentData();
        }
    }
)

watch(sort, () => {
    if (!inviteStudentModal.value.isLoading) {
        studentPageConfig.orders[0].sort = sort.value.column;
        studentPageConfig.orders[0].sortOrderType = sort.value.direction.toUpperCase();

        fetchStudentData();
    }
})

// * Data
const columns = [
    {
        key: "profile.fullname",
        label: "Tên",
        sortable: true,
    },
    {
        key: "dob",
        label: "Ngày sinh",
        sortable: true,
    },
    {
        key: "profile.email",
        label: "Email",
        sortable: true,
    },
    {
        key: "major.name",
        label: "Ngành",
        sortable: true,
    },
    {
        key: "actions",
        label: "Hành động",
        class: "text-center"
    }
]

const selectedColumns = ref([...columns]);
</script>

<template>

    <Head>
        <Title>{{ recruitment?.title }}</Title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
    </Head>
    <Loading v-if="isPageLoading" />
    <div v-else class="flex flex-col items-center">
        <UCard class="w-full shadow-md md:w-4/5 lg:w-2/3">
            <template #header>
                <div class="text-center text-xl font-bold">
                    {{ recruitment?.title }}
                </div>
            </template>
            <div class="flex flex-col gap-4 py-4">
                <div class="flex w-full flex-col gap-2 text-base md:flex-row">
                    <div class="md:w-1/2">
                        <div class="flex flex-col gap-3">
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:building-3-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Công ty</div>
                                    <div>{{ recruitment?.business.name }}</div>
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:location-3-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Địa điểm</div>
                                    <div>{{ recruitment?.location }}</div>
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:user-2-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Vị trí</div>
                                    <div>{{ recruitment?.position }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="md:w-1/2">
                        <div class="flex flex-col gap-3">
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:briefcase-2-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Loại hình</div>
                                    <div>{{ recruitment?.type }}</div>
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:calendar-2-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Ngày làm việc</div>
                                    <div>{{ recruitment?.workingDay }}</div>
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <UIcon name="mingcute:time-line" class="h-6 w-6 flex-shrink-0" />
                                <div class="flex flex-col">
                                    <div class="font-bold">Giờ làm việc</div>
                                    <div>{{ recruitment?.workingHour }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <UDivider />
                <div>
                    <div class="text-lg font-bold leading-9">Kỹ năng</div>
                    <NewLineText :text="recruitment?.keySkills" />
                </div>
                <UDivider />
                <div>
                    <div class="text-lg font-bold leading-9">Mô tả công việc</div>
                    <NewLineText :text="recruitment?.description" />
                </div>
            </div>

            <template #footer>
                <div class="flex flex-row justify-end">
                    <div class="flex flex-row gap-2">
                        <UButton label="Xem công ty" size="lg"
                                 :to="`/business/${recruitment?.business.businessId}`" />
                        <UButton v-if="useUserState().value.role === Role.ROLE_STUDENT" label="Ứng tuyển ngay" size="lg"
                                 color="primary"
                                 @click="openConfirmDialog(recruitment?.recruitmentId || '')" />

                        <UButton v-if="useUserState().value.username == recruitment?.business.managedBy.username"
                                 label="Mời sinh viên" size="lg"
                                 color="primary"
                                 @click="openInviteStudentModal" />
                    </div>
                </div>
            </template>
        </UCard>
    </div>

    <UModal v-model="confirmDialog.isOpen" prevent-close>
        <form @submit.prevent="onDialogConfirm">
            <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="text-base font-semibold">
                            Bạn có chắc muốn ứng tuyển công việc này?
                        </div>
                        <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                                 @click="onDialogCancel" />
                    </div>
                </template>

                <div class="w-full space-y-1 py-2">
                    <div class="mb-2 text-base font-medium">Tin nhắn tới doanh nghiệp</div>
                    <UTextarea :rows="5" v-model="recruitmentRequest.messageToBusiness" type="text" size="lg"
                               color="gray"
                               aria-required="true" required
                               placeholder="Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) và nêu rõ mong muốn, lý do bạn muốn ứng tuyển cho vị trí này." />
                </div>

                <template #footer>
                    <div class="flex justify-end">
                        <UButton class="mr-2" color="gray" variant="ghost" @click="onDialogCancel">
                            Huỷ
                        </UButton>
                        <UButton :loading="confirmDialog.isSendingRequest" color="primary" type="submit">
                            Xác nhận
                        </UButton>
                    </div>
                </template>
            </UCard>
        </form>
    </UModal>

    <UModal :ui="{ width: 'sm:max-w-6xl' }" v-model="inviteStudentModal.isOpen" prevent-close>
        <form @submit.prevent="onDialogConfirm">
            <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="text-base font-semibold">
                            Mời sinh viên ứng tuyển vào công việc
                        </div>
                        <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                                 @click="closeInviteStudentModal" />
                    </div>
                </template>

                <div class="w-full space-y-1 py-2">
                    <UCard class="w-full" :ui="{
                        divide: 'divide-y divide-gray-200 dark:divide-gray-700',
                        header: { padding: 'px-4 py-5' },
                        body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
                        footer: { padding: 'p-4' }
                    }">

                        <template #header>
                            <h1 class="text-center text-xl font-semibold text-gray-900 dark:text-white">
                                Danh sách sinh viên chưa thực tập
                            </h1>
                        </template>

                        <div class="flex flex-col justify-between gap-2 px-4 py-3 xl:flex-row">
                            <form @submit.prevent="searchTable">
                                <UInput placeholder="Tìm tên sinh viên..." class="min-w-64" size="sm" color="white"
                                        v-model="studentPageConfig.filters[0].value"
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
                                <USelectMenu v-model.number="studentPageConfig.pageSize"
                                             :options="['5', '6', '7', '8', '9', '10']" icon="mingcute:rows-3-line"
                                             :placeholder="studentPageConfig.pageSize.toString()">
                                </USelectMenu>
                                <UPagination :max="7" v-model="studentPageConfig.currentPage"
                                             :page-count="studentPageConfig.pageSize"
                                             :total="studentPageConfig.totalRecords"
                                             :disabled="inviteStudentModal.isLoading" />
                            </div>
                        </div>

                        <UTable class="rounded-lg" :columns="selectedColumns" :loading="inviteStudentModal.isLoading"
                                :rows="studentList" sort-mode="manual" v-model:sort="sort">
                            <template #profile.fullname-data="{ row }">
                                <div class="flex flex-col">
                                    <NuxtLink class="font-semibold" :to="`/student/${row.studentId}`"
                                              target="_blank">
                                        {{ row.profile.fullname }}
                                    </NuxtLink>
                                    <div>
                                        <UBadge class="mt-1" color="primary" variant="subtle">
                                            {{ row.studentId }}
                                        </UBadge>
                                    </div>
                                </div>
                            </template>

                            <template #dob-data="{ row }">
                                <div class="font-medium">
                                    {{ row.dob }}
                                </div>
                                <UBadge class="mt-1 w-10 justify-center" color="gray" variant="subtle">
                                    {{ row.profile.isMale ? "Nam" : "Nữ" }}
                                </UBadge>
                            </template>

                            <template #profile.email-data="{ row }">
                                <div class="font-medium">
                                    {{ row.profile.email }}
                                </div>
                            </template>

                            <template #major.name-data="{ row }">
                                <div class="font-medium">
                                    {{ row.major.name }}
                                </div>
                                <UBadge class="mt-1 justify-center" color="gray" variant="subtle">
                                    {{ row.major.faculty.name }}
                                </UBadge>
                            </template>

                            <template #actions-data="{ row }">
                                <div class="text-center">
                                    <UButton label="Mời" variant="soft" color="primary"
                                             :disabled="inviteStudentModal.isSubmitting"
                                             @click="handleInviteStudent(row)" />
                                </div>
                            </template>
                        </UTable>
                    </UCard>
                </div>
            </UCard>
        </form>
    </UModal>
</template>