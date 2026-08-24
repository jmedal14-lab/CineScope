function toggleContrast(event) {
  event.preventDefault();
  document.body.classList.toggle("dark-theme");
}

function openMenu() {
  document.body.classList += " menu--open";
}

function closeMenu() {
  document.body.classList.remove("menu--open");
}