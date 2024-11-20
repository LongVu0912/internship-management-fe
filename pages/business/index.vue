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
const imageUrl = useRuntimeConfig().public.imageUrl;

// * Refs
const isPageLoading = ref(true);
const business = ref<Business>({
    managedBy: {} as Profile,
} as Business);

const updateModal = ref({
    isOpen: false,
    isSubmitting: false,
})

const avatarModal = ref({
    isOpen: false,
    isSubmitting: false,
    imageFile: null as File | null,
})

const gender = computed({
    get: () => (business.value.managedBy.isMale ? 'Nam' : 'Nữ'),
    set: (value: string) => {
        business.value.managedBy.isMale = (value === 'Nam');
    }
});

// * Lifecycle
onBeforeMount(async () => {
    fetchData();
})

// * Functions
const fetchData = async () => {
    isPageLoading.value = true;
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

const closeUploadAvatarModal = () => {
    avatarModal.value.imageFile = null;
    avatarModal.value.isOpen = false;
}

const handleInputImageFile = (event: any) => {
    if (event && event.length > 0) {
        avatarModal.value.imageFile = event[0];
    } else {
        avatarModal.value.imageFile = null;
    }
};

const handleUploadAvatar = async () => {
    avatarModal.value.isSubmitting = true;

    if (avatarModal.value.imageFile == null) {
        nuxtToast({
            description: "Hãy chọn file ảnh"
        })
        avatarModal.value.isSubmitting = false;
        return;
    }

    const apiResponse = await businessRepository.uploadImage({
        image: avatarModal.value.imageFile,
    });

    if (apiResponse.code === 200) {
        nuxtToast({
            description: "Cập nhật avatar thành công",
            type: "success",
        });
        fetchData();
        avatarModal.value.isOpen = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }

    avatarModal.value.isSubmitting = false;
}
</script>

<template>
    <div v-if="isPageLoading">
        <Loading />
    </div>
    <UCard v-else class="w-full shadow-md">
        <template #header>
            <div class="flex flex-row items-center gap-4">
                <div class="flex shrink-0 items-center">
                    <UAvatar
                             imgClass="object-cover"
                             size="2xl"
                             :src="imageUrl + business.businessImage"
                             icon="mingcute:user-4-line" />
                </div>
                <div class="flex flex-col gap-1">
                    <div class="text-xl font-bold">
                        {{ business?.name }}
                    </div>
                    <div>
                        <UButton color="primary" variant="soft" icon="mingcute:photo-album-line"
                                 @click="avatarModal.isOpen = true" />
                    </div>
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
                            <UBadge variant="subtle">{{ business?.managedBy.isMale ? "Nam" : "Nữ" }}</UBadge>
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
        <form @submit.prevent="handleUpdateProfile">
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
                        <UInput required v-model="business.name" />
                    </div>
                    <div class="space-y-1">
                        <div class="font-medium">Địa điểm</div>
                        <UInput required v-model="business.location" />
                    </div>
                    <div class="space-y-1">
                        <div class="font-medium">Website</div>
                        <UInput required v-model="business.businessWebsite" />
                    </div>
                    <div class="space-y-1">
                        <div class="font-medium">Ngành</div>
                        <UInput required v-model="business.industry" />
                    </div>
                    <div class="flex flex-col gap-4 md:flex-row">
                        <div class="w-full space-y-1">
                            <div class="font-medium">Ngày làm việc</div>
                            <UInput required v-model="business.workingDay" />
                        </div>
                        <div class="w-full space-y-1">
                            <div class="font-medium">Giờ làm việc</div>
                            <UInput required v-model="business.workingHour" />
                        </div>
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Tổng quát</div>
                        <UTextarea required size="lg" color="gray" :rows="5" class="w-full" v-model="business.overview">
                        </UTextarea>
                    </div>
                    <UDivider size="xs" class="my-2" />
                    <div class="text-base font-semibold">TÀI KHOẢN QUẢN LÝ</div>
                    <div class="flex flex-col gap-4 md:flex-row">
                        <div class="w-full space-y-1">
                            <div class="font-medium">Số điện thoại</div>
                            <UInput required v-model="business.managedBy.phoneNumber" />
                        </div>
                        <div class="w-full space-y-1">
                            <div class="font-medium">Giới tính</div>
                            <USelect color="gray" size="md" :options="['Nữ', 'Nam']" v-model:model-value="gender" />
                        </div>
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Bio</div>
                        <UTextarea required size="lg" color="gray" :rows="5" class="w-full"
                                   v-model="business.managedBy.bio">
                        </UTextarea>
                    </div>
                </div>
                <template #footer>
                    <div class="flex justify-end">
                        <UButton class="mr-2" color="gray" variant="ghost" @click="updateModal.isOpen = false">
                            Huỷ
                        </UButton>
                        <UButton color="primary" type="submit" :loading="updateModal.isSubmitting">
                            Cập nhật
                        </UButton>
                    </div>
                </template>
            </UCard>
        </form>
    </UModal>

    <UModal v-model="avatarModal.isOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-base font-semibold">
                        Cập nhật ảnh đại diện
                    </div>
                    <UButton :disabled="avatarModal.isSubmitting" color="gray" variant="ghost"
                             icon="mingcute:close-fill" class="-my-1"
                             @click="closeUploadAvatarModal" />
                </div>
            </template>
            <div>
                <UInput :disabled="avatarModal.isSubmitting" type="file" size="sm" icon="mingcute:photo-album-line"
                        accept=".png, .jpg" @change="handleInputImageFile" />
            </div>

            <template #footer>
                <UButton class="w-full rounded-md" size="lg" block @click="handleUploadAvatar" color="primary"
                         :loading="avatarModal.isSubmitting">
                    Cập nhật
                </UButton>
            </template>
        </UCard>
    </UModal>
</template>