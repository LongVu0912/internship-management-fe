<script setup lang="ts">
import type Permission from '~/types/role/Permission';
import type Role from '~/types/role/Role';
import type RolePermission from '~/types/role/RolePermission';

definePageMeta({
    layout: "admin",
    middleware: 'admin',
});

// * Imports
const { $apiToken } = useNuxtApp();
const roleRepository = RoleRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const isTableLoading = ref(true);

const roleList = ref<Role[]>([]);
const permissionList = ref<Permission[]>([]);

const sort = ref<any>({
    column: 'role.roleName',
    direction: 'desc'
})

const createPermissionModal = ref({
    isOpen: false,
    isSendingRequest: false,
    newPermission: '',
});

const permissionModal = ref({
    search: '',
    isOpen: false,
    isLoading: false,
})

const permissionOfRoleModal = ref({
    search: '',
    isOpen: false,
    isSendingRequest: false,
    role: {} as Role,
    rolePermissions: [],
})

const addPermissionToRoleModal = ref({
    search: '',
    isOpen: false,
    isSendingRequest: false,
    role: {} as Role,
    selectedPermission: {} as Permission
})

// * Lifecycle
onBeforeMount(() => {
    fetchTableData();
});

// * Functions
const fetchTableData = async () => {
    isTableLoading.value = true;

    const apiResponse = await roleRepository.getAllRole();

    if (apiResponse.code === 200) {
        roleList.value = apiResponse.result;

        isTableLoading.value = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }

}
const fetchAllPermission = async () => {
    const apiResponse = await roleRepository.getAllPermission();

    if (apiResponse.code === 200) {
        permissionList.value = apiResponse.result;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

const openCreatePermissionModal = () => {
    createPermissionModal.value.newPermission = '';
    createPermissionModal.value.isOpen = true;
}

const handleCreatePermission = async () => {
    createPermissionModal.value.isSendingRequest = true;

    const apiResponse = await roleRepository.createPermission({
        name: createPermissionModal.value.newPermission
    });

    if (apiResponse.code === 200) {
        nuxtToast({
            description: "Thêm quyền thành công",
            type: 'success',
        });
        createPermissionModal.value.isOpen = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }

    createPermissionModal.value.isSendingRequest = false;
}

const openPermissionModal = async () => {
    permissionModal.value.isLoading = true;
    await fetchAllPermission();
    permissionModal.value.isLoading = false;
    permissionModal.value.isOpen = true;
}

const openPermissionOfRoleModal = async (row: Role) => {
    permissionOfRoleModal.value.role = row;

    const apiResponse = await roleRepository.getPermissionByRoleId({
        roleId: row.roleId
    });

    if (apiResponse.code === 200) {
        permissionOfRoleModal.value.rolePermissions = apiResponse.result;
        permissionOfRoleModal.value.isOpen = true;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }
}

const openAddPermissionToRoleModal = async (row: Role) => {
    permissionOfRoleModal.value.isOpen = false;
    addPermissionToRoleModal.value.role = row;
    await fetchAllPermission();
    addPermissionToRoleModal.value.isOpen = true;
}

const handleAddPermissionToRole = async (row: Permission) => {
    addPermissionToRoleModal.value.isSendingRequest = true;

    const apiResponse = await roleRepository.bindRolePermission({
        roleIds: [addPermissionToRoleModal.value.role.roleId],
        permissionIds: [row.permissionId as any],
    });

    if (apiResponse.code === 200) {
        nuxtToast({
            description: "Thêm quyền thành công",
            type: 'success',
        });

        await openPermissionOfRoleModal(addPermissionToRoleModal.value.role);

        addPermissionToRoleModal.value.isOpen = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }

    addPermissionToRoleModal.value.isSendingRequest = false;
}

const handleDeleteRolePermission = async (row: RolePermission) => {
    permissionOfRoleModal.value.isSendingRequest = true;

    const apiResponse = await roleRepository.deleteRolePermission({
        rolePermissionIds: [row.id]
    });

    if (apiResponse.code === 200) {
        nuxtToast({
            description: "Xóa quyền thành công",
            type: 'success',
        });
        permissionOfRoleModal.value.isOpen = false;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }

    permissionOfRoleModal.value.isSendingRequest = false;
}

const filteredPermissionOfRole = computed(() => {
    if (!permissionOfRoleModal.value.search) {
        return permissionOfRoleModal.value.rolePermissions
    }

    return permissionOfRoleModal.value.rolePermissions.filter((permission: RolePermission) => {
        return permission.permission.name.toLowerCase().includes(permissionOfRoleModal.value.search.toLowerCase());
    });
});

const filteredPermissionList = computed(() => {
    if (!addPermissionToRoleModal.value.search) {
        return permissionList.value
    }

    return permissionList.value.filter((permission: Permission) => {
        return permission.name.toLowerCase().includes(permissionOfRoleModal.value.search.toLowerCase());
    });
});

const filteredAllPermission = computed(() => {
    if (!permissionModal.value.search) {
        return permissionList.value
    }

    return permissionList.value.filter((permission: Permission) => {
        return permission.name.toLowerCase().includes(permissionOfRoleModal.value.search.toLowerCase());
    });
});

// * Data
const columns = [
    {
        key: "roleName",
        label: "Vai trò",
    },
    {
        key: "permission",
        label: "Danh sách quyền",
    },
]

const permissionColumns = [
    {
        key: "permissionId",
        label: "ID",
        sortable: true,
    },
    {
        key: "name",
        label: "Tên",
        sortable: true,
    },
    {
        key: "actions",
        label: "Hành động",
    },
]

const rolePermissionColumns = [
    {
        key: "permission.permissionId",
        label: "ID",
        sortable: true,
    },
    {
        key: "permission.name",
        label: "Tên",
        sortable: true,
    },
    {
        key: "actions",
        label: "Hành động",
        class: "text-center",
        rowClass: "text-center"
    },
]
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="flex justify-end">
            <div class="flex flex-col gap-2 md:flex-row">
                <ChangePassword />
            </div>
        </div>

        <UCard class="w-full" :ui="{
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
            footer: { padding: 'p-4' }
        }">

            <template #header>
                <h1 class="text-center text-xl font-semibold text-gray-900 dark:text-white">
                    Phân quyền hệ thống
                </h1>
            </template>

            <div class="flex justify-end px-4 py-3">
                <div class="flex flex-col gap-2 md:flex-row">
                    <div class="flex justify-end">
                        <UButton label="Tất cả quyền" color="primary" @click="openPermissionModal"
                                 :loading="permissionModal.isLoading" />
                    </div>
                    <div>
                        <UButton label="Thêm quyền hệ thống" color="primary" @click="openCreatePermissionModal" />
                    </div>
                </div>
            </div>

            <UTable class="rounded-lg" :columns="columns" :loading="isTableLoading" :rows="roleList" sort-mode="manual"
                    v-model:sort="sort">
                <template #roleName-data="{ row }">
                    <div class="font-medium">
                        <UBadge :label="row.roleName" variant="subtle" size="md" />
                    </div>
                </template>

                <template #permission-data="{ row }">
                    <UButton icon="mingcute:user-info-line" @click="openPermissionOfRoleModal(row)" />
                </template>
            </UTable>
        </UCard>
    </div>

    <UModal v-model="permissionModal.isOpen" prevent-close>
        <UCard class="w-full" :ui="{
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
            footer: { padding: 'p-4' }
        }">

            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-base font-semibold">
                        Tất cả quyền
                    </div>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="permissionModal.isOpen = false" />
                </div>
            </template>

            <div class="px-4 py-2">
                <form>
                    <UInput placeholder="Tìm tên quyền..." class="min-w-64" size="sm" color="white"
                            v-model="permissionModal.search"
                            :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
                        <template #trailing>
                            <UButton icon="heroicons:magnifying-glass-16-solid" color="primary"
                                     class="-me-2.5 rounded-none rounded-r-md" type="submit" />
                        </template>
                    </UInput>
                </form>
            </div>

            <UTable class="rounded-lg" :columns="permissionColumns" :loading="permissionModal.isLoading"
                    :rows="filteredAllPermission">
                <template #permissionId-data="{ row }">
                    <div class="font-medium">
                        <UBadge :label="row.permissionId" variant="subtle" />
                    </div>
                </template>
            </UTable>
        </UCard>
    </UModal>

    <UModal v-model="createPermissionModal.isOpen" prevent-close>
        <form @submit.prevent="handleCreatePermission">
            <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="text-base font-semibold">
                            Thêm quyền
                        </div>
                        <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                                 @click="createPermissionModal.isOpen = false" />
                    </div>
                </template>
                <div class="space-y-4">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Quyền mới</div>
                        <UInput required size="lg" v-model="createPermissionModal.newPermission"
                                placeholder="CREATE_STUDENT" icon="mingcute:user-edit-line" />
                    </div>
                </div>
                <template #footer>
                    <UButton :loading="createPermissionModal.isSendingRequest" class="w-full rounded-md" size="lg"
                             color="primary"
                             type="submit"
                             block>
                        Thêm
                    </UButton>
                </template>
            </UCard>
        </form>
    </UModal>

    <UModal :ui="{ width: 'sm:max-w-3xl' }" v-model="permissionOfRoleModal.isOpen" prevent-close>
        <UCard class="w-full" :ui="{
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
            footer: { padding: 'p-4' }
        }">

            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-base font-semibold">
                        Quyền của {{ permissionOfRoleModal.role?.roleName }}
                    </div>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="permissionOfRoleModal.isOpen = false" />
                </div>
            </template>

            <div class="flex justify-between px-4 py-2">
                <form>
                    <UInput placeholder="Tìm tên quyền..." class="min-w-64" size="sm" color="white"
                            v-model="permissionOfRoleModal.search"
                            :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
                        <template #trailing>
                            <UButton icon="heroicons:magnifying-glass-16-solid" color="primary"
                                     class="-me-2.5 rounded-none rounded-r-md" type="submit" />
                        </template>
                    </UInput>
                </form>

                <UButton icon="mingcute:user-add-2-line" color="primary" label="Thêm quyền"
                         @click="openAddPermissionToRoleModal(permissionOfRoleModal.role)" />
            </div>

            <UTable class="rounded-lg" :columns="rolePermissionColumns" :rows="filteredPermissionOfRole">
                <template #permission.permissionId-data="{ row }">
                    <div class="font-medium">
                        <UBadge :label="row.permission.permissionId" variant="subtle" />
                    </div>
                </template>

                <template #actions-data="{ row }">
                    <UButton icon="mingcute:delete-2-line" variant="soft" color="red"
                             @click="handleDeleteRolePermission(row)"
                             :disabled="permissionOfRoleModal.isSendingRequest" />
                </template>
            </UTable>
        </UCard>
    </UModal>

    <UModal :ui="{ width: 'sm:max-w-3xl' }" v-model="addPermissionToRoleModal.isOpen" prevent-close>
        <UCard class="w-full" :ui="{
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
            footer: { padding: 'p-4' }
        }">

            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-base font-semibold">
                        Thêm quyền cho {{ addPermissionToRoleModal.role?.roleName }}
                    </div>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="addPermissionToRoleModal.isOpen = false" />
                </div>
            </template>

            <div class="flex justify-between px-4 py-2">
                <form>
                    <UInput placeholder="Tìm tên quyền..." class="min-w-64" size="sm" color="white"
                            v-model="addPermissionToRoleModal.search"
                            :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
                        <template #trailing>
                            <UButton icon="heroicons:magnifying-glass-16-solid" color="primary"
                                     class="-me-2.5 rounded-none rounded-r-md" type="submit" />
                        </template>
                    </UInput>
                </form>
            </div>

            <UTable class="rounded-lg" :columns="permissionColumns" :rows="filteredPermissionList">
                <template #permissionId-data="{ row }">
                    <div class="font-medium">
                        <UBadge :label="row.permissionId" variant="subtle" />
                    </div>
                </template>

                <template #actions-data="{ row }">
                    <UButton icon="mingcute:file-new-line" :disabled="addPermissionToRoleModal.isSendingRequest"
                             @click="handleAddPermissionToRole(row)" />
                </template>
            </UTable>
        </UCard>
    </UModal>
</template>