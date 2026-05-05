 // Error Message for Phone no //
    const phoneInput = document.getElementById('phone_no');
    const phoneError = document.getElementById('phoneError');
    const form = document.getElementById('leadForm');

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
            error.innerText = "Enter valid phone number"
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
    }

    // Shows Calender when click the enquiry field //

    document.getElementById("enquiryDate").addEventListener("click", function() {
    this.showPicker();
    });

    // Shows Calender when click the Next_followup field //

    document.getElementById('nextFollowUpDate').addEventListener("click", function(){
        this.showPicker();
    })
