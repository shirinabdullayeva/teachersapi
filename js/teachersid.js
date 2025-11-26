

let teachersData = [];
let currentFilters = {
    gender: 'all',
    experience: 'all',
    rating: 'all',
    profession: 'all',
    search: ''
};
function getInitials(name) {
    if (!name) return '??';
    return name.split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

let API_URL = 'https://6921b86c512fb4140be12281.mockapi.io/teachers';

document.addEventListener("DOMContentLoaded", async () => {
    await loadTeachersData();
    initializeFilters();
    setupSearch();
});

async function loadTeachersData() {
    try {
        showLoadingState();

        let response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();

        data = data.map(teacher => ({
            ...teacher,
            rating: normalizeRating(teacher.rating)
        }));

        if (!Array.isArray(data)) {
            throw new Error('Invalid data format: Expected array');
        }

        if (data.length === 0) {
            console.warn('No teachers data found in API');
        }

        teachersData = data;
        renderTeachers(teachersData);
        updateTeachersCount(teachersData.length, teachersData.length);

    } catch (error) {
        console.error('Error loading teachers data:', error);
        showErrorState('Failed to load teachers data. Please try again later.');
        teachersData = [];
    } finally {
        hideLoadingState();
    }
}

function normalizeRating(rating) {
    if (rating === null || rating === undefined) {
        return 3.0;
    }

    let numRating = typeof rating === 'string' ? parseFloat(rating) : rating;

    if (numRating >= 1 && numRating <= 5) {
        return parseFloat(numRating.toFixed(1));
    }

    if (numRating >= 0 && numRating <= 100) {
        let normalized = 1 + (numRating / 100) * 4;
        return parseFloat(normalized.toFixed(1));
    }

    return Math.min(5, parseFloat(numRating.toFixed(1)));
}

function normalizeGender(gender) {
    console.log('Raw gender value:', gender, 'Type:', typeof gender);

    if (gender === null || gender === undefined) {
        return Math.random() > 0.5 ? 'Male' : 'Female';
    }

    if (typeof gender === 'boolean') {
        return gender ? 'Male' : 'Female';
    }

    if (typeof gender === 'number') {
        return gender === 1 ? 'Male' : 'Female';
    }

    if (typeof gender === 'string') {
        const genderLower = gender.toLowerCase();

        if (genderLower.includes('male') || genderLower === 'm' || genderLower === 'man' || genderLower === 'true' || genderLower === '1') {
            return 'Male';
        }
        if (genderLower.includes('female') || genderLower === 'f' || genderLower === 'woman' || genderLower === 'women' || genderLower === 'false' || genderLower === '0') {
            return 'Female';
        }
    }

    return Math.random() > 0.5 ? 'Male' : 'Female';
}

function showLoadingState() {
    let container = document.getElementById("teachersContainer");
    if (container) {
        container.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-12">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p class="text-gray-600 dark:text-gray-400">Loading teachers...</p>
                </div>
            </div>
        `;
    }
}

function showErrorState(message) {
    let container = document.getElementById("teachersContainer");
    if (container) {
        container.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-12">
                <div class="text-center text-red-600 dark:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p class="text-lg font-medium mb-2">Oops! Something went wrong</p>
                    <p class="text-sm">${message}</p>
                    <button onclick="loadTeachersData()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }
}

function hideLoadingState() {
}

async function addTeacherToAPI(teacherData) {
    try {
        let response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teacherData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let newTeacher = await response.json();
        return newTeacher;

    } catch (error) {
        console.error('Error adding teacher:', error);
        throw error;
    }
}

async function updateTeacherInAPI(teacherId, teacherData) {
    try {
        let response = await fetch(`${API_URL}/${teacherId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teacherData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let updatedTeacher = await response.json();
        return updatedTeacher;

    } catch (error) {
        console.error('Error updating teacher:', error);
        throw error;
    }
}

async function deleteTeacherFromAPI(teacherId) {
    try {
        let response = await fetch(`${API_URL}/${teacherId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;

    } catch (error) {
        console.error('Error deleting teacher:', error);
        throw error;
    }
}

function renderTeachers(teachers = teachersData) {
    let container = document.getElementById("teachersContainer");
    // innerHTML = "";
    if (!container) return;

    if (teachers.length === 0) {
        container.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-12">
                <div class="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <p class="text-gray-600 dark:text-gray-400 text-lg">No teachers found</p>
                    <p class="text-gray-500 dark:text-gray-500 text-sm">Try adjusting your filters or search terms</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = teachers.map(teacher => `
        <div class="teacher-card flex flex-col gap-6 rounded-xl border p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 group" 
         onclick="openDetailPage('teacher', '${teacher.id}')">
        <div class="flex flex-col items-center text-center mb-4">
        <div class="relative h-20 w-20 mb-3">
        ${teacher.avatar ?
        `<img src="${teacher.avatar}" alt="${teacher.FirstName}" class="w-full h-full rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900" />` :
            `<div class="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-blue-100 dark:ring-blue-900">
            ${getInitials(teacher.LastName)}
            </div>`
            
        }
        </div>


                <h3 class="text-gray-900 dark:text-white mb-1">${teacher.FirstName} ${teacher.LastName}</h3>

                <span class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 bg-secondary text-secondary-foreground mb-2">
                    ${teacher.gender}
                </span>

                <div class="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-3">
                    <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-briefcase h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            <rect width="20" height="14" x="2" y="6" rx="2"></rect>
                        </svg>
                        ${teacher.experience}y
                    </span>
                    <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-users h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                        ${teacher.Age}y
                    </span>
                </div>

                <div class="flex items-center gap-1 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-star h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                    </svg>
                    <span class="text-gray-900 dark:text-white">${teacher.rating}</span>
                </div>

                <div class="w-full space-y-2 my-3">
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div class="bg-black dark:bg-white h-2 rounded-full transition-all duration-300" 
                             style="width: ${(teacher.rating / 5) * 100}%">
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <div class="flex items-center gap-2">
                    <svg class="lucide lucide-phone h-4 w-4 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path></svg>
                    ${teacher.phone}
                </div>
                <div class="flex items-center gap-2">
                  <svg class="lucide lucide-send h-4 w-4 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>
                    ${teacher.telegram} 
                </div>
                <div class="flex items-center gap-2">
                    <svg class="lucide lucide-mail h-4 w-4 text-green-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>
                    ${teacher.email}
                </div>
                <div class="flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap h-5 w-5 flex-shrink-0" aria-hidden="true"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
                                        
                    ${teacher.profession}
                </div>
                <div class="flex items-center gap-2">
                    <svg class="lucide lucide-linkedin h-4 w-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    ${teacher.linkedin}
                </div>
            </div>
 <div class ="flex justify-center gap-20 mt-4 opacity-0 translate-y-4
group-hover:opacity-100 group:hover:translate-y-0 transition-all duration-300">

    <button onclick="event.stopPropagation(); openEditModal('${teacher.id}')" class="text-blue-600">Edit</button>

    <button onclick="event.stopPropagation(); deleteTeacher('${teacher.id}')" class="text-red-800">Delete</button>

</div>
        </div>
    `).join("");
}


function updateTeachersCount(showing, total) {
    let el = document.getElementById("teachersCount");
    if (el) el.innerText = `Showing ${showing} of ${total} teachers`;
}

function setupSearch() {
    let searchInput = document.getElementById("teacherSearch");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            currentFilters.search = searchInput.value.toLowerCase().trim();
            applyFilters();
        });
    }
}

function initializeFilters() {
    populateProfessionOptions();
    setupFilterDropdowns();
    setupFilterHandlers();
}

function populateProfessionOptions() {
    let professionContainer = document.querySelector('.profession-option').parentElement;
    let professions = [...new Set(teachersData.map(teacher => teacher.subject))];

    professions.forEach(profession => {
        let button = document.createElement('button');
        button.className = 'profession-option w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700';
        button.setAttribute('data-value', profession);
        button.textContent = profession;
        professionContainer.appendChild(button);
    });
}

function setupFilterDropdowns() {
    let filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            let dropdown = button.nextElementSibling;
            let isVisible = dropdown.style.display === 'block';

            document.querySelectorAll('.absolute').forEach(dropdown => {
                dropdown.style.display = 'none';
            });

            dropdown.style.display = isVisible ? 'none' : 'block';
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.absolute').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    });
}

function setupFilterHandlers() {
    document.querySelectorAll('.gender-option').forEach(option => {
        option.addEventListener('click', (e) => {
            let value = e.target.getAttribute('data-value');
            currentFilters.gender = value;
            updateFilterButton('gender', value, getGenderDisplayText(value));
            applyFilters();
        });
    });

    document.querySelectorAll('.experience-option').forEach(option => {
        option.addEventListener('click', (e) => {
            let value = e.target.getAttribute('data-value');
            currentFilters.experience = value;
            updateFilterButton('experience', value, getExperienceDisplayText(value));
            applyFilters();
        });
    });

    document.querySelectorAll('.rating-option').forEach(option => {
        option.addEventListener('click', (e) => {
            let value = e.target.getAttribute('data-value');
            currentFilters.rating = value;
            updateFilterButton('rating', value, getRatingDisplayText(value));
            applyFilters();
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('profession-option')) {
            let value = e.target.getAttribute('data-value');
            currentFilters.profession = value;
            updateFilterButton('profession', value, getProfessionDisplayText(value));
            applyFilters();
        }
    });
}

function updateFilterButton(filterType, value, displayText) {
    let button = document.querySelector(`[data-filter="${filterType}"]`);
    button.textContent = displayText;
    button.setAttribute('data-value', value);
}

function getGenderDisplayText(value) {
    let texts = { all: 'All Gender', male: 'Male Only', female: 'Female Only' };
    return texts[value] || 'All Gender';
}

function getExperienceDisplayText(value) {
    let texts = {
        all: 'All Experience',
        '0-5': '0-5 years',
        '6-10': '6-10 years',
        '11-20': '11-20 years',
        '20+': '20+ years'
    };
    return texts[value] || 'All Experience';
}

function getRatingDisplayText(value) {
    let texts = { all: 'All Rating', highest: 'Highest First', lowest: 'Lowest First' };
    return texts[value] || 'All Rating';
}

function getProfessionDisplayText(value) {
    return value === 'all' ? 'All Profession' : value;
}

function applyFilters() {
    let filteredTeachers = [...teachersData];

    if (currentFilters.search) {
        filteredTeachers = filteredTeachers.filter(teacher =>
            teacher.name.toLowerCase().includes(currentFilters.search) ||
            teacher.email.toLowerCase().includes(currentFilters.search) ||
            teacher.gender.toLowerCase().includes(currentFilters.search)
        );
    }

    if (currentFilters.gender !== 'all') {
        filteredTeachers = filteredTeachers.filter(teacher =>
            teacher.gender.toLowerCase() === currentFilters.gender
        );
    }

    if (currentFilters.experience !== 'all') {
        filteredTeachers = filteredTeachers.filter(teacher => {
            let exp = teacher.experience;
            switch (currentFilters.experience) {
                case '0-5': return exp >= 0 && exp <= 5;
                case '6-10': return exp >= 6 && exp <= 10;
                case '11-20': return exp >= 11 && exp <= 20;
                case '20+': return exp > 20;
                default: return true;
            }
        });
    }

    if (currentFilters.profession !== 'all') {
        filteredTeachers = filteredTeachers.filter(teacher =>
            teacher.gender === currentFilters.profession
        );
    }

    if (currentFilters.rating !== 'all') {
        filteredTeachers.sort((a, b) => {
            if (currentFilters.rating === 'highest') {
                return b.rating - a.rating;
            } else {
                return a.rating - b.rating;
            }
        });
    }

    renderTeachers(filteredTeachers);
    updateTeachersCount(filteredTeachers.length, teachersData.length);
}


function openTeacherModal() {
    const modal = document.getElementById('addTeacherModal');
    modal.classList.remove('hidden');

    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleTeacherEscapeKey);
}

function closeTeacherModal() {
    const modal = document.getElementById('addTeacherModal');
    modal.classList.add('hidden');

    document.body.style.overflow = '';

    document.removeEventListener('keydown', handleTeacherEscapeKey);
    document.getElementById('addTeacherForm').reset();
}

function handleTeacherEscapeKey(e) {
    if (e.key === 'Escape') {
        closeTeacherModal();
    }
}

function handleTeacherBackdropClick(e) {
    if (e.target.id === 'addTeacherModal') {
        closeTeacherModal();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const teacherForm = document.getElementById('addTeacherForm');
    const teacherModal = document.getElementById('addTeacherModal');

    if (teacherForm && teacherModal) {
        teacherModal.addEventListener('click', handleTeacherBackdropClick);

        teacherModal.querySelector('.bg-white').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        teacherForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // e.stopPropagation();

            const formData = new FormData(e.target);
            const teacherData = {
                name: formData.get('name'),
                subject: formData.get('subject'),
                experience: parseInt(formData.get('experience')),
                age: parseInt(formData.get('age')),
                rating: parseFloat(formData.get('rating')),
                gender: formData.get('gender'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                telegram: formData.get('telegram') || `@${formData.get('name').toLowerCase().replace(/\s+/g, '')}`,
                linkedin: formData.get('linkedin') || `linkedin.com/in/${formData.get('name').toLowerCase().replace(/\s+/g, '-')}`,
                avatar: `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/27.jpg?seed=${formData.get('name')}`
            };

            try {
                const newTeacher = await addTeacherToAPI(teacherData);
                teachersData.push(newTeacher);
                renderTeachers(teachersData);
                updateTeachersCount(teachersData.length, teachersData.length);
                closeTeacherModal();

                showToast('Teacher added successfully!', 'success');
            } catch (error) {
                showToast('Failed to add teacher. Please try again.', 'error');
            }
        });
    }
});

document.getElementById('addTeacherForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
   

    let formData = new FormData(e.target);
    let teacherData = {
        name: formData.get('name'),
        subject: formData.get('subject'),
        experience: parseInt(formData.get('experience')),
        age: parseInt(formData.get('age')),
        rating: parseFloat(formData.get('rating')),
        gender: formData.get('gender'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        telegram: formData.get('telegram') || `@${formData.get('name').toLowerCase().replace(/\s+/g, '')}`,
        linkedin: formData.get('linkedin') || `linkedin.com/in/${formData.get('name').toLowerCase().replace(/\s+/g, '-')}`,
        avatar: `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/27.jpg?seed=${formData.get('name')}`
    };

    try {
        let newTeacher = await addTeacherToAPI(teacherData);
        teachersData.push(newTeacher);
        renderTeachers(teachersData);
        updateTeachersCount(teachersData.length, teachersData.length);
        closeTeacherModal();

        showToast('Teacher added successfully!', 'success');
    } catch (error) {
        showToast('Failed to add teacher. Please try again.', 'error');
    }
});




let editingId = null;



function deleteTeacher(id, event) {
    event.stopPropagation(); 
}


// async function deleteTeacher(id) {
//     event.stopPropagation();

// }

function deleteTeacher(id) {
    teachersData = teachersData.filter(t => t.id !== id);
    renderTeachers(teachersData);
}


function openEditModal(id) {
    let teacher = teachersData.find(t => t.id === id);
    if (!teacher) return;

    editingId = id;

    document.getElementById("editFirst").value = teacher.FirstName;
    document.getElementById("editLast").value = teacher.LastName;
    document.getElementById("editAge").value = teacher.Age;
    document.getElementById("editPhone").value = teacher.phone;
    document.getElementById("editEmail").value = teacher.email;
    document.getElementById("editTelegram").value = teacher.telegram;

    document.getElementById("editModal").classList.remove("hidden");
    document.getElementById("editModal").classList.add("flex");
}


function saveEdit() {
    let teacher = teachersData.find(t => t.id === editingId);
    if (!teacher) return;

    teacher.FirstName = document.getElementById("editFirst").value;
    teacher.LastName = document.getElementById("editLast").value;
    teacher.Age = document.getElementById("editAge").value;
    teacher.phone = document.getElementById("editPhone").value;
    teacher.email = document.getElementById("editEmail").value;
    teacher.telegram = document.getElementById("editTelegram").value;
 
  

    closeEditModal();
    renderTeachers(teachersData);
}

function closeEditModal() {
    document.getElementById("editModal").classList.add("hidden");
    document.getElementById("editModal").classList.remove("flex");
}



