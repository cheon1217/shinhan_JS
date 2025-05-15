document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");
  const resultsContainer = document.getElementById("results-container");

  const CLIENT_ID = "YOUR_NAVER_CLIENT_ID"; // 네이버 API 클라이언트 ID
  const CLIENT_SECRET = "YOUR_NAVER_CLIENT_SECRET"; // 네이버 API 클라이언트 시크릿

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query === "") {
      alert("검색어를 입력하세요.");
      return;
    }

    fetchResults(query);
  });

  function fetchResults(query) {
    const url = `https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(query)}`;

    fetch(url, {
      method: "GET",
      headers: {
        "X-Naver-Client-Id": CLIENT_ID,
        "X-Naver-Client-Secret": CLIENT_SECRET,
      },
    })
      .then((response) => response.json())
      .then((data) => displayResults(data.items))
      .catch((error) => console.error("Error fetching data:", error));
  }

  function displayResults(items) {
    resultsContainer.innerHTML = ""; // 기존 결과 초기화
    if (items.length === 0) {
      resultsContainer.innerHTML = "<p>검색 결과가 없습니다.</p>";
      return;
    }

    items.forEach((item) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("result-item");

      resultItem.innerHTML = `
        <a href="${item.link}" target="_blank">${item.title}</a>
        <p>${item.description}</p>
      `;

      resultsContainer.appendChild(resultItem);
    });
  }
});