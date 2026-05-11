window.moveLeft = function () {
    document.querySelector(".kanban-container")
        ?.scrollBy({
            left: -350,
            behavior: "smooth"
        });
};

window.moveRight = function () {
    document.querySelector(".kanban-container")
        ?.scrollBy({
            left: 350,
            behavior: "smooth"
        });
};


const pipelineForm =
    document.getElementById("filterForm");

const pipelineData =
    document.getElementById("pipelineData");


async function loadData() {

    const formData =
        new FormData(pipelineForm);

    const params =
        new URLSearchParams(formData);

    const response =
        await fetch(`?${params.toString()}`, {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });

    const html =
        await response.text();

    const parser =
        new DOMParser();

    const doc =
        parser.parseFromString(html, "text/html");

    const newData =
        doc.getElementById("pipelineData");

    pipelineData.innerHTML =
        newData.innerHTML;
}


pipelineForm?.addEventListener(
    "submit",
    function(e){
        e.preventDefault();
        loadData();
    }
);


document.querySelector(".search-input")
?.addEventListener("input", loadData);


document.querySelector(".filter-select")
?.addEventListener("change", loadData);