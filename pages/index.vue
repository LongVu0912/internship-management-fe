<script setup lang="ts">
definePageMeta({
    layout: 'home',
})
// * Imports
const nuxtToast = useNuxtToast();

// * Refs
const page = ref(1)
const items = ref(Array(55))
const isPageLoading = ref(true);
const texts = ['Định hướng', 'Nghề nghiệp', 'Công việc', 'Tương lai']
const currentText = ref(texts[0])
let currentIndex = 0;

// * Lifecycle
onBeforeMount(async () => {
    isPageLoading.value = false;

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

</script>

<template>
    <Loading v-if="isPageLoading" />
    <div v-else class="flex flex-col items-center">
        <div class="h-full w-full rounded-md bg-gray-500/5 bg-cover bg-center p-4">
            <div class="flex flex-col justify-between gap-4 md:flex-row">
                <div class="flex w-full flex-col gap-2">
                    <div class="font-medium">Công nghệ AI, cá nhân hoá việc làm</div>
                    <div class="text-2xl font-bold">
                        <span class="text-primary">
                            <transition
                                        mode="out-in"
                                        enter-active-class="transition ease-out duration-500 transform"
                                        enter-from-class="opacity-0 translate-y-4"
                                        enter-to-class="opacity-100 translate-y-0"
                                        leave-active-class="transition ease-in duration-500 transform"
                                        leave-from-class="opacity-100 translate-y-0"
                                        leave-to-class="opacity-0 -translate-y-4">
                                <span :key="currentText">{{ currentText }}</span>
                            </transition>
                        </span>
                        <span> dành cho bạn</span>
                    </div>
                    <UInput placeholder="Tìm theo ngành..."
                            size="lg"
                            icon="i-heroicons-magnifying-glass-20-solid"
                            :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
                        <template #trailing>
                            <UButton color="primary"
                                     @click="handleUndoneButton"
                                     class="rounded-md" label="Tìm kiếm" />
                        </template>
                    </UInput>
                </div>
                <div class="flex w-full justify-center">
                    <NuxtImg class="rounded-md" width="600" quality="80" src="/background.jpg"></NuxtImg>
                </div>
            </div>
        </div>

        <UDivider size="xs" class="my-4" />

        <div class="flex w-full flex-col gap-4 px-0 lg:px-16">
            <div class="flex w-full flex-col gap-2">
                <div>
                    <UInput icon="mingcute:search-2-fill" placeholder="Tìm theo tên công ty, tên công việc..."
                            class="w-full"
                            size="sm" :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
                        <template #trailing>
                            <UButton icon="mingcute:delete-2-line" color="primary"
                                     class="-me-2.5 rounded-none rounded-r-md" />
                        </template>
                    </UInput>
                </div>
                <div class="flex flex-row gap-2">
                    <USelect class="w-1/3" icon="mingcute:building-3-line" color="gray" size="sm"
                             :options="['Tất cả nhà tuyển dụng', 'FPT Software', 'Viettel Cooperation', 'VNPT', 'VNG']"
                             model-value="Tất cả nhà tuyển dụng" />
                    <USelect class="w-1/3" icon="mingcute:book-3-line" color="gray" size="sm"
                             :options="['Tất cả ngành', 'Công nghệ thông tin', 'Cơ khí', 'Ngôn ngữ Anh', 'Kinh tế']"
                             model-value="Tất cả ngành" />
                    <USelect class="w-1/3" icon="mingcute:location-3-line" color="gray" size="sm"
                             :options="['Tất cả địa điểm', 'Thành phố Thủ Đức', 'Quận 1', 'Quận 3', 'Quận 6']"
                             model-value="Tất cả địa điểm" />
                </div>
            </div>
            <div class="flex flex-row items-center justify-between gap-1 rounded-md border p-2 dark:border-gray-700">
                <div><b>5.000.000</b> vị trí phù hợp</div>
                <UPagination v-model="page" :max="5" :page-count="5" :total="items.length" />
            </div>
            <div class="flex flex-col gap-4">
                <CompanyCard class="self-center" v-for="i in 5" />
            </div>
        </div>
    </div>
</template>
<!-- 
<style scoped>
div {
    @apply border border-red-500
}
</style> -->