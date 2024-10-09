<script setup lang="ts">
definePageMeta({
    layout: 'home',
})

// * Imports
const nuxtToast = useNuxtToast();

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
    setInterval(changeText, 2500);
})


// * Functions
const changeText = () => {
    currentIndex = (currentIndex + 1) % texts.length
    currentText.value = texts[currentIndex]
}

const handleUndoneButton = () => {
    nuxtToast({
        description: "Chưa làm xong",
    })
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
                        <transition mode="out-in" enter-active-class="transition ease-out duration-500 transform"
                                    enter-from-class="opacity-0 translate-y-4"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition ease-in duration-500 transform"
                                    leave-from-class="opacity-100 translate-y-0"
                                    leave-to-class="opacity-0 -translate-y-4">
                            <span :key="currentText" class="text-primary">{{ currentText }}</span>
                        </transition>
                        <span class="mt-2 block"> dành cho bạn</span>
                    </h1>
                    <p class="max-w-2xl text-lg text-gray-500 md:text-xl dark:text-gray-400">
                        Công nghệ AI, cá nhân hoá việc làm.
                    </p>
                    <div class="w-full max-w-md">
                        <UInput placeholder="Tìm theo ngành..." size="lg" icon="i-heroicons-magnifying-glass-20-solid"
                                :ui="{ icon: { trailing: { pointer: 'pointer-events-auto', padding: { lg: 'px-1' } } } }">
                            <template #trailing>
                                <UButton color="primary"
                                         @click="handleUndoneButton"
                                         class="rounded-md" label="Tìm kiếm" />
                            </template>
                        </UInput>
                    </div>
                </div>
            </div>
        </section>

        <section class="w-full bg-gray-100 px-4 py-12 md:py-28 dark:bg-gray-800">
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
                            <div class="flex h-full flex-col items-start justify-between gap-2 rounded-lg bg-white p-6">
                                <div class="flex flex-col items-start">
                                    <div class="text-2xl font-bold">{{ selectedSkill?.name }}</div>
                                    <div class="text-left text-gray-500 dark:text-gray-400">
                                        {{ selectedSkill?.description }}
                                    </div>
                                </div>
                                <UButton color="primary" :label="'Tìm việc ' + selectedSkill?.name" size="lg"
                                         @click="handleUndoneButton" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="w-full px-4 py-12 md:py-28">
            <div class="container mx-auto max-w-4xl">
                <h2 class="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Tại sao chọn Thực tập HCMUTE?
                </h2>
                <div class="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                    <div class="flex flex-col items-center space-y-2 rounded-lg border-gray-200 p-4">
                        <UIcon name="mingcute:search-3-line" class="h-14 w-14"></UIcon>
                        <h3 class="text-xl font-bold">Ghép nối thông minh</h3>
                        <p class="text-center text-gray-500 dark:text-gray-400">
                            Hệ thống AI của chúng tôi ghép nối bạn với các kỳ thực tập phù hợp với kỹ năng và sở thích
                            của bạn.
                        </p>
                    </div>
                    <div class="flex flex-col items-center space-y-2 rounded-lg border-gray-200 p-4">
                        <UIcon name="mingcute:globe-2-line" class="h-14 w-14"></UIcon>
                        <h3 class="text-xl font-bold">Cơ hội toàn cầu</h3>
                        <p class="text-center text-gray-500 dark:text-gray-400">
                            Truy cập các kỳ thực tập từ các công ty trên khắp thế giới, mở rộng tầm nhìn của bạn.
                        </p>
                    </div>
                    <div class="flex flex-col items-center space-y-2 rounded-lg border-gray-200 p-4">
                        <UIcon name="mingcute:rocket-line" class="h-14 w-14"></UIcon>
                        <h3 class="text-xl font-bold">Phát triển sự nghiệp</h3>
                        <p class="text-center text-gray-500 dark:text-gray-400">
                            Nhận được kinh nghiệm quý báu và khởi đầu sự nghiệp của bạn với các kỳ thực tập được chọn
                            lọc của
                            chúng tôi.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>