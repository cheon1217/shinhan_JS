document.addEventListener("DOMContentLoaded", () => {
  const randomButton = document.getElementById("randomButton");
  const mainImage = document.getElementById("mainImage");
  const menuTitle = document.getElementById("menuTitle");
  const thumbnails = document.querySelectorAll(".thumbnail");
  const slides = document.querySelectorAll("#slideshow .slide");
  const prevSlideButton = document.getElementById("prevSlide");
  const nextSlideButton = document.getElementById("nextSlide");

  // 이미지 데이터
  const images = [
    { src: "images/cake.jpg", name: "케이크" },
    { src: "images/pizza.jpg", name: "피자" },
    { src: "images/sushi.jpg", name: "스시" },
    { src: "images/burger.jpg", name: "버거" },
  ];

  let currentSlideIndex = 0;

  // 슬라이드 자동 전환
  function startSlideshow() {
    setInterval(() => {
      goToNextSlide();
    }, 3000);
  }

  // 이전 슬라이드로 이동
  function goToPrevSlide() {
    slides[currentSlideIndex].classList.remove("active");
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    slides[currentSlideIndex].classList.add("active");
  }

  // 다음 슬라이드로 이동
  function goToNextSlide() {
    slides[currentSlideIndex].classList.remove("active");
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    slides[currentSlideIndex].classList.add("active");
  }

  // 랜덤 선택 버튼 클릭 이벤트
  randomButton.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedImage = images[randomIndex];

    updateMainImage(selectedImage.src, selectedImage.name);
    highlightThumbnail(selectedImage.src);
  });

  // 썸네일 클릭 이벤트
  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const src = thumbnail.src;
      const name = thumbnail.dataset.name;

      updateMainImage(src, name);
      highlightThumbnail(src);
    });
  });

  // 이전/다음 버튼 클릭 이벤트
  prevSlideButton.addEventListener("click", goToPrevSlide);
  nextSlideButton.addEventListener("click", goToNextSlide);

  // 메인 이미지 업데이트
  function updateMainImage(src, name) {
    mainImage.src = src;
    menuTitle.textContent = `오늘의 메뉴: ${name}`;
  }

  // 썸네일 강조 표시
  function highlightThumbnail(selectedSrc) {
    thumbnails.forEach((thumbnail) => {
      if (thumbnail.src.endsWith(selectedSrc)) {
        thumbnail.classList.add("selected");
        thumbnail.style.opacity = "1"; // 선택된 썸네일은 불투명
      } else {
        thumbnail.classList.remove("selected");
        thumbnail.style.opacity = "0.5"; // 선택되지 않은 썸네일은 반투명
      }
    });
  }

  // 슬라이드쇼 시작
  startSlideshow();
});