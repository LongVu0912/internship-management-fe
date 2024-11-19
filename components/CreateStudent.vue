<script setup lang="ts">
import type Faculty from '~/types/faculty/Faculty';
import type Major from '~/types/major/Major';
import { Filter } from '~/types/page_config/Filter';
import { PageConfig } from '~/types/page_config/PageConfig';
import type Profile from '~/types/profile/Profile';
import type Student from '~/types/student/Student';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// * Imports
const { $apiToken } = useNuxtApp();
const studentRepository = StudentRepository($apiToken);
const facultyRepository = FacultyRepository($apiToken);
const nuxtToast = useNuxtToast();

// * Refs
const createStudentModal = ref({
    isOpen: false,
    isSubmitting: false,
})

const faculty = ref({
    isLoading: false,
    selectedFaculty: {} as Faculty,
    facultyList: [] as Faculty[],
    pageConfig: new PageConfig(),
})

faculty.value.pageConfig.pageSize = -1;
faculty.value.pageConfig.filters.push(new Filter("name"));

const major = ref({
    isLoading: false,
    selectedMajor: {} as Major,
    majorList: [] as Major[],
})

const newStudent = ref<Student>({
    dob: format(new Date(), 'yyyy-MM-dd'),
    profile: {} as Profile
} as Student);

const gender = computed({
    get: () => (newStudent.value.profile.isMale ? 'Nam' : 'Nữ'),
    set: (value: string) => {
        newStudent.value.profile.isMale = (value === 'Nam');
    }
});

const birthday = computed({
    get: () => (new Date(newStudent.value.dob)),
    set: (value: Date) => {
        newStudent.value.dob = format(value, 'yyyy-MM-dd');
    }
})

// * Lifecycle
onBeforeMount(async () => {
    fetchFaculties();
})

// * Functions
const fetchFaculties = async () => {
    faculty.value.isLoading = true;
    const apiResponse = await facultyRepository.getFacultyPaging(faculty.value.pageConfig);

    if (apiResponse.code === 200) {
        faculty.value.facultyList = apiResponse.result.data;

        faculty.value.pageConfig.update(apiResponse.result.pageConfig);

    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }

    faculty.value.isLoading = false;
}

const fetchMajors = async () => {
    major.value.isLoading = true;
    const apiResponse = await facultyRepository.getMajorsByFacultyId({
        facultyId: faculty.value.selectedFaculty.facultyId
    });

    if (apiResponse.code === 200) {
        major.value.majorList = apiResponse.result;
    } else {
        nuxtToast({
            description: apiResponse.message,
            type: 'error',
        });
    }

    major.value.isLoading = false;
}

const handleCreateStudent = async () => {
    if (faculty.value.selectedFaculty.facultyId == undefined || major.value.selectedMajor.majorId == undefined) {
        nuxtToast({
            description: "Hãy chọn khoa và ngành",
            type: "error",
        })
        return;
    }

    newStudent.value.majorId = major.value.selectedMajor.majorId;
    newStudent.value.studentId = newStudent.value.profile.username;

    createStudentModal.value.isSubmitting = true;

    const apiResponse = await studentRepository.createStudent(newStudent.value);

    if (apiResponse.code === 1012) {
        nuxtToast({
            description: apiResponse.message,
            type: 'info',
        });
    }
    else if (apiResponse.code !== 200) {
        nuxtToast({
            description: "Hãy điền đẩy đủ thông tin",
            type: "error",
        });
    }
    else {
        nuxtToast({
            description: "Tạo sinh viên thành công",
            type: "success",
        });
        createStudentModal.value.isOpen = false;
    }

    createStudentModal.value.isSubmitting = false;
}

const closeModal = () => {
    newStudent.value = {
        dob: format(new Date(), 'yyyy-MM-dd'),
        profile: {} as Profile
    } as Student;
    major.value.selectedMajor = {} as Major;
    faculty.value.selectedFaculty = {} as Faculty;
    createStudentModal.value.isOpen = false;
}

// * Watches
watch(faculty.value, async () => {
    if (faculty.value.selectedFaculty.facultyId != null) {
        await fetchMajors();
        major.value.selectedMajor = {} as Major;
    }
})

</script>

<template>
    <UButton color="primary" icon="mingcute:add-circle-line" @click="createStudentModal.isOpen = true">
        Thêm sinh viên
    </UButton>

    <UModal :ui="{ width: 'sm:max-w-3xl' }" v-model="createStudentModal.isOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-base font-semibold">
                        Thêm học sinh
                    </div>
                    <UButton color="gray" variant="ghost" icon="mingcute:close-fill" class="-my-1"
                             @click="closeModal" />
                </div>
            </template>

            <div class="flex flex-col gap-3">
                <div>
                    <div class="font-medium">Khoa</div>
                    <USelectMenu v-model="faculty.selectedFaculty" size="md" color="gray"
                                 :options="faculty.facultyList">
                        <template #label>
                            <div>
                                {{ (faculty.selectedFaculty.facultyId != undefined) ? `${faculty.selectedFaculty.facultyId} - ${faculty.selectedFaculty.name}` : "Chọn khoa" }}
                            </div>
                        </template>
                        <template #option="{ option: faculty }">
                            <div>{{ faculty.facultyId + ' - ' + faculty.name }}</div>
                        </template>
                    </USelectMenu>
                </div>

                <div>
                    <div class="font-medium">Ngành</div>
                    <USelectMenu v-model="major.selectedMajor"
                                 :disabled="faculty.selectedFaculty.facultyId == undefined && !faculty.isLoading"
                                 size="md" color="gray"
                                 :options="major.majorList">
                        <template #label>
                            <div>
                                {{ (major.selectedMajor.majorId != undefined) ? `${major.selectedMajor.name}` : "Chọn ngành" }}
                            </div>
                        </template>
                        <template #option="{ option: major }">
                            <div>{{ major.name }}</div>
                        </template>
                    </USelectMenu>
                </div>

                <div class="flex flex-col gap-4 md:flex-row">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Họ tên</div>
                        <UInput v-model="newStudent.profile.fullname" placeholder="Nguyễn Văn A" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Mã số sinh viên</div>
                        <UInput v-model="newStudent.profile.username" placeholder="21110000" autocomplete="off" />
                    </div>
                </div>

                <div class="flex flex-col gap-4 md:flex-row">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Mật khẩu</div>
                        <UInput type="password" v-model="newStudent.profile.password" autocomplete="off" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Email</div>
                        <UInput type="email" v-model="newStudent.profile.email"
                                placeholder="21110000@student.hcmute.edu.vn" />
                    </div>
                </div>

                <div class="flex flex-col gap-4 md:flex-row">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Năm học</div>
                        <UInput v-model="newStudent.year" placeholder="2024" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Ngày sinh</div>
                        <UPopover class="w-full" :popper="{ placement: 'bottom-start' }">
                            <UButton class="w-full" :label="format(birthday, 'd MMM, yyy', { locale: vi })"
                                     color="white" size="md">
                            </UButton>

                            <template #panel="{ close }">
                                <DatePicker class="w-full" v-model="birthday" @close="close" />
                            </template>
                        </UPopover>
                    </div>
                </div>

                <div class="flex flex-col gap-4 md:flex-row">
                    <div class="w-full space-y-1">
                        <div class="font-medium">Số điện thoại</div>
                        <UInput v-model="newStudent.profile.phoneNumber" placeholder="09999999999" />
                    </div>
                    <div class="w-full space-y-1">
                        <div class="font-medium">Giới tính</div>
                        <USelect color="gray" size="md" :options="['Nữ', 'Nam']" v-model:model-value="gender" />
                    </div>
                </div>

                <div class="w-full space-y-1">
                    <div class="font-medium">Bio</div>
                    <UTextarea size="lg" color="gray" :rows="5" class="w-full" v-model="newStudent.profile.bio"
                               placeholder="Giới thiệu ngắn về bản thân...">
                    </UTextarea>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end">
                    <UButton class="mr-2" color="gray" variant="ghost" @click="closeModal">
                        Huỷ
                    </UButton>
                    <UButton color="primary"
                             @click="handleCreateStudent"
                             :loading="createStudentModal.isSubmitting">
                        Tạo
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>