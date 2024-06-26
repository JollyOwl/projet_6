document.addEventListener("DOMContentLoaded", async () => {
  const worksData = await fetchWorks();
  const categories = await fetchCategories();
  if (categories) {
    createFilters(categories, worksData);
  }

  // Check if the user is logged in by looking for a token in sessionStorage
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  if (isLoggedIn) {
    console.log("User is logged in");
    // Change the background color of the modify button
    const modifyButton = document.getElementById("modifyButton");
    if (modifyButton) {
      modifyButton.style.display = "block";
    }
  }
});

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

function createFilters(categoriesData, worksData) {
  if (!categoriesData) {
    console.error("No categories data provided to create filters.");
    return;
  }

  const portfolioSection = document.getElementById("portfolio");
  const projets_wrapper = document.getElementById("projets_wrapper");

  const filterContainer = document.createElement("div");
  filterContainer.className = "filterContainer";
  projets_wrapper.insertAdjacentElement("beforeend", filterContainer);

  const allFilter = document.createElement("button");
  allFilter.className = "filter";
  allFilter.textContent = "Tous";
  allFilter.addEventListener("click", () => {
    addWorks(worksData);
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
      addWorks(filteredWorks);
    });
    filterContainer.appendChild(filter);
  });
}

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const responseLogIn = await fetch(
        "http://localhost:5678/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, password: password }),
        }
      );

      if (responseLogIn.ok) {
        const userData = await responseLogIn.json();
        console.log("Login successful:", userData);

        // Store the login state in sessionStorage
        sessionStorage.setItem("isLoggedIn", true);

        // Redirect to the main page
        window.location.href =
          "file:///Users/sarah-sophiethouabtia/Documents/Open%20Classroom/Projet-6/Portfolio-architecte-sophie-bluel/FrontEnd/index.html";
      } else if (responseLogIn.status === 404) {
        console.log("ID not found");
        document.getElementById("errorMessage").textContent = "ID not found";
      } else {
        console.log("Other error", responseLogIn.status);
        document.getElementById("errorMessage").textContent =
          "Other error: " + responseLogIn.status;
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("errorMessage").textContent =
        "Network error: " + error.message;
    }
  });
