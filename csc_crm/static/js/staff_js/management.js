
const departmentFilter = document.getElementById('departmentFilter');
const roleFilter = document.getElementById('roleFilter');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('staffSearch')

// ================== FORM VALIDATION (PAGE LOADING BUG) =======================

function applyFilters(){
    const department = departmentFilter.value;
    const role = roleFilter.value;

    const params = new URLSearchParams();

    if(department){
        params.append('department', department);
    }

    if(role){
        params.append('role', role)
    }

    window.location.href = `?${params.toString()}`;
}

departmentFilter.addEventListener('change', applyFilters);
roleFilter.addEventListener('change', applyFilters);

// ============================ PREVENT EMPTY SEARCH ============================

searchForm.addEventListener('submit', function(e){
    const searchValue = searchInput.value.trim();

    if(searchValue === ''){
        e.preventDefault();

        alert('Please enter a staff name to search');

        searchInput.focus();
    }
});