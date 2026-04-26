// basic element references
const studentForm = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const studentIdInput = document.getElementById("studentID");
const emailInput = document.getElementById("email");
const contactInput = document.getElementById("contact");
const studentData = document.getElementById("studentData");
const submitButton = document.getElementById("submitBtn");
const formTitle = document.getElementById("formTitle");
const totalStudentsCount = document.getElementById("totalStudents");
const lastUpdateSpan = document.getElementById("lastUpdate");

// load saved students
let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;

function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
    updateHeaderStats();
}

function updateHeaderStats() {
    totalStudentsCount.textContent = `${students.length} Student${students.length !== 1 ? 's' : ''}`;
    const now = new Date();
    lastUpdateSpan.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function clearForm() {
    studentForm.reset();
    editIndex = -1;
    formTitle.innerHTML = `<i class="fa-solid fa-user-plus"></i> Add Student`;
    submitButton.innerHTML = `<i class="fa-solid fa-plus"></i> <span>Add Student</span>`;
    
    // Reset button style to primary
    submitButton.classList.remove('bg-pink-500', 'hover:bg-pink-600');
    submitButton.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
}

function isValidForm(name, id, email, contact) {
    const nameRegex = /^[A-Za-z ]+$/;
    const idRegex = /^[0-9]+$/;
    const contactRegex = /^[0-9]{10,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !id || !email || !contact) {
        alert("Please fill all fields.");
        return false;
    }
    if (!nameRegex.test(name)) {
        alert("Name should contain only letters.");
        return false;
    }
    if (!idRegex.test(id)) {
        alert("ID should contain only numbers.");
        return false;
    }
    if (!contactRegex.test(contact)) {
        alert("Contact should be at least 10 digits.");
        return false;
    }
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email.");
        return false;
    }
    return true;
}

function renderTable() {
    studentData.innerHTML = "";

    if (students.length === 0) {
        studentData.innerHTML = `
            <tr>
                <td colspan="5" class="p-12 text-center text-slate-400 italic">
                    <i class="fa-solid fa-folder-open text-4xl block mb-4 opacity-20"></i>
                    No student records found.
                </td>
            </tr>`;
        return;
    }

    students.forEach((s, index) => {
        const row = document.createElement("tr");
        row.className = "hover:bg-white/60 transition-colors";
        row.innerHTML = `
            <td class="p-4 font-medium">${s.name}</td>
            <td class="p-4"><span class="font-mono bg-slate-100 px-2 py-1 rounded text-xs">${s.studentID}</span></td>
            <td class="p-4 text-slate-600 text-sm">${s.email}</td>
            <td class="p-4 text-slate-600 text-sm">${s.contact}</td>
            <td class="p-4">
                <div class="flex gap-2">
                    <button class="action-btn bg-slate-100 text-indigo-600 hover:bg-indigo-600 hover:text-white" title="Edit" onclick="editStudent(${index})">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="action-btn bg-red-50 text-red-500 hover:bg-red-500 hover:text-white" title="Delete" onclick="deleteStudent(${index})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
        `;
        studentData.appendChild(row);
    });
}

window.editStudent = function(index) {
    const s = students[index];
    nameInput.value = s.name;
    studentIdInput.value = s.studentID;
    emailInput.value = s.email;
    contactInput.value = s.contact;
    editIndex = index;
    
    formTitle.innerHTML = `<i class="fa-solid fa-user-pen"></i> Edit Student`;
    submitButton.innerHTML = `<i class="fa-solid fa-check"></i> <span>Update Student</span>`;
    
    // Change button style to secondary (pink)
    submitButton.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
    submitButton.classList.add('bg-pink-500', 'hover:bg-pink-600');
    
    if (window.innerWidth <= 1024) {
        studentForm.scrollIntoView({ behavior: 'smooth' });
    }
};

window.deleteStudent = function(index) {
    if (confirm("Are you sure you want to delete this record?")) {
        students.splice(index, 1);
        if (editIndex === index) clearForm();
        else if (editIndex > index) editIndex--;
        saveData();
        renderTable();
    }
};

studentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = nameInput.value.trim();
    const id = studentIdInput.value.trim();
    const email = emailInput.value.trim();
    const contact = contactInput.value.trim();

    if (!isValidForm(name, id, email, contact)) return;

    const studentObj = { name, studentID: id, email, contact };

    if (editIndex === -1) students.push(studentObj);
    else students[editIndex] = studentObj;

    saveData();
    renderTable();
    clearForm();
});

updateHeaderStats();
renderTable();


