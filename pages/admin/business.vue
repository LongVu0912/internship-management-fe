<script setup lang="ts">
import type Business from '~/types/business/Business';
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
const businessRepository = BusinessRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const isTableLoading = ref(true);
const businessModal = ref({
    isOpen: false,
    isSendingRequest: false,
})

const overviewModal = ref({
    isOpen: false,
    overview: '',
})

const pageConfig = reactive(new PageConfig());
pageConfig.orders.push(new Order("name"));
pageConfig.filters.push(new Filter("name"));
const sort = ref<any>({
    column: 'name',
    direction: 'desc'
})

const businessList = ref<Business[]>([]);

const newBusiness = ref<Business>({} as Business);
newBusiness.value.managedBy = {} as Profile;

const gender = computed({
    get: () => (newBusiness.value.managedBy.isMale ? 'Nam' : 'Nữ'),
    set: (value: string) => {
        newBusiness.value.managedBy.isMale = (value === 'Nam');
    }
});

// * Lifecycle
onBeforeMount(async () => {
    await fetchTableData();
});

// * Functions
const fetchTableData = async () => {
    isTableLoading.value = true;

    const apiResponse = await businessRepository.getBusinessPaging(pageConfig);

    if (apiResponse.code === 200) {
        businessList.value = apiResponse.result.data;

        pageConfig.update(apiResponse.result.pageConfig);

        isTableLoading.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

const handleCreateNewBusiness = async () => {
    businessModal.value.isSendingRequest = true;
    const apiResponse = await businessRepository.createBusiness(newBusiness.value);

    if (apiResponse.code !== 200) {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
    else {
        nuxtToast({
            description: "Tạo tài khoản thành công",
            type: "success",
        });
        businessModal.value.isOpen = false;
    }

    businessModal.value.isSendingRequest = false;
}

const searchTable = async () => {
    if (pageConfig.currentPage !== 1) {
        pageConfig.currentPage = 1;
    } else {
        fetchTableData();
    }
}

const openOverviewModal = (overview: string) => {
    overviewModal.value.overview = overview;
    overviewModal.value.isOpen = true;
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
        key: "name",
        label: "Tên",
        sortable: true,
    },
    {
        key: "overview",
        label: "Tổng quát",
        sortable: true,
    },
    {
        key: "location",
        label: "Địa điểm",
        sortable: true,
    },
    {
        key: "type",
        label: "Loại",
        sortable: true,
    },
    {
        key: "industry",
        label: "Lĩnh vực",
        sortable: true,
    },
    {
        key: "workingDay",
        label: "Ngày làm việc",
        sortable: true,
    },
    {
        key: "workingHour",
        label: "Giờ làm việc",
        sortable: true,
    },
    {
        key: "managedBy.fullname",
        label: "Quản lý",
        sortable: true,
    },
    {
        key: "actions",
        label: "Hành động"
    }
]

const selectedColumns = ref([...columns]);

const items = (row: any) => [
    [
        {
            label: 'Hồ sơ',
            icon: 'mingcute:profile-line',
            click: () => {
                navigateTo(`/business/${row.businessId}`, {
                    open: {
                        target: '_blank',
                    }
                })
            }
        },
    ],
    [
        {
            label: 'Sửa',
            icon: 'mingcute:edit-4-line',
            click: nuxtToast,
        },
        {
            label: 'Đổi mật khẩu',
            icon: 'mingcute:key-2-line',
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
            <UButton icon="mingcute:add-circle-line" color="primary" @click="businessModal.isOpen = true"
                     label="Thêm công ty" />
        </div>

        <UCard class="w-full" :ui="{
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
            footer: { padding: 'p-4' }
        }">

            <template #header>
                <h1 class="text-center text-xl font-semibold text-gray-900 dark:text-white">
                    Danh sách công ty
                </h1>
            </template>

            <div class="flex flex-col justify-between gap-2 px-4 py-3 md:flex-row">
                <form @submit.prevent="searchTable">
                    <UInput placeholder="Tìm tên công ty..." class="min-w-64" size="sm" color="white"
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

            <UTable class="rounded-lg" :columns="selectedColumns" :loading="isTableLoading" :rows="businessList"
                    sort-mode="manual"
                    v-model:sort="sort">

                <template #name-data="{ row }">
                    <NuxtLink class="font-semibold" :to="`/business/${row.businessId}`"
                              target="_blank">
                        {{ row.name }}
                    </NuxtLink>
                </template>

                <template #overview-data="{ row }">
                    <div @click="openOverviewModal(row.overview)" class="cursor-pointer">
                        {{ row.overview.substring(0, 20) + '...' }}
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

    <UModal :ui="{ width: 'sm:max-w-3xl' }" v-model="businessModal.isOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Tạo tài khoản công ty
                    </h3>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="businessModal.isOpen = false" />
                </div>
            </template>

            <div class="flex flex-col gap-3">
                <div class="text-base font-semibold">THÔNG TIN CÔNG TY</div>

                <div>
                    <div class="font-medium">Tên công ty</div>
                    <UInput v-model="newBusiness.name" placeholder="Công ty ABC" />
                </div>

                <div>
                    <div class="font-medium">Website</div>
                    <UInput v-model="newBusiness.businessWebsite" placeholder="https://business.com" />
                </div>

                <div class="w-full space-y-1">
                    <div class="font-medium">Tổng quan</div>
                    <UTextarea size="lg" color="gray" :rows="5" class="w-full" v-model="newBusiness.overview"
                               placeholder="Công ty chuyên về công nghệ...">
                    </UTextarea>
                </div>

                <div class="flex flex-col gap-4 md:flex-row">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Địa chỉ</div>
                        <UInput v-model="newBusiness.location" placeholder="123 Đường ABC, Quận 1, TP.HCM" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Loại</div>
                        <UInput v-model="newBusiness.type" placeholder="Công ty TNHH" />
                    </div>
                </div>

                <div class="w-full space-y-1">
                    <div class="font-medium">Chuyên ngành</div>
                    <UTextarea size="lg" color="gray" :rows="5" class="w-full" v-model="newBusiness.industry"
                               placeholder="Công nghệ thông tin, Kế toán...">
                    </UTextarea>
                </div>

                <div class="flex flex-col gap-4 md:flex-row">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Ngày làm việc</div>
                        <UInput v-model="newBusiness.workingDay" placeholder="Thứ 2 - Thứ 6" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Giờ làm việc</div>
                        <UInput v-model="newBusiness.workingHour" placeholder="8:00 - 17:00" />
                    </div>
                </div>

                <UDivider size="xs" class="my-2" />

                <div class="text-base font-semibold">TÀI KHOẢN QUẢN LÝ</div>

                <div class="flex flex-col gap-4 md:flex-row">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Họ tên</div>
                        <UInput v-model="newBusiness.managedBy.fullname" placeholder="Nguyễn Văn A" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Tài khoản</div>
                        <UInput v-model="newBusiness.managedBy.username" autocomplete="off"
                                placeholder="nguyenvana" />
                    </div>
                </div>

                <div class="flex flex-col gap-4 md:flex-row">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Mật khẩu</div>
                        <UInput type="password" v-model="newBusiness.managedBy.password" autocomplete="off"
                                placeholder="********" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Email</div>
                        <UInput type="email" v-model="newBusiness.managedBy.email"
                                placeholder="email@example.com" />
                    </div>
                </div>

                <div class="flex flex-col gap-4 md:flex-row">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Số điện thoại</div>
                        <UInput v-model="newBusiness.managedBy.phoneNumber" placeholder="0123456789" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Giới tính</div>
                        <USelect color="gray" size="md" :options="['Nữ', 'Nam']" v-model:model-value="gender"
                                 placeholder="Chọn giới tính" />
                    </div>
                </div>

                <div class="w-full space-y-1">
                    <div class="font-medium">Bio</div>
                    <UTextarea size="lg" color="gray" :rows="5" class="w-full" v-model="newBusiness.managedBy.bio"
                               placeholder="Giới thiệu ngắn về bản thân...">
                    </UTextarea>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end">
                    <UButton class="mr-2" color="gray" variant="ghost" @click="businessModal.isOpen = false">
                        Huỷ
                    </UButton>
                    <UButton color="primary" @click="handleCreateNewBusiness" :loading="businessModal.isSendingRequest">
                        Tạo
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>

    <UModal v-model="overviewModal.isOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-base font-semibold">
                        Tổng quát
                    </div>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="overviewModal.isOpen = false" />
                </div>
            </template>

            <div class="py-2">
                {{ overviewModal.overview }}
            </div>
        </UCard>
    </UModal>
</template>