<script setup lang="ts">
import type Faculty from '~/types/faculty/Faculty';
import type Instructor from '~/types/instructor/Instructor';
import { Filter } from '~/types/page_config/Filter';
import { Order } from '~/types/page_config/Order';
import { PageConfig } from '~/types/page_config/PageConfig';
import type Profile from '~/types/profile/Profile';

definePageMeta({
    layout: "admin",
    middleware: 'admin',
});

// * Imports
const { $apiToken } = useNuxtApp();
const instructorRepository = InstructorRepository($apiToken);
const facultyRepository = FacultyRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const isTableLoading = ref(false);

const adminChangePasswordModal = ref({
    isOpen: false,
    profileId: '',
})

const sort = ref<any>({
    column: 'profile.fullname',
    direction: 'desc'
})

const pageConfig = reactive(new PageConfig());
pageConfig.orders.push(new Order("profile.fullname"));
pageConfig.filters.push(new Filter("profile.fullname"));
const instructorList = ref<Instructor[]>([]);

// * For creating new instructor
const createInstructorModal = ref({
    isOpen: false,
    isCreatingInstructor: false
})

const newInstructor = ref<Instructor>({
    profile: {} as Profile
} as Instructor);

const selectedFaculty = ref<Faculty>();
const facultyList = ref<Faculty[]>([]);

const facultyPageConfig = reactive(new PageConfig());
facultyPageConfig.pageSize = -1;

const gender = computed({
    get: () => (newInstructor.value.profile.isMale ? 'Nam' : 'Nữ'),
    set: (value: string) => {
        newInstructor.value.profile.isMale = (value === 'Nam');
    }
});

// * Lifecycle
onBeforeMount(async () => {
    await fetchTableData();
});

// * Functions
const fetchTableData = async () => {
    isTableLoading.value = true;

    const apiResponse = await instructorRepository.getInstructorPaging(pageConfig);

    if (apiResponse.code === 200) {
        instructorList.value = apiResponse.result.data;

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

const openCreateInstructorModal = async () => {
    await fetchFaculties();

    createInstructorModal.value.isOpen = true;
}

const fetchFaculties = async () => {
    const apiResponse = await facultyRepository.getFacultyPaging(facultyPageConfig);

    if (apiResponse.code === 200) {
        facultyList.value = apiResponse.result.data;

        facultyPageConfig.update(apiResponse.result.pageConfig);

        isTableLoading.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

const handleCreateInstructor = async () => {
    createInstructorModal.value.isCreatingInstructor = true;
    newInstructor.value.facultyId = selectedFaculty.value?.facultyId;

    const apiResponse = await instructorRepository.createInstructor(newInstructor.value);

    if (apiResponse.code !== 200) {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
    else {
        nuxtToast({
            description: "Tạo khoa thành công",
            type: "success",
        });
        createInstructorModal.value.isOpen = false;
    }

    fetchTableData();
    createInstructorModal.value.isCreatingInstructor = false;
}

const openAdminChangePasswordModal = (row: Instructor) => {
    adminChangePasswordModal.value.profileId = row.profile.profileId;
    adminChangePasswordModal.value.isOpen = true;
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
        key: 'profile.fullname',
        label: 'Họ tên',
        sortable: true,
    },
    {
        key: 'profile.email',
        label: 'Email',
        sortable: true,
    },
    {
        key: 'profile.phoneNumber',
        label: 'Số điện thoại',
        sortable: true,
    },
    {
        key: 'actions',
        label: "Hành động"
    }
]

const selectedColumns = ref([...columns]);

const items = (row: Instructor) => [
    [
        {
            label: 'Chi tiết',
            icon: 'mingcute:profile-line',
            click: nuxtToast,
        },
        {
            label: 'Đổi mật khẩu',
            icon: 'mingcute:key-2-line',
            click: () => {
                openAdminChangePasswordModal(row);
            },
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
            <UButton icon="mingcute:add-circle-line" @click="openCreateInstructorModal" color="primary"
                     label="Thêm giảng viên" />
        </div>
        <UCard class="w-full" :ui="{
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
            footer: { padding: 'p-4' }
        }">

            <template #header>
                <h1 class="text-center text-xl font-semibold text-gray-900 dark:text-white">
                    Danh sách giảng viên
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

            <UTable class="rounded-lg" :columns="selectedColumns" :loading="isTableLoading" :rows="instructorList"
                    sort-mode="manual" v-model:sort="sort">

                <template #profile.fullname-data="{ row }">
                    <div class="flex flex-col">
                        <NuxtLink class="font-semibold" :to="`/instructor/${row.instructorId}`"
                                  target="_blank">
                            {{ row.profile.fullname }}
                        </NuxtLink>
                        <UBadge class="mt-1 w-10 justify-center" color="gray" variant="subtle">
                            {{ row.profile.isMale ? "Nam" : "Nữ" }}
                        </UBadge>
                    </div>
                </template>

                <template #profile.email-data="{ row }">
                    <div class="font-medium">
                        {{ row.profile.email }}
                    </div>
                    <UBadge class="mt-1 w-10 justify-center" color="primary" variant="subtle">
                        {{ row.faculty.facultyId }}
                    </UBadge>
                </template>

                <template #profile.phoneNumber-data="{ row }">
                    <div class="font-medium">
                        {{ row.profile.phoneNumber }}
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

    <UModal :ui="{ width: 'sm:max-w-3xl' }" v-model="createInstructorModal.isOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Tạo giảng viên
                    </h3>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="createInstructorModal.isOpen = false" />
                </div>
            </template>

            <div class="flex flex-col gap-3">
                <div>
                    <div class="font-medium">Khoa</div>
                    <USelectMenu v-model="selectedFaculty" size="md" color="gray" :options="facultyList">
                        <template #label>
                            <div>
                                {{ (selectedFaculty) ? `${selectedFaculty.facultyId} - ${selectedFaculty.name}` : "Chọn khoa" }}
                            </div>
                        </template>
                        <template #option="{ option: faculty }">
                            <div>{{ faculty.facultyId + ' - ' + faculty.name }}</div>
                        </template>
                    </USelectMenu>
                </div>

                <div class="flex flex-col gap-4 md:flex-row">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Họ tên</div>
                        <UInput v-model="newInstructor.profile.fullname" placeholder="Nguyễn Văn A" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Tài khoản</div>
                        <UInput v-model="newInstructor.profile.username" placeholder="nguyenvana" autocomplete="off" />
                    </div>
                </div>

                <div class="flex flex-col gap-4 md:flex-row">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Mật khẩu</div>
                        <UInput type="password" v-model="newInstructor.profile.password" autocomplete="off" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Email</div>
                        <UInput type="email" v-model="newInstructor.profile.email"
                                placeholder="nguyenvana@hcmute.edu.vn" />
                    </div>
                </div>

                <div class="flex flex-col gap-4 md:flex-row">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Số điện thoại</div>
                        <UInput v-model="newInstructor.profile.phoneNumber" placeholder="09999999999" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Giới tính</div>
                        <USelect color="gray" size="md" :options="['Nữ', 'Nam']" v-model:model-value="gender" />
                    </div>
                </div>

                <div class="w-full space-y-1">
                    <div class="font-medium">Bio</div>
                    <UTextarea size="lg" color="gray" :rows="5" class="w-full" v-model="newInstructor.profile.bio"
                               placeholder="Giới thiệu ngắn về bản thân...">
                    </UTextarea>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end">
                    <UButton class="mr-2" color="gray" variant="ghost" @click="createInstructorModal.isOpen = false">
                        Huỷ
                    </UButton>
                    <UButton color="primary"
                             @click="handleCreateInstructor"
                             :loading="createInstructorModal.isCreatingInstructor">
                        Tạo
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>

    <AdminChangePassword @hideModal="adminChangePasswordModal.isOpen = false"
                         :profileId="adminChangePasswordModal.profileId" :isOpen="adminChangePasswordModal.isOpen" />
</template>