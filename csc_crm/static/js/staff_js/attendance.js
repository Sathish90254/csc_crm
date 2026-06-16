
setTimeout(function(){

    const messages = document.querySelectorAll('.success-message');

    messages.forEach(function(msg){

        msg.style.transition = "opacity 0.3s";

        msg.style.opacity = "0";

        setTimeout(function(){

            msg.remove();

        },300);

    });

},1000);


const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("staffSidebar");
const overlay = document.getElementById("overlay");
const closeSidebar = document.getElementById("closeSidebar");

console.log(menuToggle);
console.log(sidebar);
console.log(closeSidebar);

menuToggle.addEventListener("click", function () {

    console.log("MENU CLICKED");

    sidebar.classList.add("active");
    overlay.classList.add("active");
});

closeSidebar.addEventListener("click", function () {

    console.log("CLOSE CLICKED");

    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});

document.getElementById('attendance-filter-form').addEventListener('submit', function(e){

    e.preventDefault();

    const month = document.querySelector('[name="month"]').value;
    const year = document.querySelector('[name="year"]').value;
    const date = document.querySelector('[name="date"]').value;

    if(date){

        const selectedDate = new Date(date);

        const dateMonth = String(selectedDate.getMonth() + 1);
        const dateYear = String(selectedDate.getFullYear());

        if(month && month !== dateMonth){

            alert("Selected Date and Month do not match.");
            return;
        }

        if(year && year !== dateYear){

            alert("Selected Date and Year do not match.");
            return;
        }
    }

    const params = new URLSearchParams(
        new FormData(this)
    );

    fetch(window.location.pathname + '?' + params.toString())
    .then(response => response.text())
    .then(html => {

        const parser = new DOMParser();

        const doc = parser.parseFromString(html,'text/html');

        const newDashboard =
            doc.querySelector('#attendance-dashboard');

        document.querySelector('#attendance-dashboard').innerHTML =
            newDashboard.innerHTML;

    });

});