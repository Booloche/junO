const worksSection = document.getElementById('works');
const indicator = document.getElementById('section-indicator');
const indicatorNumber = document.querySelector('.indicator-number');

let currentNumber = "";

// 1. CHARGEMENT ET INJECTION DYNAMIQUE DE LA GALERIE (JPG)
async function loadGallery() {
    try {
        const response = await fetch('works.json');
        const data = await response.json();
        
        data.forEach((work, index) => {
            const formattedNumber = String(index + 1).padStart(2, '0');
            
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

        // Initialisation des observateurs et événements après injection
        initGalleryFeatures();

    } catch (error) {
        console.error("Erreur lors du chargement de la galerie JSON :", error);
    }
}

// 2. INITIALISATION DES INSTANCES ET INTERACTIONS
function initGalleryFeatures() {
    const artworks = document.querySelectorAll('.artwork');

    // Observer pour le compteur de section à gauche (01, 02...)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const number = entry.target.dataset.number;
            if (number === currentNumber) return;

            currentNumber = number;
            indicatorNumber.textContent = number;
            indicator.style.opacity = "1";

            clearTimeout(window.indicatorTimeout);

            window.indicatorTimeout = setTimeout(() => {
                indicator.style.opacity = "0";
            }, 3000);
        });
    }, {
        threshold: 0.6
    });

    artworks.forEach(artwork => observer.observe(artwork));

    // Observer pour le défilement fluide et apparition (Reveal)
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15
    });

    artworks.forEach(artwork => revealObserver.observe(artwork));

    // Événement Clic pour la Lightbox (Agrandissement)
    document.querySelectorAll('.artwork img').forEach((img) => {
        img.addEventListener('click', () => {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightbox.classList.add('active');
        });
    });
}

// Lancement au chargement de la page
loadGallery();


/* =========================
   LOGIQUE HORS GALERIE
========================= */

// Masquer l'indicateur hors de la section Works
window.addEventListener('scroll', () => {
    const rect = worksSection.getBoundingClientRect();
    const insideWorks = rect.top < window.innerHeight && rect.bottom > 0;

    if (!insideWorks) {
        indicator.style.opacity = "0";
        clearTimeout(window.indicatorTimeout);
        currentNumber = "";
    }
});

// Fermeture de la Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');

lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

// Menu Burger Mobile
const burgerBtn = document.querySelector('.burger-btn');
const navMenu = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');

function toggleMenu() {
    burgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('nav-open');
}

burgerBtn.addEventListener('click', toggleMenu);

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (burgerBtn.classList.contains('active')) {
            toggleMenu();
        }
    });
});