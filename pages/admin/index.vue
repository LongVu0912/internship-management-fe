<script setup lang="ts">
definePageMeta({
    layout: 'admin'
})

const columns = [
    {
        key: 'id',
        label: 'MSSV'
    },
    {
        key: 'name',
        label: 'Tên'
    },
    {
        key: 'sex',
        label: 'Giới tính'
    },
    {
        key: 'email',
        label: 'Email'
    },
    {
        key: 'major',
        label: 'Ngành'
    },
    {
        key: 'actions'
    }
]

const people = [
    {
        id: 21110111,
        name: 'Student 1',
        sex: "Nam",
        email: '21110111@student.hcmute.edu.vn',
        major: 'Công nghệ thông tin',
    },
    {
        id: 21110112,
        name: 'Student 2',
        sex: "Nữ",
        email: '21110112@student.hcmute.edu.vn',
        major: 'Công nghệ thông tin',
    },
    {
        id: 21110113,
        name: 'Student 3',
        sex: "Nam",
        email: '21110113@student.hcmute.edu.vn',
        major: 'Công nghệ thông tin',
    },
    {
        id: 21110114,
        name: 'Student 4',
        sex: "Nữ",
        email: '21110143@student.hcmute.edu.vn',
        major: 'Công nghệ thông tin',
    },

]

const items = (row: any) => [
    [
        {
            label: 'Sửa',
            icon: 'i-heroicons-pencil-square-20-solid',
            click: () => console.log('Edit', row.id)
        },
        {
            label: 'Nhân bản',
            icon: 'i-heroicons-document-duplicate-20-solid'
        }
    ],
    [
        {
            label: 'Lưu trữ',
            icon: 'i-heroicons-archive-box-20-solid'
        },
        {
            label: 'Di chuyển',
            icon: 'i-heroicons-arrow-right-circle-20-solid'
        }
    ],
    [
        {
            label: 'Xoá',
            icon: 'i-heroicons-trash-20-solid'
        }
    ]
]

const selected = ref([people[1]])
</script>

<template>
    <div>
        <UTable class="rounded-lg border border-gray-100 dark:border-gray-700" v-model="selected" :rows="people"
                :columns="columns">
            <template #name-data="{ row }">
                <span
                      :class="[selected.find(person => person.id === row.id) && 'text-primary-500 dark:text-primary-400']">{{ row.name }}</span>
            </template>

            <template #actions-data="{ row }">
                <UDropdown :items="items(row)">
                    <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                </UDropdown>
            </template>
        </UTable>
    </div>
</template>
