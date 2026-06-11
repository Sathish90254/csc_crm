    // ===================== EMAIL VALIDATION =============================

    document.addEventListener('DOMContentLoaded', () => {
        const emailInput = document.getElementById('emailInput');
        const emailError = document.getElementById('emailError');

        emailInput.addEventListener('blur', async () =>{

            const email = emailInput.value.trim();

            if(!email){
                emailError.textContent = '';
                emailInput.classList.remove('error-input');
                return;
            }

            const response = await fetch(`/staff/check-email/?email=${encodeURIComponent(email)}`);

            const data = await response.json()

            if(data.exists){
                emailError.textContent = "This email is already exists!"
                emailInput.classList.add('error-input')
            }
            else{
                emailError.textContent = '';
                emailInput.classList.remove('error-input')
            }
        });
    });

    // ============================= PHONE NUMBER VALIDATION =============================

    document.addEventListener('DOMContentLoaded', ()=>{
            phoneInput.addEventListener('blur', async () => {

            const phone = phoneInput.value.trim();

            if (!phone) {
                phoneError.textContent = '';
                phoneInput.classList.remove('error-input');
                return;
            }

            if (phone.length !== 10) {
                phoneError.textContent =
                    'Phone number must be 10 digits';

                phoneInput.classList.add('error-input');
                return;
            }

            const response = await fetch(
                `/staff/check-phone/?phone=${encodeURIComponent(phone)}`
            );

            const data = await response.json();

            if (data.exists) {
                phoneError.textContent =
                    'This phone number already exists!';

                phoneInput.classList.add('error-input');
            } else {
                phoneError.textContent = '';
                phoneInput.classList.remove('error-input');
            }
        });
    })

    // ================================= MUST CONTAIN 10-DIGITS ==================================

    document.addEventListener('DOMContentLoaded', ()=>{
        const phoneInput = document.getElementById('phoneInput');
        const phoneError = document.getElementById('phoneError');

        phoneInput.addEventListener('input', ()=>{
            const phone = phoneInput.value

            if(phone.length > 10){
                phoneInput.value = phone.substring(0, 10);
            }

            if(phone.length > 0 && phone.length < 10){
                phoneError.textContent = 'Phone number must be 10 digits'
                phoneInput.classList.add('error-input')
            }
            else{
                phoneError.textContent = ''
                phoneInput.classList.remove('error-input')
            }
        })
    })

    // =============================== PHONE NO CONTAINS ONLY NUMBERS ===============================

    document.addEventListener('DOMContentLoaded', () => {
        const phoneInput = document.getElementById('phoneInput');

        phoneInput.addEventListener('input', () => {
            phoneInput.value = phoneInput.value.replace(/\D/g, '');
        })
    })

    // ======================== FIRST NAME AND LAST NAME CONTAINS ONLY STRINGS =======================

    document.addEventListener('DOMContentLoaded', () => {
        const firstNameInput = document.getElementById('firstNameInput')

        firstNameInput.addEventListener('input', () => {
            firstNameInput.value = firstNameInput.value.replace(/[^a-zA-Z\s]/g, '');
        })
    })

    document.addEventListener('DOMContentLoaded', () => {
        const lastNameInput = document.getElementById('lastNameInput');

        lastNameInput.addEventListener('input', () => {
            lastNameInput.value = lastNameInput.value.replace(/[^a-zA-Z\s]/g, '');
        })
    })

    // =========================== DOB & DOJ DATE PICKER UX ============================

    document.addEventListener('DOMContentLoaded', () => {
        const dateOfBirthInput = document.getElementById('dateOfBirthInput');
        const dateOfJoiningInput = document.getElementById('dateOfJoiningInput');

        function enableFullDatePicker(input){
            input.addEventListener('click', () => {
                if(input.showPicker){
                    input.showPicker()
                }
            });
        }
        enableFullDatePicker(dateOfBirthInput);
        enableFullDatePicker(dateOfJoiningInput);
    })

    // ======================== DATE OF BIRTH VALIDATION ============================

    document.addEventListener('DOMContentLoaded', ()=>{
        const dateOfBirthInput = document.getElementById('dateOfBirthInput');
        const dateOfBirthError = document.getElementById('dateOfBirthError');

        const today = new Date().toISOString().split('T')[0];
        dateOfBirthInput.setAttribute('max', today);

        dateOfBirthInput.addEventListener('change', () => {
            const dob = new Date(dateOfBirthInput.value)
            const currentDate = new Date()

            if(dob > currentDate){
                dateOfBirthError.textContent = 'Date of birth cannot be in the future';
                dateOfBirthInput.classList.add('error-input');
                return;
            }

            let age = currentDate.getFullYear() - dob.getFullYear();

            const monthDiff = currentDate.getMonth() - dob.getMonth();

            if(
                monthDiff < 0 ||
                (monthDiff === 0 &&
                currentDate.getDate() < dob.getDate())
            ){
                age--;
            }

            if(age<18){
                dateOfBirthError.textContent = 'Employee must be at least 18 years old';
                dateOfBirthInput.classList.add('error-input');
                return;
            }

            dateOfBirthError.textContent = '';
            dateOfBirthInput.classList.remove('error-input');
        })
    })

// ============================== DEPARTMENT & ROLE AUTOMATICALLY SELECTED ==============================

document.addEventListener('DOMContentLoaded', () => {
    const roleInput = document.getElementById('roleInput');
    const departmentInput = document.getElementById('departmentInput');

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
    }

    // Auto select department when role changes
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

    // Optional: auto-select once on page load
    autoSelectDepartment();
});

// ====================== FILE UPLOAD HANDLING ======================

document.addEventListener('DOMContentLoaded', () => {

    function setupFileUpload(inputId, removeBtnId, progressBarId, progressTextId, successMessage) {
        const fileInput = document.getElementById(inputId);
        const removeBtn = document.getElementById(removeBtnId);
        const progressBar = document.getElementById(progressBarId);
        const progressText = document.getElementById(progressTextId);

        let previousFiles = [];
        let interval = null;

        function resetUploadUI() {
            progressBar.style.width = '0%';
            progressText.textContent = 'No file selected';
            removeBtn.style.display = 'none';
        }

        function showUploadedUI() {
            progressBar.style.width = '100%';
            progressText.textContent = successMessage;
            removeBtn.style.display = 'flex';
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
                    progressText.textContent = successMessage;
                }
            }, 50);
        }

        fileInput.addEventListener('click', () => {
            previousFiles = Array.from(fileInput.files);
        });

        fileInput.addEventListener('change', () => {

            // If user opened file explorer and clicked Cancel
            if (fileInput.files.length === 0) {

                // Restore old selected file if possible
                if (previousFiles.length > 0) {
                    const dataTransfer = new DataTransfer();

                    previousFiles.forEach(file => {
                        dataTransfer.items.add(file);
                    });

                    fileInput.files = dataTransfer.files;
                    showUploadedUI();
                    return;
                }

                resetUploadUI();
                return;
            }

            previousFiles = Array.from(fileInput.files);
            removeBtn.style.display = 'flex';
            startProgress();
        });

        removeBtn.addEventListener('click', () => {
            fileInput.value = '';
            previousFiles = [];

            if (interval) {
                clearInterval(interval);
            }

            resetUploadUI();
        });
    }

    setupFileUpload(
        'profilePhotoInput',
        'removePhotoBtn',
        'photoProgressBar',
        'progressText',
        '✓ Image Uploaded'
    );

    setupFileUpload(
        'documentInput',
        'removeDocumentBtn',
        'documentProgressBar',
        'documentprogressText',
        '✓ File Uploaded'
    );

});
    // ====================== MONTHLY TARGET VALIDATION ======================

    document.addEventListener('DOMContentLoaded', () => {

        const form = document.getElementById('staffMgmtForm');
        const monthlyTargetInput = document.getElementById('monthlyTargetInput');
        const monthlyTargetError = document.getElementById('monthlyTargetError');

        monthlyTargetInput.addEventListener('input', () => {

            const target = parseFloat(monthlyTargetInput.value);

            if (target <= 0) {

                monthlyTargetError.textContent =
                    'Monthly target must be greater than 0';

                monthlyTargetInput.classList.add('error-input');

            } else {

                monthlyTargetError.textContent = '';
                monthlyTargetInput.classList.remove('error-input');

            }

        });

        form.addEventListener('submit', (e) => {

            const target = parseFloat(monthlyTargetInput.value);

            if (!target || target <= 0) {

                e.preventDefault();

                monthlyTargetError.textContent =
                    'Monthly target must be greater than 0';

                monthlyTargetInput.classList.add('error-input');

            }

        });

    });