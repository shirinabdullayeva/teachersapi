let currentDetailType = '';
let currentDetailId = '';

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

function openDetailPage(type, id) {
    currentDetailType = type;
    currentDetailId = id;

    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    }
    );
    document.getElementById('detailPage').classList.remove('hidden');

    const backText = type === 'teacher' ? 'Back to Teachers' : 'Back to Students';
    const breadcrumbText = type === 'teacher' ? 'Teachers' : 'Students';

    document.getElementById('backButtonText').textContent = backText;
    document.getElementById('breadcrumbList').textContent = breadcrumbText;

    loadDetailContent(type, id);
}

function goBackToList() {
    document.getElementById('detailPage').classList.add('hidden');

    if (currentDetailType === 'teacher') {
        document.getElementById('teachersPage').classList.remove('hidden');
    } else {
        document.getElementById('studentsPage').classList.remove('hidden');
    }
}

async function loadDetailContent(type, id) {
    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = `
        <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    `;

    try {
        let data;
        if (type === 'teacher') {
            const response = await fetch(`https://6921b86c512fb4140be12281.mockapi.io/teachers/${id}`);
            if (!response.ok)
                throw new Error('Teacher not found');
            data = await response.json();
            renderTeacherDetail(data);
        } else {
            const response = await fetch(`https://6921b86c512fb4140be12281.mockapi.io/students/${id}`);
            if (!response.ok)
                throw new Error('Student not found');
            data = await response.json();
            renderStudentDetail(data);
        }
    } catch (error) {
        detailContent.innerHTML = `
            <div class="text-center py-12 text-red-600 dark:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p class="text-lg font-medium">Error loading details</p>
                <p class="text-sm">${error.message}</p>
            </div>
        `;
    }
}

function renderTeacherDetail(teacher) {
    const detailContent = document.getElementById('detailContent');
    document.getElementById('breadcrumbName').textContent = teacher.name;

    detailContent.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div class="text-card-foreground flex flex-col gap-6 rounded-xl border lg:col-span-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div class="[&:last-child]:pb-6 p-6">
                    <div class="flex flex-col items-center text-center">
                        <span class="relative flex size-10 shrink-0 overflow-hidden rounded-full h-32 w-32 mb-4 ring-4 ring-blue-100 dark:ring-blue-900">
                            ${teacher.avatar ? `<img class="aspect-square size-full" alt="${teacher.FirsName}" src="${teacher.avatar}">` : `<div class="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                                    ${getInitials(teacher.LastName)}
                                </div>`}
                        </span>
                        <h2 class="text-gray-900 dark:text-white mb-2 text-xl font-bold">${teacher.LastName}</h2>
                        <span class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 border-transparent bg-secondary text-secondary-foreground mb-4">
                            ${teacher.profession}
                        </span>
                        <div class="w-full space-y-4 mb-6">
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-600 dark:text-gray-400">Age</span>
                                <span class="text-gray-900 dark:text-white">${teacher.Age} years</span>
                            </div>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-600 dark:text-gray-400">Experience</span>
                                <span class="text-gray-900 dark:text-white">${teacher.experience} years</span>
                            </div>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-600 dark:text-gray-400">Gender</span>
                                <span class="text-gray-900 dark:text-white capitalize">${typeof teacher.gender === 'string' ? teacher.gender.toLowerCase() : (teacher.gender ? 'male' : 'female')}</span>
                            </div>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-600 dark:text-gray-400">Rating</span>
                                <div class="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star h-4 w-4 fill-yellow-400 text-yellow-400">
                                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                                    </svg>
                                    <div class="bg-primary/20 relative w-full overflow-hidden rounded-full h-2">
                                        <div class="bg-primary h-full w-full flex-1 transition-all" style="width: ${Math.min((teacher.rating / 5) * 100, 100)}%;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-full gap-2  bg-black dark:bg-white text-white dark:text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil h-4 w-4">
                                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                                <path d="m15 5 4 4"></path>
                            </svg>
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            <div class="text-card-foreground flex flex-col gap-6 rounded-xl border lg:col-span-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div dir="ltr" data-orientation="horizontal" class="flex flex-col gap-2 w-full">
                    <div class="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                        <div role="tablist" aria-orientation="horizontal" class="bg-muted text-muted-foreground h-9 items-center justify-center rounded-xl p-[3px] grid w-full grid-cols-2" tabindex="0" data-orientation="horizontal" style="outline: none;">
                            <button type="button" role="tab" aria-selected="true" aria-controls="contact-tab" data-state="active" class="data-[state=active]:bg-card dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4" tabindex="-1" data-orientation="horizontal">
                                Contact Info
                            </button>
                            <button type="button" role="tab" aria-selected="false" aria-controls="students-tab" data-state="inactive" class="data-[state=active]:bg-card dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4" tabindex="-1" data-orientation="horizontal">
                                Assigned Students 
                            </button>
                        </div>
                    </div>
                    <div class="px-6 [&:last-child]:pb-6">
                        <div data-state="active" data-orientation="horizontal" role="tabpanel" aria-labelledby="contact-tab" tabindex="0" class="flex-1 outline-none space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div class="flex items-center gap-3 mb-2">
                                        <div class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone h-5 w-5 text-blue-600 dark:text-blue-400">
                                                <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                                            <p class="text-gray-900 dark:text-white">${teacher.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div class="flex items-center gap-3 mb-2">
                                        <div class="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail h-5 w-5 text-green-600 dark:text-green-400">
                                                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                                                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                            <p class="text-gray-900 dark:text-white truncate">${teacher.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div class="flex items-center gap-3 mb-2">
                                        <div class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send h-5 w-5 text-blue-400">
                                                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                                                <path d="m21.854 2.147-10.94 10.939"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-600 dark:text-gray-400">Telegram</p>
                                            <p class="text-gray-900 dark:text-white">${teacher.telegram}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div class="flex items-center gap-3 mb-2">
                                        <div class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin h-5 w-5 text-blue-600 dark:text-blue-400">
                                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                                <rect width="4" height="12" x="2" y="9"></rect>
                                                <circle cx="4" cy="4" r="2"></circle>
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-600 dark:text-gray-400">LinkedIn</p>
                                            <p class="text-gray-900 dark:text-white truncate">${teacher.linkedin}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderStudentDetail(student) {
    const detailContent = document.getElementById('detailContent');
    document.getElementById('breadcrumbName').textContent = student.name;

    const displayGender = typeof student.gender === 'string' ? student.gender : (student.gender ? 'Male' : 'Female');

    detailContent.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div class="text-card-foreground flex flex-col gap-5 rounded-xl border lg:col-span-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div class="[&:last-child]:pb-4 p-4">
                    <div class="flex flex-col items-center text-center">
                        <span class="relative flex size-10 shrink-0 overflow-hidden rounded-full h-32 w-32 mb-4 ring-4 ring-purple-100 dark:ring-purple-900">
                            ${student.avatar ? `<img class="aspect-square size-full" alt="${student.firstname}" src="${student.avatar}">` : `<div class="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-4xl font-bold">
                                    ${getInitials(student.name)}
                                </div>`}
                        </span>
                        <h2 class="text-gray-900 dark:text-white mb-2 text-xl font-bold">${student.firstname} ${student.lastname}</h2>
                        <span class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 border-blue-500 text-blue-600 dark:text-blue-400 mb-4">
                            Grade ${student.profession}
                        </span>
                        <div class="w-full space-y-4 mb-6">
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-600 dark:text-gray-400">Age</span>
                                <span class="text-gray-900 dark:text-white">${student.age} years</span>
                            </div>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-600 dark:text-gray-400">Gender</span>
                                <span class="text-gray-900 dark:text-white capitalize">${displayGender.toLowerCase()}</span>
                            </div>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-600 dark:text-gray-400">Rating</span>
                                <div class="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star h-4 w-4 fill-yellow-400 text-yellow-400">
                                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                                    </svg>
                                    <span class="text-gray-900 dark:text-white">${student.rating}</span>
                                </div>
                            </div>
                            <div class="bg-primary/20 relative w-full overflow-hidden rounded-full h-2">
                                <div class="bg-primary h-full w-full flex-1 transition-all" style="width: ${Math.min((student.rating / 5) * 100, 100)}%;"></div>
                            </div>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-600 dark:text-gray-400">Coins</span>
                                <div class="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-coins h-4 w-4 text-yellow-500">
                                        <circle cx="8" cy="8" r="6"></circle>
                                        <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                                        <path d="M7 6h1v4"></path>
                                        <path d="m16.71 13.88.7.71-2.82 2.82"></path>
                                    </svg>
                                    <span class="text-gray-900 dark:text-white">${student.coins}</span>
                                </div>
                            </div>
                            <div class="bg-primary/20 relative w-full overflow-hidden rounded-full h-2">
                                <div class="bg-primary h-full w-full flex-1 transition-all" style="width: ${Math.min((student.coins / 500) * 100, 100)}%;"></div>
                            </div>
                        </div>
                        <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-full gap-2 bg-black dark:bg-white text-white dark:text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil h-4 w-4">
                                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                                <path d="m15 5 4 4"></path>
                            </svg>
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            <div class="text-card-foreground flex flex-col gap-6 rounded-xl border lg:col-span-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div dir="ltr" data-orientation="horizontal" class="flex flex-col gap-2 w-full">
                    <div class="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                        <div role="tablist" aria-orientation="horizontal" class="bg-muted text-muted-foreground h-9 items-center justify-center rounded-xl p-[3px] grid w-full grid-cols-3" tabindex="0" data-orientation="horizontal" style="outline: none;">
                            <button type="button" role="tab" aria-selected="true" aria-controls="contact-tab" data-state="active" class="data-[state=active]:bg-card dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4" tabindex="-1" data-orientation="horizontal">
                                Contact Info
                            </button>
                            <button type="button" role="tab" aria-selected="false" aria-controls="teacher-tab" data-state="inactive" class="data-[state=active]:bg-card dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4" tabindex="-1" data-orientation="horizontal">
                                Teacher
                            </button>
                            <button type="button" role="tab" aria-selected="false" aria-controls="statistics-tab" data-state="inactive" class="data-[state=active]:bg-card dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4" tabindex="-1" data-orientation="horizontal">
                                Statistics
                            </button>
                        </div>
                    </div>
                    <div class="px-6 [&:last-child]:pb-6">
                        <div data-state="active" data-orientation="horizontal" role="tabpanel" aria-labelledby="contact-tab" tabindex="0" class="flex-1 outline-none space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div class="flex items-center gap-3 mb-2">
                                        <div class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone h-5 w-5 text-blue-600 dark:text-blue-400">
                                                <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                                            <p class="text-gray-900 dark:text-white">${student.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div class="flex items-center gap-3 mb-2">
                                        <div class="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail h-5 w-5 text-green-600 dark:text-green-400">
                                                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                                                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                            <p class="text-gray-900 dark:text-white truncate">${student.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div class="flex items-center gap-3 mb-2">
                                        <div class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send h-5 w-5 text-blue-400">
                                                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                                                <path d="m21.854 2.147-10.94 10.939"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-600 dark:text-gray-400">Telegram</p>
                                            <p class="text-gray-900 dark:text-white">${student.telegram}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div class="flex items-center gap-3 mb-2">
                                        <div class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin h-5 w-5 text-blue-600 dark:text-blue-400">
                                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                                <rect width="4" height="12" x="2" y="9"></rect>
                                                <circle cx="4" cy="4" r="2"></circle>
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-600 dark:text-gray-400">LinkedIn</p>
                                            <p class="text-gray-900 dark:text-white truncate">${student.linkedin}</p>
                                        </div>
                               </div>
                                </div>
                                    <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div class="flex items-center gap-3 mb-2">
                                        <div class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap h-5 w-5 flex-shrink-0" aria-hidden="true"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-600 dark:text-gray-400">Teacher ID</p>
                                            <p class="text-gray-900 dark:text-white truncate">${student.teacherId}</p>
                                        </div>
                               </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getInitials(name) {
    if (!name)
        return '??';
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2);
}