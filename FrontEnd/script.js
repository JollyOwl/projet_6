//Start whe DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  fetchWorks();
});

// Define the addData function
function addData(worksData) {
  worksData.forEach((item) => {
    const figuresContainer = document.getElementById("gallery");
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    figuresContainer.appendChild(figure);
    figure.appendChild(img);
    figure.appendChild(figcaption);
    img.src = item.imageUrl;
    img.alt = item.title;
    figcaption.textContent = item.title;
  });
}

// Define the fetchWorks function
async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const worksData = await response.json();
    console.log(worksData);
    addData(worksData);
  } catch (error) {
    console.error("Error fetching works:", error);
  }
}
