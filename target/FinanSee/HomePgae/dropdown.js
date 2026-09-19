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


function selectOption(event, elemento) {

    event.stopPropagation();

    const dropdown = elemento.closest(".dropdown");

    if (!dropdown) {
        return;
    }

    const selectedOption =
        dropdown.querySelector(".selectedOption");

    if (!selectedOption) {
        return;
    }

    selectedOption.innerHTML =
        elemento.innerHTML;

    selectedOption.dataset.categoria =
        elemento.dataset.categoria;

    dropdown.classList.remove("ativo");
}