
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

// Hamburger

document.addEventListener("DOMContentLoaded", function () {

    const navToggle = document.getElementById("attnavToggle");
    const navTabs = document.getElementById("attnavTabs");

    if (!navToggle || !navTabs) return;

    let isOpen = false;

    navToggle.addEventListener("click", function (e) {
        e.stopPropagation();

        isOpen = !isOpen;

        navTabs.classList.toggle("show", isOpen);
        document.body.classList.toggle("menu-open", isOpen);
    });

    navTabs.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    document.addEventListener("click", function () {
        isOpen = false;
        navTabs.classList.remove("show");
        document.body.classList.remove("menu-open");
    });

});