
    setTimeout(() => {

        const messages = document.querySelector('.messages-container');

        if(messages){
            messages.style.opacity = '0';

            setTimeout(() => {
                messages.style.display = 'none';
            }, 500);
        }

    }, 3000);

const menuToggle = document.getElementById("menuToggle");
const moduleTabs = document.getElementById("moduleTabs");

menuToggle.addEventListener("click", () => {
    moduleTabs.classList.toggle("show");

    const icon = menuToggle.querySelector("i");

    if(moduleTabs.classList.contains("show")){
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
    }else{
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
    }
});
