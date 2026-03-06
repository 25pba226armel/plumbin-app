/* ====================================================
   PLUMBIT — JS utility, Navbar, Chatbot, Toast
   ==================================================== */

// ── NAVBAR ──────────────────────────────────────────
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const searchBtn = document.getElementById('searchBtn');
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInputBig');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // Hamburger
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('open');
            mobileMenu?.classList.remove('open');
        });
    });

    // Search overlay
    const openSearch = () => {
        searchOverlay?.classList.add('open');
        setTimeout(() => searchInput?.focus(), 100);
    };
    searchBtn?.addEventListener('click', openSearch);
    mobileSearchBtn?.addEventListener('click', openSearch);
    searchClose?.addEventListener('click', () => searchOverlay?.classList.remove('open'));
    searchOverlay?.addEventListener('click', (e) => {
        if (e.target === searchOverlay) searchOverlay.classList.remove('open');
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') searchOverlay?.classList.remove('open');
    });

    // Search suggestions
    if (searchInput) {
        const suggestions = document.getElementById('searchSuggestions');
        const services = ['Pipe Leak Repair', 'Tap Replacement', 'Bathroom Installation', 'Drain Cleaning', 'Water Heater Repair', 'Tank Cleaning', 'Emergency Plumbing'];
        searchInput.addEventListener('input', () => {
            const q = searchInput.value.trim().toLowerCase();
            if (!suggestions) return;
            if (!q) { suggestions.innerHTML = getDefaultSuggestions(); return; }
            const filtered = services.filter(s => s.toLowerCase().includes(q));
            suggestions.innerHTML = filtered.length
                ? filtered.map(s => `<div class="suggestion-item" onclick="window.location.href='services.html'"><span class="suggestion-icon">🔧</span>${s}</div>`).join('')
                : `<div class="suggestion-item"><span class="suggestion-icon">🔍</span>No results for "${q}"</div>`;
        });
        if (suggestions) suggestions.innerHTML = getDefaultSuggestions();
    }

    // Active link
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function getDefaultSuggestions() {
    const items = [
        { icon: '💧', text: 'Pipe Leak Repair', href: 'services.html' },
        { icon: '🚿', text: 'Bathroom Installation', href: 'services.html' },
        { icon: '🔥', text: 'Water Heater Repair', href: 'services.html' },
        { icon: '🚨', text: 'Emergency Plumbing', href: 'services.html' },
    ];
    return items.map(i => `<div class="suggestion-item" onclick="window.location.href='${i.href}'"><span class="suggestion-icon">${i.icon}</span>${i.text}</div>`).join('');
}

// ── CHATBOT ──────────────────────────────────────────
function initChatbot() {
    const btn = document.getElementById('chatbotBtn');
    const win = document.getElementById('chatbotWindow');
    const closeBtn = document.getElementById('chatbotClose');
    const sendBtn = document.getElementById('chatbotSend');
    const input = document.getElementById('chatbotInput');
    const messages = document.getElementById('chatbotMessages');

    if (!btn || !win) return;

    const qaMap = {
        'price': 'Our service prices start from ₹299. You can see exact pricing on the Services page. Final cost is shown before confirming your booking.',
        'book': 'You can book a plumber in under 1 minute! Click "Book Now" in the navigation, select your service, date, and a nearby plumber.',
        'emergency': 'Yes! We offer 24/7 emergency plumbing service. Click the red emergency button on the home page or call our hotline.',
        'time': 'Most bookings are confirmed within 15 minutes. Emergency services arrive in 30–60 minutes depending on your location.',
        'payment': 'We accept UPI, credit/debit cards, net banking, and cash. Payment is made after the service is completed.',
        'cancel': 'You can cancel a booking for free up to 2 hours before the scheduled time from your dashboard.',
        'plumber': 'All our plumbers are verified, licensed, and background-checked. We have 500+ professionals ready to serve you.',
        'warranty': 'We offer a 30-day service warranty on all completed work. If there\'s an issue, we\'ll fix it at no extra cost.',
        'hello': 'Hello! 👋 Welcome to PlumBit! How can I help you today?',
        'hi': 'Hi there! 😊 I\'m PlumBot, your plumbing assistant. What do you need help with?',
        'help': 'I can help with: booking, pricing, emergency services, payment options, cancellations, or plumber info.',
    };

    const welcomeMsg = "Hi! I'm **PlumBot** 🤖 Your smart plumbing assistant. How can I help?";

    btn.addEventListener('click', () => {
        win.classList.toggle('open');
        const notif = btn.querySelector('.chatbot-notif');
        if (notif) notif.style.display = 'none';
    });

    closeBtn?.addEventListener('click', () => win.classList.remove('open'));

    function addMsg(text, isUser = false) {
        const div = document.createElement('div');
        div.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
        div.innerHTML = isUser ? text : text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'chat-msg bot';
        div.innerHTML = '<div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
        div.id = 'typing-indicator';
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function removeTyping() {
        document.getElementById('typing-indicator')?.remove();
    }

    function getBotReply(msg) {
        const lower = msg.toLowerCase();
        for (const [key, val] of Object.entries(qaMap)) {
            if (lower.includes(key)) return val;
        }
        return `I'm not sure about that, but our team is here to help! 📞 Call us at **1800-PLUMBIT** or email **support@plumbit.in** for more details.`;
    }

    function sendMessage() {
        const msg = input.value.trim();
        if (!msg) return;
        addMsg(msg, true);
        input.value = '';
        showTyping();
        setTimeout(() => {
            removeTyping();
            addMsg(getBotReply(msg));
        }, 900 + Math.random() * 500);
    }

    sendBtn?.addEventListener('click', sendMessage);
    input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

    // Quick replies
    document.querySelectorAll('.quick-reply').forEach(qr => {
        qr.addEventListener('click', () => {
            const text = qr.textContent;
            addMsg(text, true);
            qr.closest('.chat-msg')?.remove();
            showTyping();
            setTimeout(() => { removeTyping(); addMsg(getBotReply(text)); }, 800);
        });
    });
}

// ── TOAST ────────────────────────────────────────────
function showToast(message, type = 'success', duration = 3500) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type] || '✅'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = 'all 0.3s ease'; setTimeout(() => toast.remove(), 300); }, duration);
}

// ── TABS ─────────────────────────────────────────────
function initTabs(containerSelector) {
    document.querySelectorAll(containerSelector || '.tabs-container').forEach(container => {
        const tabs = container.querySelectorAll('.tab-btn');
        const contents = container.querySelectorAll('.tab-content');
        tabs.forEach((tab, i) => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                contents[i]?.classList.add('active');
            });
        });
    });
}

// ── ACCORDION ────────────────────────────────────────
function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.accordion-item');
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });
}

// ── SCROLL ANIMATIONS ────────────────────────────────
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ── COUNTER ANIMATION ────────────────────────────────
function animateCounter(el, target, suffix = '') {
    let start = 0;
    const duration = 2000;
    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                const target = parseInt(entry.target.dataset.count);
                const suffix = entry.target.dataset.suffix || '';
                animateCounter(entry.target, target, suffix);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

// ── BOOKING STEPS ────────────────────────────────────
function initBookingSteps() {
    let current = 1;
    const totalSteps = 5;

    function updateSteps() {
        document.querySelectorAll('.step-item').forEach((item, i) => {
            const step = i + 1;
            item.classList.remove('active', 'done');
            if (step < current) item.classList.add('done');
            if (step === current) item.classList.add('active');
        });
        document.querySelectorAll('.booking-step-content').forEach((c, i) => {
            c.classList.toggle('active', i + 1 === current);
        });
        document.getElementById('prevBtn')?.classList.toggle('hidden', current === 1);
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) nextBtn.textContent = current === totalSteps ? '✅ Confirm Booking' : 'Continue →';
        document.getElementById('stepIndicator').textContent = `Step ${current} of ${totalSteps}`;
    }

    document.getElementById('nextBtn')?.addEventListener('click', () => {
        if (current === totalSteps) {
            showToast('🎉 Booking confirmed! Plumber will arrive soon.', 'success');
            setTimeout(() => window.location.href = 'customer-dashboard.html', 1500);
        } else { current = Math.min(current + 1, totalSteps); updateSteps(); }
    });
    document.getElementById('prevBtn')?.addEventListener('click', () => {
        current = Math.max(current - 1, 1);
        updateSteps();
    });

    // Date picker
    document.querySelectorAll('.date-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.date-item').forEach(d => d.classList.remove('selected'));
            item.classList.add('selected');
        });
    });

    // Time slots
    document.querySelectorAll('.time-slot:not(.unavailable)').forEach(slot => {
        slot.addEventListener('click', () => {
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
        });
    });

    // Plumber selection
    document.querySelectorAll('.plumber-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.plumber-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            updatePriceSummary(opt.dataset.rate);
        });
    });

    updateSteps();
}

function updatePriceSummary(rate) {
    const el = document.getElementById('serviceCost');
    if (el && rate) el.textContent = '₹' + rate;
    const total = document.getElementById('totalCost');
    if (total && rate) total.textContent = '₹' + (parseInt(rate) + 49);
}

// ── ADMIN CHARTS ─────────────────────────────────────
function initEarningsChart() {
    const data = [65, 78, 55, 90, 72, 85, 95];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const chart = document.getElementById('earningsChart');
    if (!chart) return;
    const max = Math.max(...data);
    chart.innerHTML = data.map((v, i) => `
    <div style="display:flex;flex-direction:column;align-items:center;flex:1;gap:4px;">
      <div class="chart-bar ${i === 6 ? 'highlight' : ''}"
           style="height:${(v / max) * 100}%"
           title="${days[i]}: ₹${v * 100}"></div>
      <span class="chart-label">${days[i]}</span>
    </div>
  `).join('');
}

// ── JOB ACTIONS ──────────────────────────────────────
function initJobActions() {
    document.querySelectorAll('.btn-accept').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.job-request-card');
            showToast('✅ Job accepted! Customer has been notified.', 'success');
            card.style.borderColor = 'var(--success)';
            btn.textContent = '✅ Accepted';
            btn.disabled = true;
            card.querySelector('.btn-reject').style.display = 'none';
        });
    });
    document.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.job-request-card');
            showToast('Job declined.', 'info');
            card.style.opacity = '0.5';
            card.style.pointerEvents = 'none';
        });
    });
}

// ── CONTACT FORM ─────────────────────────────────────
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('✅ Message sent! We\'ll respond within 24 hours.', 'success');
        form.reset();
    });
}

// ── SERVICE FILTER ───────────────────────────────────
function initServiceFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.service-detail-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeInUp 0.4s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ── PHOTO UPLOAD ─────────────────────────────────────
function initPhotoUpload() {
    const area = document.getElementById('photoUploadArea');
    const input = document.getElementById('photoInput');
    const preview = document.getElementById('photoPreview');
    if (!area || !input) return;
    area.addEventListener('click', () => input.click());
    area.addEventListener('dragover', (e) => { e.preventDefault(); area.style.borderColor = 'var(--primary)'; });
    area.addEventListener('dragleave', () => { area.style.borderColor = ''; });
    area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.style.borderColor = '';
        handleFiles(e.dataTransfer.files);
    });
    input.addEventListener('change', () => handleFiles(input.files));
    function handleFiles(files) {
        if (!preview) return;
        preview.innerHTML = '';
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.cssText = 'width:80px;height:80px;border-radius:10px;object-fit:cover;border:1px solid var(--border-glass)';
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
        showToast('📸 Photos uploaded! Our AI will analyze the issue.', 'info');
    }
}

// ── LOGIN/SIGNUP TABS ─────────────────────────────────
function initLoginPage() {
    // Role tabs
    initTabs('.role-tabs');
    // Method tabs
    initTabs('.method-tabs');

    // OTP inputs auto-focus
    document.querySelectorAll('.otp-input').forEach((input, i, inputs) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && i < inputs.length - 1) inputs[i + 1].focus();
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && i > 0) inputs[i - 1].focus();
        });
    });

    // Form submit
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('🎉 Login successful! Welcome back.', 'success');
        setTimeout(() => window.location.href = 'customer-dashboard.html', 1200);
    });

    document.getElementById('signupForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('✅ Account created! Please verify your email.', 'success');
    });

    // Forgot password
    document.getElementById('forgotLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('📧 Reset link sent to your email.', 'info');
    });
}

// ── LANGUAGE TOGGLE ──────────────────────────────────
function initLanguageToggle() {
    const btn = document.getElementById('langToggle');
    const langs = ['EN', 'हिं', 'বাং', 'தமி', 'తెలు'];
    let i = 0;
    btn?.addEventListener('click', () => {
        i = (i + 1) % langs.length;
        btn.textContent = '🌐 ' + langs[i];
        showToast(`Language switched to ${langs[i]}`, 'info');
    });
}

// ── GLOBAL INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initChatbot();
    initScrollAnimations();
    initCounters();
    initAccordion();
    initJobActions();
    initContactForm();
    initServiceFilter();
    initPhotoUpload();
    initLanguageToggle();
    if (document.querySelector('.booking-step-content')) initBookingSteps();
    if (document.getElementById('loginForm') || document.getElementById('signupForm')) initLoginPage();
    if (document.getElementById('earningsChart')) initEarningsChart();
});
