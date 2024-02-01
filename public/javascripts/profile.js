// Add click event to follow
const follows = document.querySelectorAll(".follow");
follows.forEach((follow) => {
  follow.addEventListener("click", () => {
    queryFollow(follow, 2); // Remove user following item
  });
});

// Add click event to preview
const previews = document.querySelectorAll(".preview");
previews.forEach((preview) => {
  preview.addEventListener("click", () => {
    queryPreview(preview);
  });
});
