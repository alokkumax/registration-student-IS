const studentForm = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const studentIdInput = document.getElementById("studentID");
const emailInput = document.getElementById("email");
const contactInput = document.getElementById("contact");
const studentData = document.getElementById("studentData");

const students = [];
let editIndex = -1;

function renderStudents() {
    studentData.innerHTML = "";

    students.forEach((student, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.studentID}</td>
            <td>${student.email}</td>
            <td>${student.contact}</td>
            <td><button type="button" data-index="${index}">Edit</button></td>
        `;
        studentData.appendChild(row);
    });
}

function resetForm() {
    studentForm.reset();
    editIndex = -1;
    studentForm.querySelector("button[type='submit']").textContent = "Add Student";
}

studentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formValue = {
        name: nameInput.value.trim(),
        studentID: studentIdInput.value.trim(),
        email: emailInput.value.trim(),
        contact: contactInput.value.trim()
    };

    if (editIndex === -1) {
        students.push(formValue);
    } else {
        students[editIndex] = formValue;
    }

    renderStudents();
    resetForm();
});

studentData.addEventListener("click", (event) => {
    if (event.target.tagName !== "BUTTON") {
        return;
    }

    const index = Number(event.target.dataset.index);
    const student = students[index];

    nameInput.value = student.name;
    studentIdInput.value = student.studentID;
    emailInput.value = student.email;
    contactInput.value = student.contact;

    editIndex = index;
    studentForm.querySelector("button[type='submit']").textContent = "Update Student";
});
