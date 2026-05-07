// Call-Logs //
    
    function openPopup(name, date, time, duration, outcome, notes, follow) {
        document.getElementById("p_name").innerText = name;
        document.getElementById("p_date").innerText = date;
        document.getElementById("p_time").innerText = time;
        document.getElementById("p_duration").innerText = duration;
        document.getElementById("p_outcome").innerText = outcome;
        document.getElementById("p_notes").innerText = notes;
        document.getElementById("p_follow").innerText = follow;

        document.getElementById("popup").style.display = "block";
    }

    function closePopup() {
        document.getElementById("popup").style.display = "none";
    }


    function validateForm() {
        let name = document.getElementById("lead_name").value.trim();
        let error = document.getElementById("name_error");

        if (name === "") {
            error.innerText = "Enter valid name";
            return false; 
        } else {
            error.innerText = "";
            return true; 
        }
    }
    function openPopup(name, date, time, duration, outcome, notes, follow) {
    document.getElementById("p_name").innerText = name;
    document.getElementById("p_date").innerText = date;
    document.getElementById("p_time").innerText = time;
    document.getElementById("p_duration").innerText = duration;
    document.getElementById("p_outcome").innerText = outcome;
    document.getElementById("p_notes").innerText = notes;
    document.getElementById("p_follow").innerText = follow;

    document.getElementById("popup").style.display = "block";
    }

    function closePopup() {
        document.getElementById("popup").style.display = "none";
    }


    function validateForm() {
        let name = document.getElementById("lead_name").value.trim();
        let error = document.getElementById("name_error");

        if (name === "") {
            error.innerText = "Enter valid name";
            return false; 
        } else {
            error.innerText = "";
            return true; 
        }
    }