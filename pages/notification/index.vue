<script setup lang="ts">
import { Order } from '~/types/page_config/Order';
import { PageConfig } from '~/types/page_config/PageConfig';
import type Notification from '~/types/notification/Notification';

definePageMeta({
    layout: "home",
    middleware: "logged",
});

// * Imports
const nuxtToast = useNuxtToast();
const { $apiToken } = useNuxtApp();
const notificationRepository = NotificationRepository($apiToken);
const appUtils = AppUtils();

const pageConfig = reactive(new PageConfig());
pageConfig.orders.push(new Order("dateCreated"));
const notificationList = ref<Notification[]>([]);

// * Refs
const isTableLoading = ref(false);

const notificationModal = ref({
    isOpen: false,
    content: '',
    path: '',
})

const sort = ref<any>({
    column: 'dateCreated',
    direction: 'desc'
})

onBeforeMount(() => {
    fetchTableData();
})

const fetchTableData = async () => {
    isTableLoading.value = true;
    const apiResponse = await notificationRepository.getUserNotificationPaging(pageConfig);

    if (apiResponse.code === 200) {
        notificationList.value = apiResponse.result.data;

        pageConfig.update(apiResponse.result.pageConfig);

        isTableLoading.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

const openNotificationModal = async (notification: Notification) => {
    if (!notification.read) {
        await notificationRepository.markAsRead({
            notificationId: notification.notificationId,
        });
        useUserState().value.quantityOfNotifications = await notificationRepository.getQuantityOfNotification();
        fetchTableData();
    }

    notificationModal.value.content = notification.content;
    notificationModal.value.path = notification.path;
    notificationModal.value.isOpen = true;
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
        key: "title",
        label: "Tựa đề",
    },
    {
        key: "dateCreated",
        label: "Ngày",
        sortable: true,
    },
]
</script>

<template>

    <Head>
        <Title>Thông báo</Title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
    </Head>
    <div class="flex flex-col items-center">
        <UCard class="w-full shadow-md md:w-4/5 lg:w-3/4" :ui="{
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
            footer: { padding: 'p-4' }
        }">

            <template #header>
                <h1 class="text-center text-xl font-semibold text-gray-900 dark:text-white">
                    Thông báo
                </h1>
            </template>

            <div class="flex flex-col justify-end gap-2 px-4 py-3 md:flex-row">
                <div class="flex flex-col gap-2 md:flex-row">
                    <USelectMenu v-model.number="pageConfig.pageSize" :options="['5', '6', '7', '8', '9', '10']"
                                 icon="mingcute:rows-3-line" :placeholder="pageConfig.pageSize.toString()">
                    </USelectMenu>
                    <UPagination :max="7" v-model="pageConfig.currentPage" :page-count="pageConfig.pageSize"
                                 :total="pageConfig.totalRecords" :disabled="isTableLoading" />
                </div>
            </div>

            <UTable class="rounded-lg" :columns="columns" :loading="isTableLoading" :rows="notificationList"
                    sort-mode="manual"
                    v-model:sort="sort">

                <template #title-data="{ row }">
                    <p class="cursor-pointer text-base" @click="openNotificationModal(row)"
                       :class="[row.read ? 'font-normal' : 'font-bold']">
                        {{ row.title }}
                    </p>
                </template>

                <template #dateCreated-data="{ row }">
                    <p class="class=" text-base>
                        {{ appUtils.convertDateToString(row.dateCreated) }}
                    </p>
                </template>
            </UTable>
        </UCard>
    </div>

    <UModal v-model="notificationModal.isOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-base font-semibold">
                        Thông báo
                    </div>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="notificationModal.isOpen = false" />
                </div>
            </template>

            <div class="py-2">
                <NewLineText :text="notificationModal.content" />
                <UButton v-if="notificationModal.path != null" size="lg" color="primary" variant="link" target="_blank"
                         :padded="false" :to="notificationModal.path" label="Chi tiết" />
            </div>
        </UCard>
    </UModal>
</template>