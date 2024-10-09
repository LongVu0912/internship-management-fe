<script setup lang="ts">
import type Recruitment from '~/types/recruitment/Recruitment';

const props = defineProps({
    recruitment: {
        type: Object as PropType<Recruitment>,
        required: true,
    },
});
</script>

<template>
    <div
         class="hover:border-primary-500 dark:hover:border-primary-500 bg-content flex h-auto w-full flex-row gap-3 rounded-md border p-3 md:h-52 dark:border-gray-800">
        <div class="flex flex-shrink-0 items-center">
            <NuxtImg src="/hcmute.png" sizes="60px md:120px" quality="80" alt="hcmute" />
        </div>
        <div class="flex w-full flex-col justify-between gap-1">
            <div class="flex flex-col justify-between gap-1">
                <div class="flex w-full flex-col justify-between md:flex-row">
                    <div class="text-xl font-semibold">
                        {{ props.recruitment.title }}
                    </div>
                    <div class="text-primary text-md whitespace-nowrap font-semibold">
                        {{ props.recruitment.type }}
                    </div>
                </div>

                <div>
                    <div class="text-md flex flex-row items-center gap-1 font-normal">
                        <UIcon name="mingcute:building-3-line" class="h-5 w-5 flex-shrink-0" />
                        <div>
                            {{ props.recruitment.business.name }}
                        </div>
                    </div>
                    <div class="text-md flex flex-row items-center gap-1 font-normal">
                        <UIcon name="mingcute:location-3-line" class="h-5 w-5 flex-shrink-0" />
                        <div>
                            {{ props.recruitment.location }}
                        </div>
                    </div>
                    <div class="text-md flex flex-row items-center gap-1 font-normal">
                        <UIcon name="mingcute:calendar-2-line" class="h-5 w-5 flex-shrink-0" />
                        <div>
                            {{ props.recruitment.workingDay }} từ
                            {{ props.recruitment.workingHour }}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="flex flex-row justify-between">
                    <div class="flex flex-col items-center gap-2 md:flex-row">
                        <!-- <UBadge class="justify-center" color="primary" variant="outline" size="md"
                                :label="props.recruitment.position" />
                        <UBadge class="justify-center" color="primary" variant="outline" size="md"
                                :label="props.recruitment.keySkills" /> -->
                    </div>
                    <div>
                        <UButton color="primary" variant="solid" size="md"
                                 @click="console.log(props.recruitment.recruitmentId)">Chi tiết</UButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>