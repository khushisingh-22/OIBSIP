// ========================================
// DR. WASHIT INTERACTIVE SCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. MOBILE MENU NAVIGATION
    const burgerBtn = document.getElementById('burgerBtn');
    const mainNav = document.getElementById('mainNav');
    
    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('open');
        mainNav.classList.toggle('open');
    });

    // Close mobile menu when a nav link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('open');
            mainNav.classList.remove('open');
        });
    });

    // 2. HEADER SCROLL EFFECT
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(8, 11, 17, 0.95)';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(8, 11, 17, 0.75)';
            header.style.boxShadow = 'none';
        }
    }, { passive: true });

    // 3. BOOKING MODAL OPEN/CLOSE
    const bookingModal = document.getElementById('bookingModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    // Open Modal Function
    function openModal(e) {
        if (e) e.preventDefault();
        bookingModal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Disable background scrolling
    }

    // Close Modal Function
    function closeModal() {
        bookingModal.classList.remove('open');
        document.body.style.overflow = 'auto'; // Enable scrolling
    }

    // Attach click listener to all "Book Now" / Booking links
    document.querySelectorAll('.open-booking-modal').forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    modalCloseBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside content area
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeModal();
        }
    });

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookingModal.classList.contains('open')) {
            closeModal();
        }
    });

    // 4. GPS GEOLOCATION DETECTION
    const detectLocationBtn = document.getElementById('detectLocationBtn');
    const locationStatus = document.getElementById('locationStatus');
    const gpsCoordinateLink = document.getElementById('gpsCoordinateLink');
    const custAddress = document.getElementById('custAddress');

    detectLocationBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            locationStatus.textContent = '❌ Geolocation is not supported by your browser.';
            locationStatus.className = 'location-status error';
            return;
        }

        locationStatus.textContent = '⏳ Fetching exact GPS location... Please allow permission.';
        locationStatus.className = 'location-status loading';
        detectLocationBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const accuracy = position.coords.accuracy.toFixed(1);

                // Build Google Maps pin link
                const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                gpsCoordinateLink.value = mapsUrl;

                // Update UI status
                locationStatus.textContent = `✅ GPS Coordinates Detected (Accuracy: ~${accuracy}m)`;
                locationStatus.className = 'location-status success';
                detectLocationBtn.classList.add('success');
                detectLocationBtn.textContent = '✓ GPS Captured';
                detectLocationBtn.disabled = false;

                // Optionally prefix customer address with a note or coordinates
                if (!custAddress.value.includes('GPS Captured')) {
                    custAddress.value = custAddress.value ? custAddress.value + ' [GPS Captured]' : '[GPS Captured]';
                }
            },
            (error) => {
                detectLocationBtn.disabled = false;
                locationStatus.className = 'location-status error';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        locationStatus.textContent = '❌ Permission denied. Please enable GPS permissions.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        locationStatus.textContent = '❌ Location info unavailable. Check device GPS.';
                        break;
                    case error.TIMEOUT:
                        locationStatus.textContent = '❌ GPS request timed out. Please try again.';
                        break;
                    default:
                        locationStatus.textContent = '❌ Unknown error occurred retrieving location.';
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 0
            }
        );
    });

    // 5. WHATSAPP BOOKING FORM REDIRECTION
    const bookingForm = document.getElementById('bookingForm');
    const PHONE_NUMBER = '918860000850'; // Target business number (Country code + phone)

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get Form Values
        const name = document.getElementById('custName').value.trim();
        const phone = document.getElementById('custPhone').value.trim();
        const address = document.getElementById('custAddress').value.trim();
        const gpsLink = gpsCoordinateLink.value;
        const date = document.getElementById('preferredDate').value;
        const time = document.getElementById('preferredTime').value;
        const vehicleType = document.getElementById('vehicleType').value;
        const vehicleModel = document.getElementById('vehicleModel').value.trim();
        const service = document.getElementById('serviceType').value;
        const notes = document.getElementById('bookingNotes').value.trim() || 'None';

        // Format Date nicely
        const formattedDate = new Date(date).toLocaleDateString('en-IN', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Construct beautifully structured WhatsApp message
        let waMessage = `*✨ DR. WASHIT DETAILED SPA BOOKING ✨*\n`;
        waMessage += `===================================\n\n`;
        waMessage += `👤 *Customer Name:* ${name}\n`;
        waMessage += `📞 *Contact Phone:* ${phone}\n\n`;
        waMessage += `🚗 *Vehicle Type:* ${vehicleType}\n`;
        waMessage += `🚘 *Vehicle Model:* ${vehicleModel}\n`;
        waMessage += `🛠️ *Selected Package:* ${service}\n\n`;
        waMessage += `📅 *Preferred Date:* ${formattedDate}\n`;
        waMessage += `⏰ *Time Slot:* ${time}\n\n`;
        waMessage += `📍 *Delivery Address:* ${address}\n`;
        
        if (gpsLink) {
            waMessage += `🗺️ *GPS Live Location:* ${gpsLink}\n`;
        } else {
            waMessage += `🗺️ *GPS Live Location:* _Not provided (Automatic detection was skipped)_\n`;
        }
        
        waMessage += `\n📝 *Special Notes:* ${notes}\n\n`;
        waMessage += `===================================\n`;
        waMessage += `_Request submitted via Dr. Washit Booking Portal_`;

        // Encode message for URL
        const encodedMessage = encodeURIComponent(waMessage);
        
        // Build the WhatsApp API url
        const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;

        // Open WhatsApp in a new tab
        window.open(waUrl, '_blank', 'noopener');
        
        // Reset form and close modal
        bookingForm.reset();
        gpsCoordinateLink.value = '';
        detectLocationBtn.classList.remove('success');
        detectLocationBtn.textContent = '📍 Detect GPS';
        locationStatus.textContent = '';
        closeModal();
    });

    // 6. ACTIVE NAV LINK ON SCROLL (SCROLL SPY)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100; // Offset for navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
});
