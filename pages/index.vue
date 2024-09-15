<script setup lang="ts">
definePageMeta({
    layout: 'home',
})

const page = ref(1)
const items = ref(Array(55))
</script>

<template>
    <div class="flex flex-col items-center">
        <div class="flex w-full flex-col gap-4 md:w-[800px]">
            <div class="flex w-full flex-col gap-2">
                <div>
                    <UInput icon="i-heroicons-magnifying-glass-20-solid"
                            placeholder="Tìm theo tên công ty, tên công việc..."
                            class="w-full"
                            :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
                        <template #trailing>
                            <UButton icon="material-symbols:delete-sweep-outline" color="primary"
                                     class="-me-2.5 rounded-none rounded-r-md" />
                        </template>
                    </UInput>
                </div>
                <div class="flex flex-row gap-2">
                    <USelect class="w-1/3" icon="heroicons:building-office" color="white" size="sm"
                             :options="['FPT Software', 'Viettel Cooperation', 'VNPT', 'Vinagame']"
                             placeholder="Nhà tuyển dụng..." />
                    <USelect class="w-1/3" icon="heroicons:book-open" color="white" size="sm"
                             :options="['Công nghệ thông tin', 'Cơ khí', 'Ngôn ngữ Anh', 'Kinh tế']"
                             placeholder="Tất cả ngành..." />
                    <USelect class="w-1/3" icon="heroicons:map-pin" color="white" size="sm"
                             :options="['Thành phố Thủ Đức', 'Quận 1', 'Quận 3', 'Quận 6']" placeholder="Địa điểm..." />
                </div>
            </div>
            <div class="flex flex-row items-center justify-between rounded-md border p-2 dark:border-gray-700">
                <div><b>5.000.000</b> vị trí phù hợp</div>
                <UPagination v-model="page" :page-count="5" :total="items.length" />
            </div>
            <CompanyCard v-for="i in 5" />
        </div>
    </div>
</template>