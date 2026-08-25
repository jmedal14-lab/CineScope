function toggleContrast(event) {
  event.preventDefault();

  document.body.classList.toggle("dark-theme");

  const isDarkMode = document.body.classList.contains("dark-theme")

  localStorage.setItem("darkMode", isDarkMode)
}

const savedTheme = localStorage.getItem("darkMode")

if (savedTheme === "true") {
  document.body.classList.add("dark-theme")
}

function openMenu() {
  document.body.classList += " menu--open";
}

function closeMenu() {
  document.body.classList.remove("menu--open");
}