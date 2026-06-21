const carousel = document.getElementById('carousel');
const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const spacingRange = document.getElementById('spacingRange');
const widthRange = document.getElementById('widthRange');
const autoSlideToggle = document.getElementById('autoSlideToggle');

let currentIndex = 0;
let autoSlideInterval;
let spacing = 140;
let sliderWidth = 80;

// Keep the slider width responsive and smooth.
function updateSlideWidth() {
  slides.forEach((slide) => {
    slide.style.width = `${sliderWidth}%`;
  });
}

function updateCarousel() {
  const total = slides.length;

  slides.forEach((slide, index) => {
    // Normalize the offset so the carousel behaves like a semi-circle.
    let offset = (index - currentIndex + total) % total;
    if (offset > total / 2) {
      offset -= total;
    }

    const angle = offset * (Math.PI / (total * 0.9));
    const x = Math.sin(angle) * spacing;
    const z = Math.cos(angle) * spacing;
    const scale = Math.abs(offset) === 0 ? 1.18 : 0.78;
    const rotateY = Math.abs(offset) === 0 ? 0 : offset < 0 ? -18 : 18;
    const opacity = Math.abs(offset) <= 1 ? 1 : 0.65;

    slide.style.transform = `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`;
    slide.style.opacity = opacity;

    slide.classList.remove('active', 'left', 'right');
    if (Math.abs(offset) === 0) {
      slide.classList.add('active');
    } else if (offset < 0) {
      slide.classList.add('left');
    } else {
      slide.classList.add('right');
    }
  });
}

function goTo(index) {
  currentIndex = (index + slides.length) % slides.length;
  updateCarousel();
}

function nextSlide() {
  goTo(currentIndex + 1);
}

function prevSlide() {
  goTo(currentIndex - 1);
}

function startAutoSlide() {
  stopAutoSlide();
  if (autoSlideToggle.checked) {
    autoSlideInterval = setInterval(nextSlide, 3500);
  }
}

function stopAutoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
}

prevBtn.addEventListener('click', () => {
  prevSlide();
  startAutoSlide();
});

nextBtn.addEventListener('click', () => {
  nextSlide();
  startAutoSlide();
});

spacingRange.addEventListener('input', (event) => {
  spacing = Number(event.target.value);
  updateCarousel();
});

widthRange.addEventListener('input', (event) => {
  sliderWidth = Number(event.target.value);
  updateSlideWidth();
});

autoSlideToggle.addEventListener('change', startAutoSlide);

updateSlideWidth();
updateCarousel();
startAutoSlide();
