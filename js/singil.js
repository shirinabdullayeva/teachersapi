
const apiUrl = "https://6921b86c512fb4140be12281.mockapi.io/teachers/"; 

async function loadTeacherData(teacherId = 1) {
    try {
        const res = await fetch(`${apiUrl}/${teacherId}`);
        const teacher = await res.json();

     
        document.getElementById("profileName").textContent = teacher.name;
        document.getElementById("profileSubject").textContent = teacher.company?.bs || "Subject";
        document.getElementById("profileAvatar").src = `${teacher.avatar}`;
        document.getElementById("breadcrumbName").textContent = teacher.name;
        document.getElementById("profileAge").textContent = Math.floor(Math.random() * 20) + 25 + " years";
        document.getElementById("profileExp").textContent = Math.floor(Math.random() * 15) + 5 + " years";
        document.getElementById("profileGender").textContent = Math.random() > 0.5 ? "Male" : "Female";
        const rating = (Math.random() * 2 + 3).toFixed(1);
        document.getElementById("profileRating").textContent = rating;
        document.getElementById("ratingBar").style.width = `${(rating / 5) * 100}%`;

       
        document.getElementById("contactPhone").textContent = teacher.phone;
        document.getElementById("contactTelegram").textContent = `@${teacher.telegram || teacher.username}`;
        document.getElementById("contactEmail").textContent = teacher.email;
        document.getElementById("contactLinkedIn").textContent = `linkedin.com/in/${teacher.linkadin || teacher.LastName}`;

      
        const assignedCount = Math.floor(Math.random() * 5) + 1;
        document.getElementById("assignedPanel").innerHTML = `
            <div class="p-6 rounded-xl border border-dashed border-gray-200 text-gray-600 text-center">
                <div class="font-medium text-gray-800">Assigned Students</div>
                <p class="mt-2 text-sm">This teacher has ${assignedCount} assigned student(s).</p>
            </div>
        `;
    } catch (err) {
        console.error("Failed to load teacher data", err);
    }
}


document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("tab-active", "bg-gray-100"));
        btn.classList.add("tab-active", "bg-gray-100");

        const tab = btn.dataset.tab;
        document.querySelectorAll(".panel").forEach(p => {
            if (p.dataset.panel === tab) p.classList.remove("hidden");
            else p.classList.add("hidden");
        });
    });
});

loadTeacherData();


fetch("https://6921b86c512fb4140be12281.mockapi.io/teachers/").then((res) =>
    res.json()
).then((data) => (
    console.log(data)
))