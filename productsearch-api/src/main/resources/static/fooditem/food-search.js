document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const resultsDiv = document.getElementById("results");

  function renderItem(item) {
    const card = document.createElement("div");
    card.className = "food-card";

    const img = document.createElement("img");
    img.className = "food-img";
    let src = item.imageUrl || item.image_url || item.image || "/images/default-food.png";
    if (typeof src === "string" && !/^https?:\/\//i.test(src) && !src.startsWith("/")) {
      src = src.startsWith("images/") ? `/${src}` : `/${src}`;
    }
    img.src = src;
    img.alt = item.name || "food";
    img.loading = "lazy";
    img.addEventListener("error", () => { img.src = "/images/default-food.png"; });

    const info = document.createElement("div");
    info.className = "food-info";

    const nameEl = document.createElement("h3");
    nameEl.className = "food-name";
    nameEl.textContent = item.name || "Unknown";

    const priceEl = document.createElement("p");
    priceEl.className = "food-price";
    priceEl.textContent = (item.price !== undefined && item.price !== null) ? `₹${item.price}` : "Price N/A";

    const ratingEl = document.createElement("p");
    ratingEl.className = "food-rating";
    ratingEl.textContent = `⭐ ${item.rating !== undefined && item.rating !== null ? item.rating : "—"}`;

    const categoryEl = document.createElement("p");
    categoryEl.className = "food-category";
    categoryEl.textContent = item.category || "Uncategorized";

    info.appendChild(nameEl);
    info.appendChild(priceEl);
    info.appendChild(ratingEl);
    info.appendChild(categoryEl);

    card.appendChild(img);
    card.appendChild(info);

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
      const res = await fetch(`/api/fooditem/search?query=${encodeURIComponent(query)}`, {
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
