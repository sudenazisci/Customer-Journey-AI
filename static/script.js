// static/script.js

document.addEventListener('DOMContentLoaded', function() {
    // Create floating particles
    createParticles();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize range sliders
    initializeSliders();
    
    // Add hover effects to cards
    initializeCardEffects();
    
    // Form submission
    const analizForm = document.getElementById('analizForm');
    if (analizForm) {
        analizForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Add animation on scroll
    initializeScrollAnimations();
    
    // Update real-time metrics
    updateRealTimeMetrics();
    setInterval(updateRealTimeMetrics, 3000);
});

function createParticles() {
    const background = document.querySelector('.background-animation');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        particle.style.background = getRandomParticleColor();
        background.appendChild(particle);
    }
}

function getRandomParticleColor() {
    const colors = [
        'var(--accent)',
        'var(--primary)',
        'var(--secondary)',
        'var(--success)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function initializeSliders() {
    document.querySelectorAll('.range-slider').forEach(slider => {
        slider.addEventListener('input', function() {
            const value = parseFloat(this.value);
            const valueSpan = document.getElementById(`val-${this.name}`);
            if (valueSpan) {
                valueSpan.textContent = value.toFixed(2);
                updateSliderColor(valueSpan, value);
                animateValueChange(valueSpan);
            }
        });
        
        // Trigger initial update
        slider.dispatchEvent(new Event('input'));
    });
}

function updateSliderColor(element, value) {
    element.style.background = value > 0.7 ? 'var(--danger)' :
                               value > 0.3 ? 'var(--warning)' :
                               'var(--success)';
    element.style.color = value > 0.3 ? 'var(--bg-darker)' : 'white';
}

function animateValueChange(element) {
    element.style.transform = 'scale(1.2)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 150);
}

function initializeCardEffects() {
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.algo-icon');
            if (icon) {
                icon.style.transform = 'rotate(10deg) scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.algo-icon');
            if (icon) {
                icon.style.transform = 'rotate(0) scale(1)';
            }
        });
    });
}

function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.glass-card').forEach(card => {
        observer.observe(card);
    });
}

function updateRealTimeMetrics() {
    const metrics = document.querySelectorAll('.data-value');
    metrics.forEach(metric => {
        if (metric.textContent.includes('%')) {
            const current = parseInt(metric.textContent);
            const change = (Math.random() - 0.5) * 5;
            const newValue = Math.max(0, Math.min(100, current + change));
            metric.textContent = `${Math.round(newValue)}%`;
        } else if (metric.textContent.includes('GB')) {
            const current = parseFloat(metric.textContent);
            const change = (Math.random() - 0.5) * 0.2;
            const newValue = Math.max(2.5, Math.min(4, current + change));
            metric.textContent = `${newValue.toFixed(1)}GB`;
        } else if (metric.textContent.includes('ms')) {
            const current = parseInt(metric.textContent);
            const change = (Math.random() - 0.5) * 10;
            const newValue = Math.max(15, Math.min(50, current + change));
            metric.textContent = `${Math.round(newValue)}ms`;
        }
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    
    // Show loading state with animation
    submitBtn.innerHTML = `
        <span class="spinner-grow spinner-grow-sm me-2" role="status"></span>
        <span class="shimmer-text">Analiz Ediliyor...</span>
    `;
    submitBtn.disabled = true;
    
    // Add form submission animation
    this.classList.add('submitting');
    
    // Simulate API call delay for demonstration
    setTimeout(() => {
        // Prepare form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // In real application, you would send this to your backend
        // For demo, simulate a response
        const mockResponse = {
            success: true,
            satin_alma: Math.random() > 0.5 ? 1 : 0,
            olasilik: Math.floor(Math.random() * 30 + 70),
            segment: Math.floor(Math.random() * 3)
        };
        
        // Reset button
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
        this.classList.remove('submitting');
        
        if (mockResponse.success) {
            showResult(mockResponse);
        } else {
            showError('Bir hata oluştu');
        }
    }, 1500);
}

function showResult(data) {
    const modalElement = document.getElementById('resultModal');
    const modal = new bootstrap.Modal(modalElement);
    const resultContent = document.getElementById('result-content');
    
    // Set colors and messages
    let resultColor, resultGradient, resultTitle, resultIcon;
    if (data.satin_alma === 1) {
        resultColor = '#86efac';
        resultGradient = 'var(--gradient-success)';
        resultTitle = 'SATIN ALACAK';
        resultIcon = 'fa-check-double';
    } else {
        resultColor = '#fca5a5';
        resultGradient = 'linear-gradient(135deg, #fca5a5 0%, #f87171 100%)';
        resultTitle = 'SATIN ALMAYACAK';
        resultIcon = 'fa-ban';
    }
    
    // Customer segment mapping
    const segmentMap = {
        0: { 
            text: "Hızlı Ziyaretçi", 
            icon: "fa-bolt", 
            color: "#fde68a",
            description: "Düşük etkileşim, hızlı gezinme"
        },
        1: { 
            text: "Sadık Müşteri", 
            icon: "fa-star", 
            color: "#a78bfa",
            description: "Yüksek bağlılık, tekrarlı ziyaret"
        },
        2: { 
            text: "Araştırmacı", 
            icon: "fa-search-dollar", 
            color: "#67e8f9",
            description: "Detaylı inceleme, karşılaştırma"
        }
    };
    
    const segment = segmentMap[data.segment] || { 
        text: "Bilinmiyor", 
        icon: "fa-user", 
        color: "#94a3b8",
        description: "Tanımlanmamış davranış paterni"
    };
    
    // Build result HTML
    resultContent.innerHTML = `
        <div class="p-4">
            <!-- Header -->
            <div class="text-center mb-4">
                <div class="d-inline-block px-4 py-2 rounded-pill mb-3" 
                     style="background: ${resultGradient}; color: white; box-shadow: 0 4px 15px ${resultColor}40;">
                    <i class="fas ${resultIcon} me-2"></i>
                    <strong>${resultTitle}</strong>
                </div>
                <h3 class="gradient-text mb-2">Analiz Sonucu</h3>
                <p class="text-secondary">Tahmin olasılığı: ${data.olasilik}%</p>
            </div>
            
            <div class="row g-3">
                <!-- Gauge -->
                <div class="col-md-6">
                    <div class="gauge-container position-relative">
                        <svg class="gauge-svg" width="160" height="160">
                            <circle class="gauge-bg" cx="80" cy="80" r="40"></circle>
                            <circle class="gauge-fill" 
                                    cx="80" cy="80" r="40" 
                                    stroke="${resultColor}"
                                    stroke-dasharray="251"
                                    stroke-dashoffset="251">
                            </circle>
                        </svg>
                        <div class="gauge-text">
                            <span class="gauge-percent" style="color: ${resultColor}" id="gauge-counter">
                                0%
                            </span>
                            <div class="gauge-label">OLASILIK</div>
                        </div>
                    </div>
                </div>
                
                <!-- Details -->
                <div class="col-md-6">
                    <div class="mb-3">
                        <div class="d-flex align-items-center gap-3">
                            <div class="rounded p-3" style="background: ${segment.color}20">
                                <i class="fas ${segment.icon} fa-lg" style="color: ${segment.color}"></i>
                            </div>
                            <div>
                                <div class="text-secondary small">Müşteri Segmenti</div>
                                <div class="h5 mb-1" style="color: ${segment.color}">${segment.text}</div>
                                <div class="text-secondary small">${segment.description}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <div class="d-flex align-items-center gap-3">
                            <div class="rounded p-3" style="background: rgba(255,255,255,0.1)">
                                <i class="fas fa-calendar-alt fa-lg"></i>
                            </div>
                            <div>
                                <div class="text-secondary small">Analiz Tarihi</div>
                                <div class="h5 mb-1">${new Date().toLocaleDateString('tr-TR')}</div>
                                <div class="text-secondary small">${new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="rounded p-3" style="background: rgba(103, 232, 249, 0.1); border-left: 3px solid #67e8f9;">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <i class="fas fa-clock" style="color: #67e8f6"></i>
                            <div class="fw-bold">Analiz Süresi</div>
                        </div>
                        <div class="h4" style="color: #67e8f6">${(Math.random() * 0.5 + 1.2).toFixed(2)}s</div>
                    </div>
                </div>
            </div>
            
            <!-- Insights -->
            <div class="mt-4">
                <div class="insight-card">
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <i class="fas fa-lightbulb insight-icon"></i>
                        <div class="fw-bold">AI Öngörüsü</div>
                    </div>
                    <p class="mb-0">${generateInsight(data.segment, data.olasilik)}</p>
                </div>
            </div>
            
            <!-- Actions -->
            <div class="mt-4 pt-3 border-top border-secondary">
                <div class="row g-2">
                    <div class="col-md-6">
                        <button class="btn btn-outline-light w-100 py-2" onclick="this.closest('.modal').querySelector('.btn-close').click()">
                            <i class="fas fa-redo me-2"></i>
                            Yeni Analiz
                        </button>
                    </div>
                    <div class="col-md-6">
                        <button class="btn btn-gradient w-100 py-2" onclick="exportResult()">
                            <i class="fas fa-file-pdf me-2"></i>
                            Raporu İndir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Show modal
    modal.show();
    
    // Animate gauge
    setTimeout(() => {
        const gaugeFill = document.querySelector('.gauge-fill');
        if (gaugeFill) {
            const radius = 40;
            const circumference = 2 * Math.PI * radius;
            const progress = circumference - ((data.olasilik / 100) * circumference);
            gaugeFill.style.strokeDashoffset = progress;
        }
        
        // Animate counter
        animateCounter('gauge-counter', 0, data.olasilik, 2000);
    }, 300);
    
    // Add confetti for positive results
    if (data.satin_alma === 1) {
        setTimeout(triggerConfetti, 800);
    }
}

function animateCounter(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current + '%';
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function generateInsight(segment, probability) {
    const insights = {
        0: `Hızlı ziyaretçi segmentinde bulunuyor. Dikkat çekici teklifler ve zaman sınırlı kampanyalar ile ${probability}% olasılıkla satın alım sağlanabilir.`,
        1: `Sadık müşteri profiline uygun. Kişiselleştirilmiş öneriler ve özel fırsatlarla ${probability}% güçlü bir satın alma potansiyeli mevcut.`,
        2: `Araştırma aşamasında olan kullanıcı. Detaylı bilgi ve karşılaştırma imkanları sunarak ${probability}% olasılıkla ikna edilebilir.`
    };
    
    return insights[segment] || 'Davranış örüntüleri analiz ediliyor...';
}

function exportResult() {
    showToast('PDF raporu hazırlanıyor...', 'info');
    setTimeout(() => {
        showToast('Rapor başarıyla indirildi!', 'success');
    }, 1500);
}

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#86efac', '#67e8f9', '#a78bfa', '#f9a8d4'],
        shapes: ['circle', 'square']
    });
    
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#86efac', '#67e8f9']
        });
        
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#a78bfa', '#f9a8d4']
        });
    }, 250);
}

function showError(message) {
    showToast(message, 'error');
}

function showToast(message, type = 'info') {
    const bgClass = type === 'success' ? 'bg-success' : 
                   type === 'error' ? 'bg-danger' : 'bg-info';
    
    const iconClass = type === 'success' ? 'fa-check-circle' : 
                     type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '9999';
    
    toast.innerHTML = `
        <div class="toast show glass-card" role="alert">
            <div class="toast-header ${bgClass} text-white border-0">
                <i class="fas ${iconClass} me-2"></i>
                <strong class="me-auto">${type === 'success' ? 'Başarılı' : type === 'error' ? 'Hata' : 'Bilgi'}</strong>
                <button type="button" class="btn-close btn-close-white" onclick="this.closest('.toast').remove()"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}
// Algorithm Slider Initialization
// Algorithm Slider Initialization
function initAlgorithmSlider() {
    // Swiper initialization with center mode
    const algorithmSwiper = new Swiper('.algorithm-swiper', {
        effect: "slide",
        grabCursor: true,
        loop: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 20,
        speed: 800,
        autoplay: {
            delay: 3000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 10,
                centeredSlides: false
            },
            640: {
                slidesPerView: 'auto',
                spaceBetween: 15,
                centeredSlides: true
            },
            1024: {
                slidesPerView: 'auto',
                spaceBetween: 20,
                centeredSlides: true
            }
        }
    });

}

// Load required libraries
function loadAlgorithmLibraries() {
    // Check if Swiper is already loaded
    if (typeof Swiper === 'undefined') {
        const swiperScript = document.createElement('script');
        swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js';
        swiperScript.onload = function() {
            // Check if particles.js is already loaded
            if (typeof tsParticles === 'undefined') {
                const particlesScript = document.createElement('script');
                particlesScript.src = 'https://cdn.jsdelivr.net/npm/tsparticles@2.9.3/tsparticles.bundle.min.js';
                particlesScript.onload = initAlgorithmSlider;
                document.head.appendChild(particlesScript);
            } else {
                initAlgorithmSlider();
            }
        };
        document.head.appendChild(swiperScript);
        
        // Add Swiper CSS
        const swiperCSS = document.createElement('link');
        swiperCSS.rel = 'stylesheet';
        swiperCSS.href = 'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css';
        document.head.appendChild(swiperCSS);
    } else {
        initAlgorithmSlider();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add ion-icons script if not present
    if (!document.querySelector('script[src*="ionicons"]')) {
        const ioniconsScript = document.createElement('script');
        ioniconsScript.type = 'module';
        ioniconsScript.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js';
        document.head.appendChild(ioniconsScript);
        
        const ioniconsNoModule = document.createElement('script');
        ioniconsNoModule.noModule = true;
        ioniconsNoModule.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js';
        document.head.appendChild(ioniconsNoModule);
    }
    
    // Load algorithm libraries after a short delay
    setTimeout(loadAlgorithmLibraries, 500);
});
// Progress animasyonu
document.addEventListener('DOMContentLoaded', function() {
    const progressCircles = document.querySelectorAll('.fluid-progress-circle');
    
    progressCircles.forEach(circle => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    circle.style.transition = 'stroke-dashoffset 1.5s ease';
                    // Animasyon tetiklendiğinde biraz gecikmeli başlat
                    setTimeout(() => {
                        circle.style.strokeDashoffset = circle.getAttribute('stroke-dashoffset');
                    }, 300);
                    observer.unobserve(circle);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(circle);
    });
});

