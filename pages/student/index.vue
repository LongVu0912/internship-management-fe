<script setup lang="ts">
definePageMeta({
    layout: "student",
});

const { $api } = useNuxtApp();
const userRepository = UserRepository($api);
const nuxtToast = useNuxtToast();

const isModalOpen = ref(false);
const isLoading = ref(false);

const state = reactive({
    oldPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined
});

const submitChangePassword = async () => {
    if (!state.oldPassword || !state.newPassword || !state.confirmPassword) {
        nuxtToast({
            description: "Hãy nhập đầy đủ thông tin",
            type: "info",
        });
        return;
    }

    if (state.newPassword !== state.confirmPassword) {
        nuxtToast({
            description: "Mật khẩu xác nhận không khớp",
            type: "error",
        });
        return;
    }

    if (state.oldPassword == state.newPassword) {
        nuxtToast({
            description: "Mật khẩu mới không được trùng với mật khẩu cũ",
            type: "error",
        });
        return;
    }

    isLoading.value = true;

    const apiResponse = await userRepository.changePassword({
        oldPassword: state.oldPassword,
        newPassword: state.newPassword,
    });

    if (apiResponse.code === 200) {
        nuxtToast({
            description: apiResponse.message,
            type: "success",
        });
        isModalOpen.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
    isLoading.value = false;
};

</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="text-xl font-medium">
            Tài khoản
        </div>
        <div class="text-sm font-normal">
            Thông tin tài khoản của bạn
        </div>
        <div class="flex flex-row items-center">
            <div>
                <UAvatar
                         size="lg"
                         src="/avatar.png"
                         alt="Avatar" />
            </div>
            <div class="ml-4 flex flex-col justify-center gap-1">
                <div class="flex flex-col gap-2">
                    <div>
                        <UBadge
                                size="md"
                                color="gray"
                                label="21110113" />
                    </div>
                    <div class="flex gap-2">
                        <UBadge
                                size="md"
                                color="green"
                                variant="outline"
                                label="Đang tìm việc" />
                        <UBadge
                                size="md"
                                color="red"
                                variant="outline"
                                label="Không tìm việc" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <UDivider label="" size="xs" class="my-4" />

    <div class="flex flex-col gap-2">
        <div class="text-xl font-semibold">
            Thông tin cá nhân
        </div>
        <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
                <UIcon name="mingcute:user-4-line" class="h-6 w-6" />
                <UBadge
                        size="md"
                        color="gray"
                        label="Hoàng Long Vũ" />
            </div>
            <div class="flex items-center gap-2">
                <UIcon name="mingcute:birthday-2-line" class="h-6 w-6" />
                <UBadge
                        size="md"
                        color="gray"
                        label="22/12/2003" />
            </div>
            <div class="flex items-center gap-2">
                <UIcon name="mingcute:mail-line" class="h-6 w-6" />
                <UBadge
                        size="md"
                        color="gray"
                        label="21110113@student.hcmute.edu.vn" />
            </div>
            <div class="flex items-center gap-2">
                <UIcon name="mingcute:phone-line" class="h-6 w-6" />
                <UBadge
                        size="md"
                        color="gray"
                        label="0987654321" />
            </div>
        </div>
    </div>

    <UDivider label="" size="xs" class="my-4" />

    <div class="flex flex-col gap-2">
        <div class="text-xl font-medium">
            Bio
        </div>
        <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
                <UIcon name="mingcute:school-line" class="h-6 w-6" />
                <UBadge
                        size="md"
                        color="gray"
                        label="2021" />
            </div>
            <div class="flex items-center gap-2">
                <UIcon name="mingcute:book-3-line" class="h-6 w-6" />
                <UBadge
                        size="md"
                        color="gray"
                        label="Công nghệ thông tin" />
            </div>
            <div class="text-justify text-sm font-normal">
                I am a dedicated software developer with expertise in Java, Spring Boot, and Vue.js. I specialize in
                designing, coding, and maintaining robust software applications. My experience includes developing
                efficient
                backend systems, creating dynamic front-end interfaces, and ensuring seamless database connections.
                I am
                passionate about solving complex problems and continuously improving my skills to deliver
                high-quality
                software solutions.
            </div>
        </div>
    </div>
    <UDivider label="" size="xs" class="my-4" />

    <div class="flex flex-col items-start gap-2">
        <div class="text-lg font-medium">
            CV
        </div>
        <ULink
               to=""
               active-class="text-primary"
               inactive-class="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200">
            21110113_HoangLongVu_CV.pdf
        </ULink>
    </div>

    <UDivider label="" size="xs" class="my-4" />

    <div class="flex flex-row justify-between gap-2">
        <div></div>
        <div class="flex gap-2">
            <UButton color="primary" variant="outline" @click="isModalOpen = true">Đổi mật khẩu</UButton>
            <UButton color="primary">Cập nhật</UButton>
        </div>
    </div>

    <UModal v-model="isModalOpen" prevent-close>
        <UCard
               :ui="{ body: { padding: 'px-4 pb-4 lg:px-8 lg:pb-8' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', strategy: 'override' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Quên mật khẩu
                    </h3>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="isModalOpen = false" />
                </div>
            </template>
            <div>
                <form class="flex w-full flex-col justify-start" :state="state" @submit.prevent="submitChangePassword">
                    <div class="mb-2 mt-4 text-sm font-medium">Mật khẩu cũ</div>
                    <UInput v-model="state.oldPassword" type="password" icon="mingcute:user-4-line" size="lg"
                            color="primary"
                            autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Mật khẩu mới</div>
                    <UInput v-model="state.newPassword" type="password" icon="mingcute:mail-line" size="lg"
                            color="primary"
                            autocomplete="on" />
                    <div class="mb-2 mt-4 text-sm font-medium">Xác nhận mật khẩu</div>
                    <UInput v-model="state.confirmPassword" type="password" icon="mingcute:mail-line" size="lg"
                            color="primary"
                            autocomplete="on" />
                    <UButton :loading="isLoading" class="mt-6 w-full rounded-md" size="lg" type="submit" block>
                        Đổi mật khẩu
                    </UButton>
                </form>
            </div>
        </UCard>
    </UModal>
</template>