const searchInput = document.querySelector("#search-input")

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const searchTerm = searchInput.value.trim()
    if (!searchTerm) return;

    localStorage.setItem("movieSearch", searchTerm)
    window.location.href = "catalog.html"
  }
});

const searchButton = document.querySelector(".search__bar .btn")
searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim()
    if (!searchTerm) return;

    localStorage.setItem("movieSearch", searchTerm)
    window.location.href = "catalog.html"
});