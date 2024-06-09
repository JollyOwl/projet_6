// Start when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  const worksData = await fetchWorks();
  const categories = await fetchCategories();
  if (categories) {
    createFilters(categories, worksData);
  }
});

// Define the addWorks function
function addWorks(worksData) {
  const figuresContainer = document.getElementById("gallery");
  figuresContainer.innerHTML = ""; // Clear existing works
  worksData.forEach((item) => {
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
    const responseWorks = await fetch("http://localhost:5678/api/works");
    if (!responseWorks.ok) {
      throw new Error(
        "Network response was not ok " + responseWorks.statusText
      );
    }
    const worksData = await responseWorks.json();
    console.log(worksData);
    addWorks(worksData);
    return worksData;
  } catch (error) {
    console.error("Error fetching works:", error);
    return [];
  }
}

// Fetch categories from API
async function fetchCategories() {
  try {
    const responseCategories = await fetch(
      "http://localhost:5678/api/categories"
    );
    if (!responseCategories.ok) {
      throw new Error(
        "Network response was not ok " + responseCategories.statusText
      );
    }
    const categoriesData = await responseCategories.json();
    console.log(categoriesData);
    return categoriesData;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Create Filters in the DOM
function createFilters(categoriesData, worksData) {
  if (!categoriesData) {
    console.error("No categories data provided to create filters.");
    return;
  }

  const portfolioSection = document.getElementById("portfolio");
  const h2Portfolio = portfolioSection.querySelector("h2");

  // Create a single filter container
  const filterContainer = document.createElement("div");
  filterContainer.className = "filterContainer";
  h2Portfolio.insertAdjacentElement("afterend", filterContainer);

  // Create a 'Show All' filter
  const allFilter = document.createElement("button");
  allFilter.className = "filter";
  allFilter.textContent = "Tous";
  allFilter.addEventListener("click", () => {
    addWorks(worksData); // Show all works
  });
  filterContainer.appendChild(allFilter);

  categoriesData.forEach((category) => {
    const filter = document.createElement("button");
    filter.className = "filter";
    filter.textContent = category.name;
    filter.addEventListener("click", () => {
      const filteredWorks = worksData.filter(
        (work) => work.categoryId === category.id
      );
      addWorks(filteredWorks); // Show filtered works
    });
    filterContainer.appendChild(filter);
  });
}
