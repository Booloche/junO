const worksSection = document.getElementById('works');
const indicator = document.getElementById('section-indicator');
const indicatorNumber = document.querySelector('.indicator-number');

let currentNumber = "";
let currentImageIndex = 0;
let galleryImages = [];

/* =========================
   CHARGEMENT GALERIE
========================= */

async function loadGallery() {
    try {
        const response = await fetch('works.json');
        const data = await response.json();

        data.forEach((work, index) => {

            const formattedNumber =
                String(index + 1).padStart(2, '0');

            const section = document.createElement('section');

            section.className = 'artwork reveal';
            section.setAttribute('data-number', formattedNumber);

            section.innerHTML = `
                <img src="images/${work.file}" alt="${work.title}">
                <div class="caption">
                    <span>${formattedNumber}</span>
                    <h2>${work.title}</h2>
                    <p>${work.year}</p>
                </div>
            `;

            worksSection.appendChild(section);
        });

        initGalleryFeatures();

    } catch (error) {

        console.error(
            "Erreur lors du chargement de la galerie JSON :",
            error
        );
    }
}

/* =========================
   INITIALISATION GALERIE
========================= */

function initGalleryFeatures() {

    const artworks = document.querySelectorAll('.artwork');

    galleryImages =
        [...document.querySelectorAll('.artwork img')];

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            const number =
                entry.target.dataset.number;

            if (number === currentNumber) return;

            currentNumber = number;

            indicatorNumber.textContent = number;

            indicator.style.opacity = "1";

            clearTimeout(window.indicatorTimeout);

            window.indicatorTimeout =
                setTimeout(() => {

                    indicator.style.opacity = "0";

                }, 3000);

        });

    }, {
        threshold: 0.6
    });

    artworks.forEach(
        artwork => observer.observe(artwork)
    );

    const revealObserver =
        new IntersectionObserver((entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        'visible'
                    );
                }

            });

        }, {
            threshold: 0.15
        });

    artworks.forEach(
        artwork => revealObserver.observe(artwork)
    );

    galleryImages.forEach((img, index) => {

        img.addEventListener('click', () => {

            currentImageIndex = index;

            openLightbox(currentImageIndex);

        });

    });
}

/* =========================
   LIGHTBOX
========================= */

const lightbox =
    document.getElementById('lightbox');

const lightboxImage =
    document.getElementById('lightbox-image');

const prevBtn =
    document.getElementById('prev-btn');

const nextBtn =
    document.getElementById('next-btn');

let controlsTimeout;

function preloadAdjacentImages() {

    const nextIndex =
        (currentImageIndex + 1)
        % galleryImages.length;

    const prevIndex =
        (currentImageIndex - 1 + galleryImages.length)
        % galleryImages.length;

    new Image().src =
        galleryImages[nextIndex].src;

    new Image().src =
        galleryImages[prevIndex].src;
}

function showControls() {

    prevBtn.classList.add('visible');
    nextBtn.classList.add('visible');

    clearTimeout(controlsTimeout);

    controlsTimeout = setTimeout(() => {

        prevBtn.classList.remove('visible');
        nextBtn.classList.remove('visible');

    }, 1500);
}

function openLightbox(index) {

    currentImageIndex = index;

    lightboxImage.src =
        galleryImages[index].src;

    lightboxImage.alt =
        galleryImages[index].alt;

    preloadAdjacentImages();
    showControls();

    lightbox.classList.add('active');
}

function transitionToImage(index) {

    lightboxImage.classList.add('transitioning');

    setTimeout(() => {

        currentImageIndex = index;

        lightboxImage.src =
            galleryImages[index].src;

        lightboxImage.alt =
            galleryImages[index].alt;

        preloadAdjacentImages();

        lightboxImage.classList.remove('transitioning');

    }, 180);
}

function showNextImage() {

    let nextIndex = currentImageIndex + 1;

    if (nextIndex >= galleryImages.length) {
        nextIndex = 0;
    }

    transitionToImage(nextIndex);
}

function showPreviousImage() {

    let prevIndex = currentImageIndex - 1;

    if (prevIndex < 0) {
        prevIndex = galleryImages.length - 1;
    }

    transitionToImage(prevIndex);
}

lightbox.addEventListener('mousemove', () => {

    if (!lightbox.classList.contains('active')) return;

    showControls();

});

lightbox.addEventListener('click', (e) => {

    if (e.target === lightbox) {

        lightbox.classList.remove('active');
    }

});

if (prevBtn) {

    prevBtn.addEventListener('click', (e) => {

        e.stopPropagation();

        showPreviousImage();

    });

}

if (nextBtn) {

    nextBtn.addEventListener('click', (e) => {

        e.stopPropagation();

        showNextImage();

    });

}

document.addEventListener('keydown', (e) => {

    if (
        !lightbox.classList.contains('active')
    ) return;

    if (e.key === 'ArrowRight') {

        showNextImage();
    }

    if (e.key === 'ArrowLeft') {

        showPreviousImage();
    }

    if (e.key === 'Escape') {

        lightbox.classList.remove('active');
    }

});

/* =========================
   HORS GALERIE
========================= */

window.addEventListener('scroll', () => {

    const rect =
        worksSection.getBoundingClientRect();

    const insideWorks =
        rect.top < window.innerHeight &&
        rect.bottom > 0;

    if (!insideWorks) {

        indicator.style.opacity = "0";

        clearTimeout(
            window.indicatorTimeout
        );

        currentNumber = "";
    }

});

/* =========================
   MENU BURGER
========================= */

const burgerBtn =
    document.querySelector('.burger-btn');

const navMenu =
    document.querySelector('.nav');

const navLinks =
    document.querySelectorAll('.nav a');

function toggleMenu() {

    burgerBtn.classList.toggle('active');

    navMenu.classList.toggle('active');

    document.body.classList.toggle(
        'nav-open'
    );
}

burgerBtn.addEventListener(
    'click',
    toggleMenu
);

navLinks.forEach(link => {

    link.addEventListener('click', () => {

        if (
            burgerBtn.classList.contains(
                'active'
            )
        ) {

            toggleMenu();
        }

    });

});

/* =========================
   LANCEMENT
========================= */

loadGallery();