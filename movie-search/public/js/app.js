document.getElementById('search-btn').addEventListener('click', searchMovie);

function searchMovie() {
  const title = document.getElementById('movie-input').value.trim();
  const info = document.getElementById('movie-info');

  if (!title) {
    info.innerHTML = '<p>🎯 영화 제목을 입력하세요.</p>';
    return;
  }

  fetch(`/api/movie?title=${encodeURIComponent(title)}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === 'False') {
        info.innerHTML = `<p>❌ 영화 정보를 찾을 수 없습니다.</p>`;
      } else {
        info.innerHTML = `
          <img src="${data.Poster}" alt="포스터" />
          <h2>${data.Title} (${data.Year})</h2>
          <p><strong>감독:</strong> ${data.Director}</p>
          <p><strong>출연:</strong> ${data.Actors}</p>
          <p><strong>장르:</strong> ${data.Genre}</p>
          <p><strong>줄거리:</strong> ${data.Plot}</p>
        `;
      }
    })
    .catch(err => {
      info.innerHTML = `<p>⚠️ 서버 오류가 발생했습니다.</p>`;
      console.error(err);
    });
}
