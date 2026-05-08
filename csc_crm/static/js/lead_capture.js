 // Error Message for Phone no //
    const phoneInput = document.getElementById('phone_no');
    const phoneError = document.getElementById('phoneError');
    const form = document.getElementById('leadForm');
    const duplicateEmailError = document.getElementById('emailError');
    const duplicatePhoneError = document.getElementById('phoneError');
    const submitBtn = document.getElementById('submit-btn');
    const leadId = document.getElementById('leadId')?.value || '';
    const leadNameInput = document.getElementById('id_lead_name')
    

    // Lead name validation
    leadNameInput.addEventListener('input', function(){
        this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
    })

    phoneInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');

        if (value.length > 12){
            phoneError.innerText = "Maximum 12 digits only!";
        }
        else if (value.length < 10){
            phoneError.innerText = "Minimum 10 digits required"
        }
        else{
            phoneError.innerText = "";
        }
        this.value = value.slice(0, 12)
    });

    form.addEventListener('submit', function(e){
        let value = phoneInput.value

        if (value.length < 10 || value.length > 12){
            e.preventDefault()
            phoneError.innerText = "Enter valid phone number"
        }
    });

    form.addEventListener('submit', (event)=>{
        let email = document.getElementById('email').value;
        let emailError = document.getElementById('emailError');

        emailError.innerText = "";
        let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

        if(email === ""){
            emailError.innerText = "Email is required";
            event.preventDefault();
        }
        else if(!pattern.test(email)) {
            emailError.innerText = "Enter a valid email";
            event.preventDefault();
        }
    })

    // Clear button to clear the input fields

    function clearForm(){

    document.getElementById('leadForm').reset();

    // Clear error messages
    phoneError.innerText = "";
    duplicatePhoneError.innerText = "";
    duplicateEmailError.innerText = "";

    // Remove borders
    document.getElementById('phone_no').style.border = "";
    document.getElementById('email').style.border = "";

    // Enable submit button
    submitBtn.disabled = false;
    submitBtn.style.opacity = "1";
    submitBtn.style.cursor = "pointer";
}
    // Shows Calender when click the enquiry field //

    document.getElementById("enquiryDate").addEventListener("click", function() {
    this.showPicker();
    });

    // Shows Calender when click the Next_followup field //

    document.getElementById('nextFollowUpDate').addEventListener("click", function(){
        this.showPicker();
    })

    // Disable and enable Save lead Button

    function toggleSubmitButton(){
        if(duplicateEmailError.innerText !== "" || duplicatePhoneError.innerText !== ""){
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.6";
            submitBtn.style.cursor = "not-allowed";
        }
        else{
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
            submitBtn.style.cursor = "pointer"
        }
    }

    async function checkLeadExists(field, value){

        if(!value.trim()) return;

        try{
            const response = await fetch(
                `/check-lead/?${field}=${value}&lead_id=${leadId}`
            );

            const data = await response.json()

            // Email Duplicate Check
            if(field === 'email'){

                if(data.email_exists){
                    duplicateEmailError.innerText = "This email already exists";
                    document.getElementById('email').style.border = "1px solid red"
                }
                else{
                    duplicateEmailError.innerText = ""
                    document.getElementById('email').style.border = "";
                }
            }

            if(field === 'phone'){

                if(data.phone_exists){
                    duplicatePhoneError.innerText = "This number already exists";
                    document.getElementById('phone_no').style.border = "1px solid red"
                }
                else{
                    duplicatePhoneError.innerText = "";
                    document.getElementById('phone_no').style.border = ""
                }
            }

            // Enable/Disable Submit Button
            toggleSubmitButton();
        }
        catch(error){
        console.log(error);
        }
    }

    // Trigger duplicate check
    document.getElementById('email').addEventListener('blur', function(){
    checkLeadExists('email', this.value);
    });

    document.getElementById('phone_no').addEventListener('blur', function(){
        checkLeadExists('phone', this.value);
    });