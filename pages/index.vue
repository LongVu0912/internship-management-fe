<script setup lang="ts">
import { PageConfig } from '~/types/page_config/PageConfig';
import type Recruitment from '~/types/recruitment/Recruitment';

definePageMeta({
    layout: "home",
});

const cvUtils = CVUtils();
const { $api } = useNuxtApp();
const nuxtToast = useNuxtToast();
const businessRepository = BusinessRepository($api);

const isCalled = ref(false);
const isLoading = ref(false);
const message = ref('');

const matchingRecruitments = ref<Recruitment[]>([]);

const submitChat = async () => {
    isLoading.value = true;

    let pageConfig = new PageConfig();
    pageConfig.pageSize = -1;

    const businessesResponse = await businessRepository.getBusinessWithRecruitmentsPaging(pageConfig);

    const businesses = businessesResponse.result.data;

    const responseRecruitments = await cvUtils.findSuitableInternship(message.value, businesses);

    if (responseRecruitments.code != 200) {
        nuxtToast({
            description: responseRecruitments.message,
            type: "error"
        })
    }
    else {
        matchingRecruitments.value = responseRecruitments.result?.matchingRecruitments as any;
    }

    isCalled.value = true;
    isLoading.value = false;
}

interface Skill {
    name: string,
    description: string,
}

// * Refs
const texts = ['Định hướng', 'Nghề nghiệp', 'Công việc', 'Tương lai'];
const skills: Skill[] = [
    {
        name: "Công nghệ thông tin",
        description: "Phát triển khả năng lập trình và quản lý hệ thống thông tin.",
    },
    {
        name: "Cơ khí",
        description: "Nâng cao kỹ năng thiết kế và chế tạo máy móc.",
    },
    {
        name: "Xây dựng",
        description: "Cải thiện khả năng quản lý và thi công các công trình xây dựng.",
    },
    {
        name: "Kinh tế",
        description: "Học cách phân tích và quản lý các hoạt động kinh tế.",
    }
];

const currentText = ref(texts[0]);
const selectedSkill = ref<Skill>(skills[0]);
let currentIndex = 0;

// * Lifecycle
onBeforeMount(async () => {
    setInterval(changeText, 2200);
})

// * Functions
const changeText = () => {
    currentIndex = (currentIndex + 1) % texts.length
    currentText.value = texts[currentIndex]
}

const selectSkill = (skill: Skill) => {
    selectedSkill.value = skill;
};
</script>

<template>
    <main>
        <section class="w-full px-4 py-12 md:py-28">
            <div class="container mx-auto max-w-4xl">
                <div class="flex flex-col items-center justify-center gap-6 text-center">
                    <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        <transition mode="out-in"
                                    enter-active-class="transition ease-out duration-500 transform"
                                    enter-from-class="opacity-0 translate-y-4"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition ease-in duration-500 transform"
                                    leave-from-class="opacity-100 translate-y-0"
                                    leave-to-class="opacity-0 -translate-y-4">
                            <span :key="currentText" class="text-primary">{{ currentText }}</span>
                        </transition>
                        <span class="mt-2 block"> dành cho bạn</span>
                    </h1>
                    <p class="max-w-2xl text-lg font-medium text-gray-500 md:text-xl dark:text-gray-400">
                        Công nghệ AI, cá nhân hoá việc làm.
                    </p>
                    <div class="w-full max-w-md">
                        <form @submit.prevent="submitChat">
                            <UInput placeholder="Tôi muốn tìm việc lập trình NodeJS..." size="lg"
                                    icon="i-heroicons-magnifying-glass-20-solid"
                                    required
                                    v-model="message"
                                    :ui="{ icon: { trailing: { pointer: 'pointer-events-auto', padding: { lg: 'px-1' } } } }">
                                <template #trailing>
                                    <UButton color="primary"
                                             type="submit"
                                             :loading="isLoading"
                                             class="rounded-md" label="Tìm kiếm" />
                                </template>
                            </UInput>
                        </form>
                    </div>
                    <template v-if="isCalled">
                        <div v-if="matchingRecruitments.length == 0" class="text-xl font-medium">
                            Không tìm thấy kết quả
                        </div>
                        <div v-else class="flex flex-col justify-center space-y-4">
                            <div v-for="(recruitment, index) in matchingRecruitments" :key="recruitment.recruitmentId"
                                 :class="[index == 0 ? 'bg-primary-200 dark:bg-primary-400' : 'bg-white dark:bg-gray-800']"
                                 class="hover:border-primary-500 dark:hover:border-primary-500 flex h-auto w-full max-w-2xl transform flex-row gap-4 self-center rounded-lg p-4 shadow-md transition-transform duration-300 hover:scale-105">
                                <NuxtLink :to="`/recruitment/${recruitment.recruitmentId}`"
                                          class="flex w-full items-center justify-center text-center text-lg font-medium hover:underline dark:text-white"
                                          target="_blank">
                                    {{ recruitment.title }}
                                </NuxtLink>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </section>

        <section class="w-full bg-gray-500/5 px-4 py-12 md:py-28">
            <div class="container mx-auto max-w-4xl">
                <div class="flex flex-col items-center justify-center gap-4 text-center md:gap-16">
                    <div class="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Lựa chọn kỹ năng của bạn
                    </div>
                    <div class="flex flex-col justify-between gap-4 md:flex-row md:gap-12">
                        <div class="flex flex-col gap-2">
                            <UButton v-for="(skill, index) in skills" :key="index" :label="skill.name"
                                     :color="selectedSkill?.name === skill.name ? 'primary' : 'gray'" size="lg"
                                     @click="selectSkill(skill)" />
                        </div>
                        <div class="h-44 md:w-96">
                            <div
                                 class="flex h-full transform flex-col items-start justify-between gap-2 rounded-lg bg-gray-400/5 p-6 shadow-lg transition-transform hover:scale-105">
                                <div class="flex flex-col items-start">
                                    <div class="text-2xl font-bold">{{ selectedSkill?.name }}</div>
                                    <div class="text-left text-gray-500 dark:text-gray-400">
                                        {{ selectedSkill?.description }}
                                    </div>
                                </div>
                                <UButton color="primary" :label="'Tìm việc ' + selectedSkill?.name" size="lg"
                                         @click="navigateTo('/recruitment')" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="w-full px-4 py-12 md:py-28">
            <div class="container mx-auto max-w-4xl">
                <h2 class="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Tại sao chọn thực tập HCMUTE?
                </h2>
                <div class="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                    <div
                         class="flex transform flex-col items-center space-y-2 rounded-lg border-gray-200 bg-gray-400/5 p-4 shadow-lg transition-transform hover:scale-105">
                        <UIcon name="mingcute:search-3-line" class="text-primary h-14 w-14"></UIcon>
                        <h3 class="text-xl font-bold">Ghép nối thông minh</h3>
                        <p class="text-justify text-gray-500 dark:text-gray-400">
                            Hệ thống AI của chúng tôi ghép nối bạn với các công việc phù hợp với kỹ năng và sở
                            thích của bạn.
                        </p>
                    </div>
                    <div
                         class="flex transform flex-col items-center space-y-2 rounded-lg border-gray-200 bg-gray-400/5 p-4 shadow-lg transition-transform hover:scale-105">
                        <UIcon name="mingcute:globe-2-line" class="text-primary h-14 w-14"></UIcon>
                        <h3 class="text-xl font-bold">Cơ hội toàn cầu</h3>
                        <p class="text-justify text-gray-500 dark:text-gray-400">
                            Cơ hội thực tập từ các công ty trên khắp thế giới, mở rộng tầm nhìn của bạn.
                        </p>
                    </div>
                    <div
                         class="flex transform flex-col items-center space-y-2 rounded-lg border-gray-200 bg-gray-400/5 p-4 shadow-lg transition-transform hover:scale-105">
                        <UIcon name="mingcute:rocket-line" class="text-primary h-14 w-14"></UIcon>
                        <h3 class="text-xl font-bold">Phát triển sự nghiệp</h3>
                        <p class="text-justify text-gray-500 dark:text-gray-400">
                            Nhận được kinh nghiệm quý báu và khởi đầu sự nghiệp của bạn với các công việc được
                            chọn lọc của
                            chúng tôi.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>