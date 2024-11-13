<script setup lang="ts">
import type Business from '~/types/business/Business';
import type Profile from '~/types/profile/Profile';

definePageMeta({
    layout: 'business',
    middleware: 'business',
})

// * Imports
const { $apiToken } = useNuxtApp();
const businessRepository = BusinessRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const isPageLoading = ref(true);
const business = ref<Business>({
    managedBy: {} as Profile,
} as Business);

const updateModal = ref({
    isOpen: false,
    isSubmitting: false,
})

const gender = computed({
    get: () => (business.value.managedBy.isMale ? 'Nam' : 'Nữ'),
    set: (value: string) => {
        business.value.managedBy.isMale = (value === 'Nam');
    }
});

// * Lifecycle
onBeforeMount(() => {
    fetchData();
})

// * Functions
const fetchData = async () => {
    const apiResponse = await businessRepository.getMyBusinessData();

    if (apiResponse.code !== 200) {
        showError({
            statusCode: 404,
            statusMessage: "Page not found",
        })
    }

    business.value = apiResponse.result;

    isPageLoading.value = false;
}

const handleUpdateProfile = async () => {
    updateModal.value.isSubmitting = true;
    const apiResponse = await businessRepository.updateProfile(business.value);

    if (apiResponse.code !== 200) {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
    else {
        nuxtToast({
            description: 'Cập nhật thông tin thành công',
            type: 'success',
        });
        fetchData();
        updateModal.value.isOpen = false;
    }

    updateModal.value.isSubmitting = false;
}
</script>

<template>
    <div v-if="isPageLoading">
        <Loading />
    </div>
    <UCard v-else class="w-full shadow-md">
        <template #header>
            <div class="flex flex-row items-center gap-4">
                <div class="shrink-0">
                    <UAvatar
                             size="xl"
                             :alt="business?.name" />
                </div>
                <div class="text-xl font-bold">
                    {{ business?.name }}
                </div>
            </div>
        </template>
        <div class="flex flex-col gap-4 py-2">
            <div class="flex w-full flex-col justify-between gap-4 md:flex-row">
                <div class="flex flex-col gap-4 md:w-1/2">
                    <div class="text-xl font-bold leading-6">
                        Tổng quan
                    </div>
                    <div class="flex flex-col gap-4">
                        <div class="flex flex-row items-center gap-2">
                            <UIcon name="mingcute:location-3-line" class="h-6 w-6 flex-shrink-0" />
                            <div class="flex flex-col">
                                <div class="font-bold">Địa điểm</div>
                                <div>{{ business?.location }}</div>
                            </div>
                        </div>
                        <div class="flex flex-row items-center gap-2">
                            <UIcon name="mingcute:profile-line" class="h-6 w-6 flex-shrink-0" />
                            <div class="flex flex-col">
                                <div class="font-bold">Loại</div>
                                <div>{{ business?.type }}</div>
                            </div>
                        </div>
                        <div class="flex flex-row items-center gap-2">
                            <UIcon name="mingcute:book-3-line" class="h-6 w-6 flex-shrink-0" />
                            <div class="flex flex-col">
                                <div class="font-bold">Ngành</div>
                                <div>{{ business?.industry }}</div>
                            </div>
                        </div>
                        <div class="flex flex-row items-center gap-2">
                            <UIcon name="mingcute:calendar-2-line" class="h-6 w-6 flex-shrink-0" />
                            <div class="flex flex-col">
                                <div class="font-bold">Ngày làm việc</div>
                                <div>{{ business?.workingDay }}</div>
                            </div>
                        </div>
                        <div class="flex flex-row items-center gap-2">
                            <UIcon name="mingcute:time-line" class="h-6 w-6 flex-shrink-0" />
                            <div class="flex flex-col">
                                <div class="font-bold">Giờ làm việc</div>
                                <div>{{ business?.workingHour }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-4 rounded-lg bg-gray-500/5 p-4 md:w-1/2">
                    <div class="text-xl font-bold leading-9">
                        Người quản lý
                    </div>
                    <div>
                        <div class="flex flex-row items-center gap-2">
                            <UIcon name="mingcute:user-2-line" class="h-6 w-6 flex-shrink-0" />
                            <div>{{ business?.managedBy.fullname }}</div>
                            <UBadge variant="outline">{{ business?.managedBy.isMale ? "Nam" : "Nữ" }}</UBadge>
                        </div>
                    </div>
                    <UDivider size="xs" />
                    <div class="flex flex-row items-center gap-2">
                        <UIcon name="mingcute:phone-line" class="h-6 w-6 flex-shrink-0" />
                        <div>{{ business?.managedBy.phoneNumber }}</div>
                    </div>
                    <div class="flex flex-row items-center gap-2">
                        <UIcon name="mingcute:mail-line" class="h-6 w-6 flex-shrink-0" />
                        <div>{{ business?.managedBy.email }}</div>
                    </div>
                    <div class="flex flex-row items-center gap-2">
                        <UIcon name="mingcute:webhook-line" class="h-6 w-6 flex-shrink-0" />
                        <div>{{ business?.businessWebsite }}</div>
                    </div>
                    <UDivider size="xs" />
                    <div class="text-xl font-bold leading-6">
                        Bio
                    </div>
                    <NewLineText :text="business?.managedBy.bio" />
                </div>
            </div>
            <UDivider size="xs" />
            <div class="text-xl font-bold leading-6">
                Giới thiệu
            </div>
            <NewLineText :text="business?.overview" />
        </div>

        <template #footer>
            <div class="flex justify-end">
                <UButton label="Cập nhật" color="primary" @click="updateModal.isOpen = true" />
            </div>
        </template>
    </UCard>

    <UModal :ui="{ width: 'sm:max-w-3xl' }" v-model="updateModal.isOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-base font-semibold">
                        Cập nhật thông tin
                    </div>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="updateModal.isOpen = false" />
                </div>
            </template>

            <div class="flex flex-col gap-3">
                <div class="text-base font-bold">THÔNG TIN CÔNG TY</div>

                <div class="space-y-1">
                    <div class="font-medium">Tên công ty</div>
                    <UInput v-model="business.name" />
                </div>

                <div class="space-y-1">
                    <div class="font-medium">Địa điểm</div>
                    <UInput v-model="business.location" />
                </div>

                <div class="space-y-1">
                    <div class="font-medium">Website</div>
                    <UInput v-model="business.businessWebsite" />
                </div>

                <div class="flex flex-col gap-4 md:flex-row">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Loại</div>
                        <UInput v-model="business.type" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Ngành</div>
                        <UInput v-model="business.industry" />
                    </div>
                </div>

                <div class="flex flex-col gap-4 md:flex-row">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Ngày làm việc</div>
                        <UInput v-model="business.workingDay" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Giờ làm việc</div>
                        <UInput v-model="business.workingHour" />
                    </div>
                </div>

                <div class="w-full space-y-1">
                    <div class="font-medium">Tổng quát</div>
                    <UTextarea size="lg" color="gray" :rows="5" class="w-full" v-model="business.overview">
                    </UTextarea>
                </div>

                <UDivider size="xs" class="my-2" />

                <div class="text-base font-semibold">TÀI KHOẢN QUẢN LÝ</div>

                <div class="flex flex-col gap-4 md:flex-row">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Số điện thoại</div>
                        <UInput v-model="business.managedBy.phoneNumber" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Giới tính</div>
                        <USelect color="gray" size="md" :options="['Nữ', 'Nam']" v-model:model-value="gender" />
                    </div>
                </div>

                <div class="w-full space-y-1">
                    <div class="font-medium">Bio</div>
                    <UTextarea size="lg" color="gray" :rows="5" class="w-full" v-model="business.managedBy.bio">
                    </UTextarea>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end">
                    <UButton class="mr-2" color="gray" variant="ghost" @click="updateModal.isOpen = false">
                        Huỷ
                    </UButton>
                    <UButton color="primary" @click="handleUpdateProfile" :loading="updateModal.isSubmitting">
                        Cập nhật
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>