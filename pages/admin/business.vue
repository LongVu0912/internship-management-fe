<script setup lang="ts">
import type Business from '~/types/business/Business';
import type Profile from '~/types/profile/Profile';

definePageMeta({
    layout: "admin",
    middleware: 'admin',
});
// * Imports
const { $apiToken } = useNuxtApp();
const adminRepository = AdminRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const isPageLoading = ref(true);
const isCreatingBusiness = ref(false);
const newBusiness = ref<Business>({
    name: '',
    overview: '',
    location: '',
    type: '',
    industry: '',
    workingDay: '',
    workingHour: '',
    instructorId: '',
    managedBy: {} as Profile,
});

const gender = computed({
    get: () => (newBusiness.value.managedBy.isMale ? 'Nam' : 'Nữ'),
    set: (value: string) => {
        newBusiness.value.managedBy.isMale = (value === 'Nam');
    }
});

// * Lifecycle
onBeforeMount(async () => {
    isPageLoading.value = false;
});

// * Functions
const onCreateNewBusiness = async () => {
    const apiResponse = await adminRepository.createBusiness(newBusiness.value);

    if (apiResponse.code === 200) {
        nuxtToast({
            description: "Tạo tài khoản thành công",
            type: "success",
        });
        isCreatingBusiness.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

</script>

<template>
    <Loading v-if="isPageLoading" />
    <div v-else class="flex flex-col gap-2">
        <div v-if="!isCreatingBusiness" class="flex flex-col justify-between gap-2 md:flex-row">
            <div class="flex flex-col gap-2 md:flex-row">
                <UInput placeholder="Tìm tên công ty..."
                        class="w-64"
                        size="sm"
                        :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
                    <template #trailing>
                        <UButton icon="heroicons:magnifying-glass-16-solid" color="primary"
                                 class="-me-2.5 rounded-none rounded-r-md" type="submit" />
                    </template>
                </UInput>
            </div>
            <div>
                <UButton color="primary" @click="isCreatingBusiness = true">Tạo công ty</UButton>
            </div>
        </div>

        <div v-else>
            <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                            Tạo tài khoản công ty
                        </div>
                    </div>
                </template>

                <div class="flex flex-col gap-3">
                    <div class="text-base font-semibold">THÔNG TIN CÔNG TY</div>

                    <div>
                        <div class="font-medium">Tên công ty</div>
                        <UInput color="white" v-model="newBusiness.name" />
                    </div>

                    <div>
                        <div class="font-medium">Tổng quan</div>
                        <UTextarea size="lg" color="white" :rows="3" class="w-full" v-model="newBusiness.overview">
                        </UTextarea>
                    </div>

                    <div class="flex flex-row justify-between gap-2">
                        <div class="flex w-full flex-col gap-1.5">
                            <div class="font-medium">Địa chỉ</div>
                            <UInput color="white" v-model="newBusiness.location" />
                        </div>
                        <div class="flex w-full flex-col gap-1.5">
                            <div class="font-medium">Loại</div>
                            <UInput color="white" v-model="newBusiness.type" />
                        </div>
                    </div>

                    <div>
                        <div class="font-medium">Chuyên ngành</div>
                        <UTextarea size="lg" color="white" :rows="3" class="w-full" v-model="newBusiness.industry">
                        </UTextarea>
                    </div>

                    <div class="flex flex-row justify-between gap-2">
                        <div class="flex w-full flex-col gap-1.5">
                            <div class="font-medium">Ngày làm việc</div>
                            <UInput color="white" v-model="newBusiness.workingDay" />
                        </div>
                        <div class="flex w-full flex-col gap-1.5">
                            <div class="font-medium">Giờ làm việc</div>
                            <UInput color="white" v-model="newBusiness.workingHour" />
                        </div>
                    </div>

                    <UDivider label="" size="xs" class="my-4" />

                    <div class="text-base font-semibold">TÀI KHOẢN QUẢN LÝ</div>

                    <div class="flex flex-row justify-between gap-2">
                        <div class="flex w-full flex-col gap-1.5">
                            <div class="font-medium">Họ tên</div>
                            <UInput color="white" v-model="newBusiness.managedBy.fullname" />
                        </div>
                        <div class="flex w-full flex-col gap-1.5">
                            <div class="font-medium">Tài khoản</div>
                            <UInput color="white" v-model="newBusiness.managedBy.username" />
                        </div>
                    </div>

                    <div class="flex flex-row justify-between gap-2">
                        <div class="flex w-full flex-col gap-1.5">
                            <div class="font-medium">Mật khẩu</div>
                            <UInput color="white" type="password" v-model="newBusiness.managedBy.password" />
                        </div>
                        <div class="flex w-full flex-col gap-1.5">
                            <div class="font-medium">Email</div>
                            <UInput color="white" type="email" v-model="newBusiness.managedBy.email" />
                        </div>
                    </div>

                    <div class="flex flex-row justify-between gap-2">
                        <div class="flex w-full flex-col gap-1.5">
                            <div class="font-medium">Số điện thoại</div>
                            <UInput color="white" v-model="newBusiness.managedBy.phoneNumber" />
                        </div>
                        <div class="flex w-full flex-col gap-1.5">
                            <div class="font-medium">Giới tính</div>
                            <USelect size="md" :options="['Nữ', 'Nam']" v-model:model-value="gender" />
                        </div>
                    </div>

                    <div>
                        <div class="font-medium">Bio</div>
                        <UTextarea size="lg" color="white" :rows="3" class="w-full" v-model="newBusiness.managedBy.bio">
                        </UTextarea>
                    </div>
                </div>

                <template #footer>
                    <div class="flex justify-end">
                        <UButton class="mr-2" color="gray" variant="ghost" @click="isCreatingBusiness = false">
                            Huỷ
                        </UButton>
                        <UButton color="primary" @click="onCreateNewBusiness">
                            Tạo
                        </UButton>
                    </div>
                </template>
            </UCard>
        </div>
    </div>
</template>