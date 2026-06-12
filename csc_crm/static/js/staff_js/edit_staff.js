
// ================================= GLOBAL VALIDATION FOR FORM =================================

function isFormValid() {

    const phone = document.getElementById('phoneInput').value.trim();

    const dobError = document.getElementById('dateOfBirthError').textContent;

    const phoneError = document.getElementById('phoneError').textContent;

    const emailError = document.getElementById('emailError').textContent;

    if (phone.length !== 10) {
        return false;
    }

    if (dobError !== '') {
        return false;
    }

    if (phoneError !== '') {
        return false;
    }

    if (emailError !== '') {
        return false;
    }

    return true;
}

// ====================== BLOCK EMPLOYEE ID EDITING ======================

document.addEventListener('DOMContentLoaded', () => {
    const employeeIdInput = document.querySelector('[name="employee_id"]');

    if (!employeeIdInput) return;

    const originalEmployeeId = employeeIdInput.value;

    // Make it readonly
    employeeIdInput.readOnly = true;

    // Stop typing
    employeeIdInput.addEventListener('keydown', (e) => {
        e.preventDefault();
    });

    // Stop paste
    employeeIdInput.addEventListener('paste', (e) => {
        e.preventDefault();
    });

    // Stop drag/drop text
    employeeIdInput.addEventListener('drop', (e) => {
        e.preventDefault();
    });

    // If any extension like FakeFiller changes it, restore old value
    employeeIdInput.addEventListener('input', () => {
        employeeIdInput.value = originalEmployeeId;
    });

    employeeIdInput.addEventListener('change', () => {
        employeeIdInput.value = originalEmployeeId;
    });
});

// ============================ EDIT FORM UPDATE BTN DISABLED ============================

let checkChanges;

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('staffMgmtForm');
    const updateBtn = document.getElementById('updateStaffBtn');

    const originalValues = {};

    form.querySelectorAll('input, select, textarea').forEach(field => {

        originalValues[field.name] = field.value;

    });

    checkChanges = function () {

        let changed = false;

        form.querySelectorAll('input, select, textarea').forEach(field => {

            if (field.value !== originalValues[field.name]) {
                changed = true;
            }

        });

        updateBtn.disabled = !(changed && isFormValid());

    };

    form.querySelectorAll('input, select, textarea').forEach(field => {

        field.addEventListener('input', checkChanges);
        field.addEventListener('change', checkChanges);

    });

});
// =================================== EMAIL EXISTING VALIDATION ===================================

document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('staffMgmtForm');
    const emailInput = document.getElementById('emailInput');
    const emailError = document.getElementById('emailError');
    const staffId = document.getElementById('staffId').value;

    let emailValid = true;

    emailInput.addEventListener('blur', async () => {
        
        const email = emailInput.value.trim()

        if(!email){
            emailError.textContent = '';
            emailInput.classList.remove('error-input');
            emailValid = true;
            return;
        }

        const response = await fetch(
            `/staff/check-email/?email=${encodeURIComponent(email)}&staff_id=${staffId}`
        );

        const data = await response.json()

        if(data.exists){
            emailError.textContent = 'This email already exists!'
            emailInput.classList.add('error-input')
            emailValid = false
        }
        else{
            emailError.textContent = ''
            emailInput.classList.remove('error-input')
            emailValid = true
            return;
        }
        if (typeof checkChanges === 'function') {
            checkChanges();
        }

    });

    form.addEventListener('submit', (e) => {
        if(!emailValid){
            e.preventDefault();

            emailError.textContent = 'This email already exists!';
            emailInput.classList.add('error-input')
        }
    })


})

// =================================== PHONE VALIDATION ===================================

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('staffMgmtForm');
    const phoneInput = document.getElementById('phoneInput');
    const phoneError = document.getElementById('phoneError');
    const staffId = document.getElementById('staffId').value;

    let phoneValid = true;

    phoneInput.addEventListener('input', async () => {

        // Only numbers allowed
        phoneInput.value = phoneInput.value.replace(/\D/g, '');

        // Maximum 10 digits
        if (phoneInput.value.length > 10) {
            phoneInput.value = phoneInput.value.substring(0, 10);
        }

        const phone = phoneInput.value.trim();

        // Empty field
        if (!phone) {
            phoneError.textContent = '';
            phoneInput.classList.remove('error-input');
            phoneValid = true;
            return;
        }

        // Less than 10 digits
        if (phone.length < 10) {

            phoneError.textContent =
                'Phone number must be 10 digits';

            phoneInput.classList.add('error-input');
            phoneValid = false;
            return;
        }

        // Exactly 10 digits -> check duplicate
        const response = await fetch(
            `/staff/check-phone/?phone=${encodeURIComponent(phone)}&staff_id=${staffId}`
        );

        const data = await response.json();

        if (data.exists) {

            phoneError.textContent =
                'This phone number already exists!';

            phoneInput.classList.add('error-input');
            phoneValid = false;

        } 
        else {

            phoneError.textContent = '';
            phoneInput.classList.remove('error-input');
            phoneValid = true;

        }

        if (typeof checkChanges === 'function') {
            checkChanges();
        }

    });

    form.addEventListener('submit', (e) => {

        const phone = phoneInput.value.trim();

        if (phone.length !== 10) {

            e.preventDefault();

            phoneError.textContent =
                'Phone number must be 10 digits';

            phoneInput.classList.add('error-input');

            return;
        }

        if (!phoneValid) {

            e.preventDefault();

            phoneError.textContent =
                'This phone number already exists!';

            phoneInput.classList.add('error-input');
        }

    });

});

// ========================== FIRST & LAST NAME CONTAINS ONLY STRINGS ============================

document.addEventListener('DOMContentLoaded', ()=>{
    const firstNameInput = document.getElementById('firstNameInput');
    
    firstNameInput.addEventListener('input', ()=>{
        firstNameInput.value = firstNameInput.value.replace(/[^a-zA-Z\s]/g, '');
    });

    const lastNameInput = document.getElementById('lastNameInput');

    lastNameInput.addEventListener('input', ()=>{
        lastNameInput.value = lastNameInput.value.replace(/[^a-zA-Z\s]/g, '');
    });
})

// ================================== DOB & DOJ ENHANCING ==================================

document.addEventListener('DOMContentLoaded', ()=>{
    const dateOfBirthInput = document.getElementById('dateOfBirthInput');
    const dateOfJoiningInput = document.getElementById('dateOfJoiningInput');

    function enableFullDatePicker(input){
        input.addEventListener('click', ()=>{
            if(input.showPicker){
                input.showPicker();
            }
        });
    }

    enableFullDatePicker(dateOfBirthInput);
    enableFullDatePicker(dateOfJoiningInput);

});

// =========================== DATE OF JOINING VALIDATION ==================================

document.addEventListener('DOMContentLoaded', () => {

    const dateOfJoiningInput = document.getElementById('dateOfJoiningInput');
    const dateOfJoiningError = document.getElementById('dateOfJoiningError');

    function validateDOJ() {
        if (!dateOfJoiningInput.value) {
            dateOfJoiningError.textContent = "Date of Joining is required";
            dateOfJoiningInput.classList.add("error-input");
        } else {
            dateOfJoiningError.textContent = "";
            dateOfJoiningInput.classList.remove("error-input");
        }
    }

    validateDOJ();

    dateOfJoiningInput.addEventListener("change", validateDOJ);
});

// ======================== DATE OF BIRTH VALIDATION ============================

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('staffMgmtForm');
    const dateOfBirthInput = document.getElementById('dateOfBirthInput');
    const dateOfBirthError = document.getElementById('dateOfBirthError');

    const originalDob = dateOfBirthInput.value;

    const today = new Date().toISOString().split('T')[0];
    dateOfBirthInput.setAttribute('max', today);

    function validateDOB() {

        if (!dateOfBirthInput.value) {

            dateOfBirthError.textContent = '';
            dateOfBirthInput.classList.remove('error-input');

            if (typeof checkChanges === 'function') {
                checkChanges();
            }

            return true;
        }

        const dob = new Date(dateOfBirthInput.value);
        const currentDate = new Date();

        if (dob > currentDate) {
            dateOfBirthError.textContent = 'Date of birth cannot be in the future';
            dateOfBirthInput.classList.add('error-input');

            if (typeof checkChanges === 'function') {
                checkChanges();
            }

            return false;
        }

        let age = currentDate.getFullYear() - dob.getFullYear();

        const monthDiff = currentDate.getMonth() - dob.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && currentDate.getDate() < dob.getDate())
        ) {
            age--;
        }

        if (age < 18) {
            dateOfBirthError.textContent = 'Employee must be at least 18 years old';
            dateOfBirthInput.classList.add('error-input');

            if (typeof checkChanges === 'function') {
                checkChanges();
            }

            return false;
        }

        dateOfBirthError.textContent = '';
        dateOfBirthInput.classList.remove('error-input');

        if (typeof checkChanges === 'function') {
            checkChanges();
        }

        return true;
    }

    dateOfBirthInput.addEventListener('change', validateDOB);
    dateOfBirthInput.addEventListener('input', validateDOB);

    form.addEventListener('submit', (e) => {
        if (!validateDOB()) {
            e.preventDefault();
        }
    });

});

// ============================== DEPARTMENT & ROLE AUTOMATICALLY SELECTED ==============================

document.addEventListener('DOMContentLoaded', () => {
    const roleInput = document.getElementById('roleInput');
    const departmentInput = document.getElementById('departmentInput');

    if (!roleInput || !departmentInput) return;

    const roleDepartmentMap = {
        'Developer': 'Technical',
        'Trainer': 'Technical',

        'Admin': 'Management',
        'Manager': 'Management',
        'HR': 'Management',

        'BDE': 'Sales Department',
        'Telecall': 'Sales Department',
        'Sales Exec': 'Sales Department',

        'Digital Marketing': 'Marketing',
        'Content Creator': 'Marketing'
    };

    function autoSelectDepartment() {
        const selectedRoleText =
            roleInput.options[roleInput.selectedIndex].text.trim();

        const departmentName = roleDepartmentMap[selectedRoleText];

        if (!departmentName) {
            departmentInput.value = '';
            return;
        }

        for (let option of departmentInput.options) {
            if (option.text.trim() === departmentName) {
                departmentInput.value = option.value;
                break;
            }
        }

        if (typeof checkChanges === 'function') {
            checkChanges();
        }
    }

    roleInput.addEventListener('change', autoSelectDepartment);

    // Block user from manually changing department
    departmentInput.addEventListener('mousedown', (e) => {
        e.preventDefault();
    });

    departmentInput.addEventListener('keydown', (e) => {
        e.preventDefault();
    });

    departmentInput.addEventListener('focus', () => {
        departmentInput.blur();
    });
});

// ============================== IMAGE UPLOAD HANDLING ==============================

document.addEventListener('DOMContentLoaded', () => {

    const photoInput = document.getElementById('profilePhotoInput');
    const removePhotoBtn = document.getElementById('removePhotoBtn');
    const progressBar = document.getElementById('photoProgressBar');
    const progressText = document.getElementById('progressText');
    const currentPhotoSection = document.getElementById('currentPhotoSection');

    if (!photoInput || !removePhotoBtn || !progressBar || !progressText) return;

    let previousFiles = [];
    let interval = null;

    function resetUploadUI() {
        progressBar.style.width = '0%';
        progressText.textContent = 'No file selected';
        removePhotoBtn.style.display = 'none';

        if (currentPhotoSection) {
            currentPhotoSection.style.display = '';
        }

        if (typeof checkChanges === 'function') {
            checkChanges();
        }
    }

    function showUploadedUI(message = '✓ Image Uploaded') {
        progressBar.style.width = '100%';
        progressText.textContent = message;
        removePhotoBtn.style.display = 'flex';

        if (currentPhotoSection) {
            currentPhotoSection.style.display = 'none';
        }

        if (typeof checkChanges === 'function') {
            checkChanges();
        }
    }

    function startProgress() {
        let progress = 0;

        if (interval) {
            clearInterval(interval);
        }

        progressBar.style.width = '0%';
        progressText.textContent = '0% Uploaded';

        interval = setInterval(() => {
            progress += 10;

            progressBar.style.width = progress + '%';
            progressText.textContent = progress + '% Uploaded';

            if (progress >= 100) {
                clearInterval(interval);
                progressText.textContent = '✓ Image Uploaded';
            }

        }, 50);
    }

    photoInput.addEventListener('click', () => {
        previousFiles = Array.from(photoInput.files);
    });

    photoInput.addEventListener('change', () => {

        // User opened file explorer and clicked Cancel
        if (photoInput.files.length === 0) {

            if (previousFiles.length > 0) {
                const dataTransfer = new DataTransfer();

                previousFiles.forEach(file => {
                    dataTransfer.items.add(file);
                });

                photoInput.files = dataTransfer.files;
                showUploadedUI('✓ Image Uploaded');
                return;
            }

            resetUploadUI();
            return;
        }

        previousFiles = Array.from(photoInput.files);

        if (currentPhotoSection) {
            currentPhotoSection.style.display = 'none';
        }

        removePhotoBtn.style.display = 'flex';

        startProgress();

        if (typeof checkChanges === 'function') {
            checkChanges();
        }
    });

    removePhotoBtn.addEventListener('click', () => {
        photoInput.value = '';
        previousFiles = [];

        if (interval) {
            clearInterval(interval);
        }

        resetUploadUI();
    });

});