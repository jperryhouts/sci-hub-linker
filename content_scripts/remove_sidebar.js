function hideSciHubSidebar() {
  const sidebar = document.getElementById("menu");
  if (sidebar) {
    sidebar.style.display = "none";
  }

  const article = document.getElementById("article");
  if (article) {
    article.style.marginLeft = "0";
  }
}

console.info("Removing Sci-Hub sidebar");
hideSciHubSidebar();
