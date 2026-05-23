/* 
========================================================================
   ELEMENT SALON - JS Logic
   Animations, Interactive Tabs, Lookbook Lightbox & Live Status Tracker
   (Upgraded for Elite 10k Premium Wow-Factor)
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. CUSTOM CURSOR
    // ==========================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    // Track mouse position
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Dot moves instantly
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Animate outline with a slight delay (smooth interpolation)
    function animateOutline() {
        const speed = 0.15; // Speed factor of lag
        outlineX += (mouseX - outlineX) * speed;
        outlineY += (mouseY - outlineY) * speed;

        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;

        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Hover states for links and interactive items dynamically (supports dynamically added items)
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('.interactive')) {
            document.body.classList.add('cursor-hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('.interactive')) {
            document.body.classList.remove('cursor-hover');
        }
    });

    // Hide cursor when leaving viewport
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = 0;
        cursorOutline.style.opacity = 0;
    });

    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = 1;
        cursorOutline.style.opacity = 1;
    });


    // ==========================================
    // 2. MOBILE NAVIGATION DRAWER
    // ==========================================
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            // Toggle body scrolling to prevent scrolling when nav is open
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }


    // ==========================================
    // 3. SCROLL PROGRESS & NAVBAR SCROLL STATE
    // ==========================================
    const scrollProgress = document.getElementById('scrollProgress');
    const mainHeader = document.querySelector('.main-header');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Progress bar width
        if (docHeight > 0 && scrollProgress) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = `${scrollPercent}%`;
        }

        // Header scrolled state
        if (mainHeader) {
            if (scrollTop > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        }

        // Scroll to Top Button Visibility
        if (scrollTopBtn) {
            if (scrollTop > 400) {
                scrollTopBtn.style.display = 'flex';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        }
    });

    // Scroll to Top action
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // ==========================================
    // 4. SCROLLSPY (Active Navigation Link)
    // ==========================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset for nav height
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // ==========================================
    // 5. REVEAL ANIMATIONS ON SCROLL (Staggered Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll([
        '.reveal-fade',
        '.reveal-slide-up',
        '.reveal-slide-up-delay',
        '.reveal-fade-delay',
        '.reveal-fade-delay-long',
        '.reveal-slide-left',
        '.reveal-slide-right'
    ].join(','));

    // Intersection Observer to trigger active class
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                
                // Get delay attribute if preset
                const customDelay = item.getAttribute('data-delay');
                if (customDelay) {
                    item.style.transitionDelay = `${customDelay}ms`;
                }
                
                item.classList.add('active');
                observer.unobserve(item);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(elem => {
        revealObserver.observe(elem);
    });


    // ==========================================
    // 6. INTERACTIVE SERVICES TABS
    // ==========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            // Deactivate all buttons & contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Activate current
            btn.classList.add('active');
            const targetContent = document.getElementById(`tab-${tabId}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });


    // ==========================================
    // 7. SERVICE RITUALS DETAILED DICTIONARY & MODAL
    // ==========================================
    const ritualsData = {
        'cut-women': {
            title: "Taglio Sartoriale Donna",
            price: "da €60",
            steps: [
                "<strong>Consulenza Morfologica Viso</strong>: Studio approfondito dei lineamenti e della forma del viso per creare la perfetta armonia geometrica.",
                "<strong>Aromatherapy Cleansing</strong>: Lavaggio sensoriale con shampoo biologico arricchito con oli essenziali e panno caldo lenitivo.",
                "<strong>Cura Idratante</strong>: Trattamento districante nutriente per ristrutturare la fibra e donare lucentezza.",
                "<strong>Taglio di Precisione</strong>: Esecuzione tecnica sartoriale wet & dry per dare volume strutturale ai fusti.",
                "<strong>Piega Deluxe & Styling</strong>: Chiusura con asciugatura termoprotetta e piastre professionali per definire onde o liscio specchio."
            ]
        },
        'cut-men': {
            title: "Taglio Sartoriale Uomo",
            price: "da €35",
            steps: [
                "<strong>Consulenza & Analisi Cutanea</strong>: Esame morfologico e dello stato del cuoio capelluto per definire lo stile ideale.",
                "<strong>Massaggio Cutaneo Rigenerante</strong>: Lavaggio con massaggio linfodrenante per riattivare la microcircolazione e alleviare lo stress.",
                "<strong>Taglio Sartoriale</strong>: Taglio classico o sfumato razor-fade eseguito a forbice e macchinetta di altissima precisione.",
                "<strong>Rinfresco & Cura</strong>: Risciacquo finale con lozione rinfrescante purificante alle erbe e applicazione di balsamo specifico.",
                "<strong>Finish Styling</strong>: Modellatura finale con cere opache organiche o pomate lucide all'acqua."
            ]
        },
        'styling-deluxe': {
            title: "Piega & Styling Deluxe",
            price: "da €30",
            steps: [
                "<strong>Shampoo Specifico</strong>: Detersione personalizzata in base alla tipologia di capello (fine, colorato, crespo).",
                "<strong>Thermo Protection</strong>: Applicazione di siero termoprotettore e primer volumizzante Kevin Murphy prima del calore.",
                "<strong>Blowdry sartoriale</strong>: Asciugatura artistica con spazzole di ceramica e ioni per eliminare l'elettricità statica.",
                "<strong>Styling Waves or Sleek</strong>: Modellazione con ferri professionali o piastre a vapore per definire onde morbide o un liscio setoso duraturo.",
                "<strong>Luminous Oil Finish</strong>: Gocce di elisir lucidante per sigillare le cuticole e dare un riflesso di luce naturale."
            ]
        },
        'styling-consultation': {
            title: "Consulenza Cambio Look",
            price: "Gratis (Richiede prenotazione)",
            steps: [
                "<strong>Diagnostica Tricologica</strong>: Analisi visiva profonda della struttura del capello e dello stato di idratazione.",
                "<strong>Studio dei Lineamenti</strong>: Mappatura visiva delle proporzioni per determinare quali tagli slanciano la figura.",
                "<strong>Color Match Analysis</strong>: Studio del sottotono della pelle per trovare le tonalità cromatologiche ideali per te.",
                "<strong>Portfolio Preview</strong>: Presentazione di lookbook e stili personalizzati consigliati dai nostri stylist.",
                "<strong>Preventivo Sartoriale</strong>: Sviluppo del piano di trattamenti ideali con quotazione trasparente."
            ]
        },
        'color-balayage': {
            title: "Balayage Element Artistico",
            price: "da €120",
            steps: [
                "<strong>Progettazione Punti Luce</strong>: Tracciatura strategica sul capello asciutto per definire dove il sole schiarirebbe naturalmente.",
                "<strong>Hand-Painting Artistico</strong>: Pittura manuale libera delle ciocche con schiarenti delicati all'argilla senza ammoniaca.",
                "<strong>Tempo di Posa Sensoriale</strong>: Posa monitorata in ambiente relax sorseggiando infusi biologici.",
                "<strong>Tonalizzazione Shades EQ</strong>: Applicazione di tonalizzante a pH acido Redken per dare riflessi brillanti e chiudere le squame del capello.",
                "<strong>Maschera Sigillante Colore</strong>: Impacco post-colore Davines per nutrire profondamente e proteggere la luminosità."
            ]
        },
        'color-shatush': {
            title: "Shatush & Ombré Tradizionale",
            price: "da €100",
            steps: [
                "<strong>Cotonatura Protetta</strong>: Cotonatura fine delle ciocche per ottenere una sfumatura graduale senza stacchi netti.",
                "<strong>Schiaritura Graduale</strong>: Applicazione di crema schiarente ricca di proteine protettive per rispettare lo stelo.",
                "<strong>Shampoo Acido Equilibrante</strong>: Lavaggio curativo per neutralizzare i residui alcalini del processo di schiaritura.",
                "<strong>Shades Glossing</strong>: Tonalizzazione personalizzata fredda, calda o sabbia per personalizzare il biondo.",
                "<strong>Rituale Nutriente Ristrutturante</strong>: Applicazione di crema ristrutturante profonda alle proteine vegetali."
            ]
        },
        'color-full': {
            title: "Colore Completo Gloss & Shine",
            price: "da €60",
            steps: [
                "<strong>Consulenza Cromatico-Morfologica</strong>: Selezione della miscela ideale miscelando pigmenti naturali e vibranti.",
                "<strong>Applicazione Protettiva</strong>: Stesura di olio protettivo all'estratto di camomilla lungo l'attaccatura per evitare macchie.",
                "<strong>Stesura Colore Organico</strong>: Applicazione del colore privo di ammoniaca, arricchito con oli vegetali protettivi.",
                "<strong>Detersione Post-Colore</strong>: Massaggio cutaneo delicato con shampoo specifico per sigillare il pigmento.",
                "<strong>Glaze Lucidante Finale</strong>: Trattamento finale specchiante per massimizzare la brillantezza tridimensionale."
            ]
        },
        'color-touchup': {
            title: "Ritocco Radici",
            price: "da €45",
            steps: [
                "<strong>Color Match Radici</strong>: Esatta calibrazione della nuance precedente per garantire una fusione impeccabile.",
                "<strong>Applicazione di Precisione</strong>: Stesura focalizzata esclusivamente sulla ricrescita senza appesantire le lunghezze.",
                "<strong>Shampoo Riequilibrante</strong>: Lavaggio professionale per idratare la cute ed eliminare le micro-tossine.",
                "<strong>Trattamento Idratante Rapido</strong>: Applicazione di balsamo setificante da risciacquo veloce.",
                "<strong>Finish protettivo</strong>: Applicazione di spray barriera anti-umidità prima dello styling."
            ]
        },
        'spa-km': {
            title: "Rituale Ricostruzione Kevin Murphy",
            price: "da €40",
            steps: [
                "<strong>Detersione Purificante</strong>: Lavaggio con Maxi.Wash per eliminare accumuli di silicio, inquinamento e sebo.",
                "<strong>Trattamento Proteico</strong>: Applicazione della formula ricostruttrice a base di amminoacidi e cheratina idrolizzata.",
                "<strong>Bagno di Vapore Termico</strong>: Posa con turbante caldo umido per favorire la penetrazione dei principi attivi all'interno della corteccia.",
                "<strong>Nutrizione profonda</strong>: Impacco lipidico con burro di karitè ed estratti di semi di girasole australiano.",
                "<strong>Lozione di Chiusura</strong>: Leave-in idratante leggero per proteggere dagli agenti esterni."
            ]
        },
        'spa-davines': {
            title: "Trattamento Detossinante Davines",
            price: "da €35",
            steps: [
                "<strong>Scrub Purificante Cute</strong>: Massaggio rilassante con gel scrub al silice naturale per rimuovere le cellule morte.",
                "<strong>Detersione Energetica</strong>: Shampoo purificante Davines Naturaltech ricco di fitoceutici estratti dal tarassaco.",
                "<strong>Argilla Detox</strong>: Applicazione di maschera cutanea all'argilla termica per assorbire le tossine da inquinamento.",
                "<strong>Massaggio Riattivante</strong>: 10 minuti di massaggio linfatico profondo al cuoio capelluto, spalle e collo.",
                "<strong>Tonico Riequilibrante</strong>: Lozione senza risciacquo idratante ed equilibrante per lenire e tonificare."
            ]
        },
        'spa-glowing': {
            title: "Laminazione Lucentezza Specchio",
            price: "da €50",
            steps: [
                "<strong>Lavaggio Alcalino Pre-Laminazione</strong>: Shampoo specifico per sollevare leggermente le cuticole e favorire l'assorbimento.",
                "<strong>Lamination Cream Treatment</strong>: Applicazione del gel laminante a base di cheratina e acido ialuronico.",
                "<strong>Sigillatura Termica</strong>: Chiusura delle cuticole tramite calore umido controllato per solidificare il film protettivo.",
                "<strong>Shampoo Post-Laminazione</strong>: Lavaggio acido per stabilizzare il trattamento e renderlo duraturo.",
                "<strong>Luminous Glossing Blowdry</strong>: Asciugatura finale per rivelare l'effetto specchiato e ultra-riflettente."
            ]
        },
        'spa-keratin': {
            title: "Trattamento Cheratina Lisciante",
            price: "da €180",
            steps: [
                "<strong>Deep Clarifying Cleanse</strong>: Doppia detersione con shampoo alcalino profondo per preparare la corteccia.",
                "<strong>Keratin Fusion Cream</strong>: Stesura uniforme ciocca per ciocca della miscela lisciante ricca di amminoacidi protettivi.",
                "<strong>Posa Controllata</strong>: 40 minuti di posa a temperatura ambiente.",
                "<strong>Asciugatura Completa</strong>: Asciugatura al 100% con spazzola piatta prima della sigillatura.",
                "<strong>Sigillatura a Piastra</strong>: Passaggi ripetuti di piastra in titanio a temperatura calibrata per memorizzare la struttura liscia e anti-crespo."
            ]
        }
    };

    const ritualModal = document.getElementById('ritualModal');
    const modalTitle = document.getElementById('modalServiceTitle');
    const modalPrice = document.getElementById('modalServicePrice');
    const modalSteps = document.getElementById('modalServiceSteps');
    const ritualModalClose = document.getElementById('ritualModalClose');
    const modalServiceBookBtn = document.getElementById('modalServiceBookBtn');

    // Click on price items to open details modal
    document.addEventListener('click', (e) => {
        const priceItem = e.target.closest('.price-item');
        if (priceItem) {
            const serviceId = priceItem.getAttribute('data-service-id');
            if (serviceId && ritualsData[serviceId]) {
                const data = ritualsData[serviceId];
                
                modalTitle.innerText = data.title;
                modalPrice.innerText = data.price;
                
                // Populate steps
                modalSteps.innerHTML = '';
                data.steps.forEach((stepText, index) => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span class="step-num">${index + 1}</span>
                        <span class="step-text">${stepText}</span>
                    `;
                    modalSteps.appendChild(li);
                });

                // Update booking button link to auto-fill notes if possible
                if (modalServiceBookBtn) {
                    modalServiceBookBtn.setAttribute('href', '#booking');
                    modalServiceBookBtn.addEventListener('click', () => {
                        closeRitualModal();
                        // Auto select service in form dropdown
                        const selectEl = document.getElementById('service');
                        if (selectEl) {
                            if (serviceId.includes('cut')) selectEl.value = 'cut-styling';
                            else if (serviceId.includes('color') || serviceId.includes('balayage')) selectEl.value = 'color-full';
                            else if (serviceId.includes('spa')) selectEl.value = 'spa-ritual';
                        }
                    });
                }

                openRitualModal();
            }
        }
    });

    function openRitualModal() {
        ritualModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeRitualModal() {
        ritualModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (ritualModalClose) ritualModalClose.addEventListener('click', closeRitualModal);
    if (ritualModal) {
        ritualModal.addEventListener('click', (e) => {
            if (e.target === ritualModal) closeRitualModal();
        });
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (ritualModal && ritualModal.classList.contains('active') && e.key === 'Escape') {
            closeRitualModal();
        }
    });


    // ==========================================
    // 8. CUSTOM LIGHTBOX LOOKBOOK WITH NAV
    // ==========================================
    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    let activeImagesList = [];
    let currentImageIndex = 0;

    // Build list of non-hidden gallery items
    function updateActiveImagesList() {
        activeImagesList = Array.from(galleryItems).filter(item => !item.classList.contains('hide'));
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            updateActiveImagesList();
            
            // Find active index
            currentImageIndex = activeImagesList.indexOf(item);
            openLightbox();
        });
    });

    function openLightbox() {
        if (!activeImagesList[currentImageIndex]) return;
        
        const targetImg = activeImagesList[currentImageIndex].querySelector('img');
        const targetTitle = activeImagesList[currentImageIndex].querySelector('.gallery-title').innerText;
        const targetCategory = activeImagesList[currentImageIndex].querySelector('.gallery-category').innerText;

        lightboxImg.src = targetImg.src;
        lightboxCaption.innerHTML = `<strong>${targetTitle}</strong> - <span>${targetCategory}</span>`;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // stop background scroll
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % activeImagesList.length;
        openLightbox();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + activeImagesList.length) % activeImagesList.length;
        openLightbox();
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

    // Close lightbox on clicking dark background
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
    });


    // ==========================================
    // 9. LOOKBOOK FILTER SORTING
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            galleryItems.forEach(item => {
                // Smooth hide/show
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.classList.remove('hide');
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        if (item.style.opacity === '0') {
                            item.classList.add('hide');
                        }
                    }, 300);
                }
            });
        });
    });


    // ==========================================
    // 10. CLIENT REVIEWS AUTO-SLIDER
    // ==========================================
    const reviewCards = document.querySelectorAll('.review-card');
    const sliderDots = document.querySelectorAll('.slider-dot');
    let activeReviewIndex = 0;
    let reviewTimer;

    function showReview(index) {
        reviewCards.forEach(c => c.classList.remove('active'));
        sliderDots.forEach(d => d.classList.remove('active'));

        reviewCards[index].classList.add('active');
        sliderDots[index].classList.add('active');
        activeReviewIndex = index;
    }

    function nextReview() {
        const nextIdx = (activeReviewIndex + 1) % reviewCards.length;
        showReview(nextIdx);
    }

    function startReviewSlider() {
        reviewTimer = setInterval(nextReview, 6000); // 6 seconds
    }

    function stopReviewSlider() {
        clearInterval(reviewTimer);
    }

    // Dot indicators click events
    sliderDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIdx = parseInt(dot.getAttribute('data-slide'));
            stopReviewSlider();
            showReview(slideIdx);
            startReviewSlider(); // restart
        });
    });

    if (reviewCards.length > 0) {
        startReviewSlider();
    }


    // ==========================================
    // 11. APPOINTMENT BOOKING FORM VALIDATION
    // ==========================================
    const appointmentForm = document.getElementById('appointmentForm');
    const bookingSuccess = document.getElementById('bookingSuccess');
    const dateInput = document.getElementById('date');
    const successUserName = document.getElementById('successUserName');
    const successDate = document.getElementById('successDate');
    const btnResetForm = document.getElementById('btnResetForm');

    // Date selector settings: prevent selecting past dates
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    if (appointmentForm && bookingSuccess) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Fetch form data
            const userName = document.getElementById('name').value;
            const userDate = document.getElementById('date').value;

            // Form Submit Button visual loading transition
            const submitBtn = appointmentForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> INVIO IN CORSO...';

            // Simulate AJAX network call
            setTimeout(() => {
                successUserName.innerText = userName;
                
                // Format date locally
                const dateParts = userDate.split('-');
                const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : userDate;
                successDate.innerText = formattedDate;

                // Toggle screens
                appointmentForm.classList.add('id-hidden');
                bookingSuccess.classList.remove('id-hidden');

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }, 1200);
        });

        // Reset form for new entry
        if (btnResetForm) {
            btnResetForm.addEventListener('click', () => {
                appointmentForm.reset();
                bookingSuccess.classList.add('id-hidden');
                appointmentForm.removeProperty ? appointmentForm.removeProperty('display') : appointmentForm.style.display = 'block';
                appointmentForm.classList.remove('id-hidden');
            });
        }
    }


    // ==========================================
    // 12. ADVANCED LIVE SALON STATUS TRACKER
    // ==========================================
    const salonStatus = document.getElementById('salonStatus');
    const statusText = document.getElementById('statusText');

    function checkSalonOpen() {
        if (!salonStatus || !statusText) return;

        // Current UTC time converted to Rome/Italy timezone (UTC+2 in summer, UTC+1 in winter)
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        
        // Approximate Italian timezone offset (Summer is UTC+2, May is in Daylight savings)
        const italyOffset = 2;
        const italyTime = new Date(utc + (3600000 * italyOffset));

        const day = italyTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const hours = italyTime.getHours();
        const minutes = italyTime.getMinutes();
        
        const openHour = 9;
        const closeHour = 19;

        if (day === 0) {
            // Sunday Closed
            salonStatus.classList.add('closed');
            statusText.innerHTML = 'Il salone è attualmente <strong>Chiuso</strong>. Riapriamo domani (Lunedì) alle 09:00.';
        } else {
            // Monday - Saturday
            if (hours >= openHour && hours < closeHour) {
                // Open
                salonStatus.classList.remove('closed');
                
                // Calculate hours/minutes remaining to closing
                const hoursLeft = closeHour - 1 - hours;
                const minutesLeft = 60 - minutes;
                
                let timeString = '';
                if (hoursLeft > 0) {
                    timeString += `${hoursLeft} ${hoursLeft === 1 ? 'ora' : 'ore'}`;
                    if (minutesLeft > 0 && minutesLeft < 60) {
                        timeString += ` e ${minutesLeft} ${minutesLeft === 1 ? 'minuto' : 'minuti'}`;
                    }
                } else if (minutesLeft < 60) {
                    timeString += `${minutesLeft} ${minutesLeft === 1 ? 'minuto' : 'minuti'}`;
                }

                statusText.innerHTML = `Il salone è attualmente <strong>Aperto</strong>! Rimaniamo aperti per altre <strong>${timeString}</strong>. Passa a trovarci!`;
            } else {
                // Closed
                salonStatus.classList.add('closed');
                
                let nextDayName = 'domani';
                if (day === 6) nextDayName = 'Lunedì'; // Closed Saturday evening, opens Monday morning

                // Calculate hours/minutes remaining to reopening
                let hoursToOpen = 0;
                if (hours < openHour) {
                    hoursToOpen = openHour - hours;
                } else {
                    hoursToOpen = (24 - hours) + openHour;
                }
                const minutesToOpen = 60 - minutes;

                let countdownString = '';
                if (hoursToOpen > 0) {
                    countdownString += `${hoursToOpen} ${hoursToOpen === 1 ? 'ora' : 'ore'}`;
                }

                statusText.innerHTML = `Il salone è attualmente <strong>Chiuso</strong>. Riapriamo ${nextDayName} alle 09:00 (tra circa <strong>${countdownString}</strong>).`;
            }
        }
    }

    // Run status tracker on load and tick every 60 seconds
    checkSalonOpen();
    setInterval(checkSalonOpen, 60000);

});
