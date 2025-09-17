// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {

    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const resultsDiv = document.getElementById("results");

    // Handle form submission
    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent page reload

        const query = searchInput.value.trim();
        if (!query) {
            alert("Please enter a food item to search!");
            return;
        }

        // Clear previous results
        resultsDiv.innerHTML = "<p>Loading...</p>";

        try {
            // Call backend API
            const response = await fetch(`/api/fooditem/search?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            // Render results
            if (data.length === 0) {
                resultsDiv.innerHTML = "<p>No results found.</p>";
            } else {
                resultsDiv.innerHTML = ""; // clear loading
                data.forEach(item => {
                    const card = document.createElement("div");
                    card.className = "food-card";
                    card.innerHTML = `
                        <h3>${item.name}</h3>
                        <p>Calories: ${item.calories}</p>
                        <p>Category: ${item.category}</p>
                    `;
                    resultsDiv.appendChild(card);
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            resultsDiv.innerHTML = "<p>Error fetching results. Try again later.</p>";
        }
    });

});
