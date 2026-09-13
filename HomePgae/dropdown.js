function toggleDropdown(event, button) {

    event.stopPropagation();

    const dropdown = button.closest(".dropdown");
    const list = dropdown.querySelector(".dropdown-list");
    const arrow = dropdown.querySelector(".arrow");

    list.classList.toggle("show");

    if (list.classList.contains("show")) {
        arrow.textContent = "⌃";
    } else {
        arrow.textContent = "⌄";
    }
}


function selectOption(event, item) {

    event.stopPropagation();

    const dropdown = item.closest(".dropdown");

    const selectedOption = dropdown.querySelector(".selectedOption");
    const list = dropdown.querySelector(".dropdown-list");
    const arrow = dropdown.querySelector(".arrow");

    selectedOption.textContent = item.textContent.trim();

    list.classList.remove("show");

    arrow.textContent = "⌄";
}