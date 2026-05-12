document.addEventListener("DOMContentLoaded", function () {

    //=== ELEMENTS ===
    const form = document.getElementById("filterForm");
    const pipelineData = document.getElementById("pipelineData");

    const searchBtn = document.getElementById("searchBtn");
    const clearBtn = document.getElementById("clearBtn");
    const staffSelect = document.getElementById("staffSelect");
    const searchInput = document.getElementById("searchInput");

    if (!form || !pipelineData) return;

    // === AJAX LOAD ===
    async function loadData() {

        const formData = new FormData(form);
        const params = new URLSearchParams(formData);

        const response = await fetch(`?${params.toString()}`, {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });

        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const newData = doc.getElementById("pipelineData");

        if (newData) {
            pipelineData.innerHTML = newData.innerHTML;

            bindKanban();
        }
    }

    //=== SEARCH BUTTON ===
    searchBtn.addEventListener("click", function (e) {
        e.preventDefault();
        loadData();
    });

    // === STAFF FILTER ===
    staffSelect.addEventListener("change", function () {
        loadData();
    });

    //=== CLEAR BUTTON LOGIC ===

    let clearIntervalRef = null;
    let clearTimeoutRef = null;

    // 1 CLICK = ONE LETTER DELETE
    clearBtn.addEventListener("click", function () {

        // if long press is running, ignore click
        if (clearIntervalRef) return;

        searchInput.value = searchInput.value.slice(0, -1);

        if (searchInput.value.length === 0) {
            loadData();
        }
    });

    // === LONG PRESS CLEAR ===
    clearBtn.addEventListener("mousedown", function () {

        clearTimeoutRef = setTimeout(() => {

            clearIntervalRef = setInterval(() => {

                if (searchInput.value.length > 0) {
                    searchInput.value = searchInput.value.slice(0, -1);
                }

                if (searchInput.value.length === 0) {
                    stopClear();
                    loadData();
                }

            }, 70);

        }, 400);

    });

    clearBtn.addEventListener("mouseup", stopClear);
    clearBtn.addEventListener("mouseleave", stopClear);
    clearBtn.addEventListener("touchend", stopClear);

    function stopClear() {
        clearTimeout(clearTimeoutRef);
        clearInterval(clearIntervalRef);
        clearTimeoutRef = null;
        clearIntervalRef = null;
    }

    // === KANBAN FIX ===
    function bindKanban() {

        function getKanban() {
            return document.getElementById("kanbanContainer");
        }

        window.moveLeft = function () {
            const kanban = getKanban();
            if (!kanban) return;

            kanban.scrollBy({
                left: -320,
                behavior: "smooth"
            });
        };

        window.moveRight = function () {
            const kanban = getKanban();
            if (!kanban) return;

            kanban.scrollBy({
                left: 320,
                behavior: "smooth"
            });
        };
    }

    bindKanban();

});