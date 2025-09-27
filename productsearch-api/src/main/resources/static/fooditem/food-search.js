document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const resultsDiv = document.getElementById("results");

  function renderItem(item) {
    const card = document.createElement("div");
    card.className = "food-card";

    const name = item.name || "Unknown";
    const price = (item.price !== undefined && item.price !== null) ? `₹${item.price}` : "Price N/A";
    const rating = (item.rating !== undefined && item.rating !== null) ? item.rating : "—";
    const category = item.category || "Uncategorized";

    let img = item.imageUrl || item.image_url || item.image || "/images/default-food.png";

    if (typeof img === "string" && !/^https?:\/\//i.test(img) && !img.startsWith("/")) {
      img = img.startsWith("images/") ? `/${img}` : `/${img}`;
    }

    card.innerHTML = `
      <img class="food-img" src="${img}" alt="${name}" loading="lazy" width="240" height="160" style="width:240px;height:160px;object-fit:cover;display:block;flex-shrink:0;" onerror="this.src='/images/default-food.png'">
      <div class="food-info">
        <h3 class="food-name">${name}</h3>
        <p class="food-price">${price}</p>
        <p class="food-rating">⭐ ${rating}</p>
        <p class="food-category">Category: ${category}</p>
      </div>
    `;
    return card;
  }

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();
    if (!query) {
      resultsDiv.innerHTML = "<p>Please enter a food name.</p>";
      return;
    }

    resultsDiv.innerHTML = "<p>Loading...</p>";

    try {
      const res = await fetch(`/api/fooditem/search.html?query=${encodeURIComponent(query)}`, {
        headers: { "Accept": "application/json" }
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server returned ${res.status}: ${text}`);
      }

      const data = await res.json();
      const items = Array.isArray(data) ? data : (data ? [data] : []);

      if (items.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
      }

      resultsDiv.innerHTML = "";
      items.forEach(item => resultsDiv.appendChild(renderItem(item)));

    } catch (err) {
      console.error("Error fetching data:", err);
      resultsDiv.innerHTML = `<p>Error fetching results. Try again later.</p>
                              <pre style="white-space:pre-wrap">${err.message}</pre>`;
    }
  });
});
