/* ========================================
   MAIN.JS - Global Interactivity
   ======================================== */

// ========================================
// MOBILE MENU TOGGLE
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navLinks && navLinks.contains(event.target);
        const isClickOnHamburger = hamburger && hamburger.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnHamburger && hamburger) {
            hamburger.classList.remove('active');
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        }
    });
});

// ========================================
// MODAL FUNCTIONALITY
// ========================================

const callbackModal = document.getElementById('callbackModal');
const callbackForm = document.getElementById('callbackForm');
const modalClose = document.getElementById('modalClose');
const callbackBtnHero = document.getElementById('callbackBtnHero');

function openCallbackModal() {
    if (callbackModal) {
        callbackModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCallbackModal() {
    if (callbackModal) {
        callbackModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (callbackForm) {
            callbackForm.reset();
        }
    }
}

if (callbackBtnHero) {
    callbackBtnHero.addEventListener('click', openCallbackModal);
}

if (modalClose) {
    modalClose.addEventListener('click', closeCallbackModal);
}

if (callbackModal) {
    callbackModal.addEventListener('click', function(event) {
        if (event.target === callbackModal) {
            closeCallbackModal();
        }
    });
}

// ========================================
// CALLBACK FORM VALIDATION
// ========================================

if (callbackForm) {
    callbackForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('cbName').value.trim();
        const mobile = document.getElementById('cbMobile').value.trim();
        const email = document.getElementById('cbEmail').value.trim();

        // Validation
        let isValid = true;
        let errorMessage = '';

        if (!name) {
            errorMessage += 'Name is required.\n';
            isValid = false;
        }

        if (!mobile || mobile.length < 10) {
            errorMessage += 'Valid mobile number (10 digits) is required.\n';
            isValid = false;
        }

        if (!email || !isValidEmail(email)) {
            errorMessage += 'Valid email is required.\n';
            isValid = false;
        }

        if (!isValid) {
            alert(errorMessage);
            return;
        }

        // Success
        showSuccessMessage('Thank you for your interest! Our team will call you soon.');
        callbackForm.reset();

        // Close modal after 2 seconds
        setTimeout(closeCallbackModal, 2000);
    });
}

// ========================================
// CONTACT FORM VALIDATION
// ========================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        let isValid = true;
        let errorMessage = '';

        if (!name) {
            errorMessage += 'Name is required.\n';
            isValid = false;
        }

        if (!email || !isValidEmail(email)) {
            errorMessage += 'Valid email is required.\n';
            isValid = false;
        }

        if (!phone || phone.length < 10) {
            errorMessage += 'Valid phone number is required.\n';
            isValid = false;
        }

        if (!message) {
            errorMessage += 'Message is required.\n';
            isValid = false;
        }

        if (!isValid) {
            alert(errorMessage);
            return;
        }

        // Show success message
        const messageDiv = document.querySelector('.contact-form-section .form-message');
        if (messageDiv) {
            messageDiv.textContent = 'Thank you for your message! We will get back to you soon.';
            messageDiv.className = 'form-message success';
            messageDiv.style.display = 'block';
        }

        contactForm.reset();

        // Hide message after 5 seconds
        setTimeout(() => {
            if (messageDiv) {
                messageDiv.style.display = 'none';
            }
        }, 5000);
    });
}

// ========================================
// EMAIL VALIDATION
// ========================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========================================
// DEGREE & STREAM FILTER (HOME PAGE)
// ========================================

const degreeButtons = document.querySelectorAll('.degree-btn');
const streamButtons = document.querySelectorAll('.stream-btn');
const recommendationPanel = document.getElementById('recommendationPanel');
const recommendationTitle = document.getElementById('recommendationTitle');
const recommendationList = document.getElementById('recommendationList');

const courseRecommendations = {
    'BE/BTech': ['Java Full Stack', 'Data Science', 'Software Testing'],
    'BCA/BSc': ['Python Full Stack', 'Java Full Stack', 'API Testing'],
    'BCom': ['Data Science', 'Business Analytics'],
    'MCA': ['Data Science', 'Java Full Stack', 'Advanced Python'],
    'ME/MTech': ['Data Science', 'Machine Learning'],
    'MBA': ['Data Science', 'Business Analytics'],
    'MSc': ['Data Science', 'Machine Learning', 'Advanced Analytics'],
    'Others': ['Java Full Stack', 'Python Full Stack']
};

degreeButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all degree buttons
        degreeButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        const degree = this.getAttribute('data-degree');
        showRecommendations(degree, 'degree');
    });
});

streamButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all stream buttons
        streamButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        const stream = this.getAttribute('data-stream');
        showRecommendations(stream, 'stream');
    });
});

function showRecommendations(value, type) {
    if (!recommendationPanel || !recommendationTitle || !recommendationList) {
        return;
    }

    let recommendations = [];
    let title = '';

    if (type === 'degree') {
        recommendations = courseRecommendations[value] || [];
        title = `Recommended courses for ${value} students`;
    } else {
        title = `Popular courses for ${value} stream students`;
        // Generic recommendations for streams
        const streamRecommendations = {
            'CS': ['Data Science', 'Java Full Stack', 'Python Full Stack'],
            'IT': ['Java Full Stack', 'Python Full Stack', 'Software Testing'],
            'ECE': ['Data Science', 'Machine Learning'],
            'EEE': ['Data Science', 'Python Full Stack'],
            'IS': ['Data Science', 'Business Analytics'],
            'ME': ['Data Science', 'Machine Learning'],
            'CIV': ['Data Science', 'Business Analytics'],
            'Others': ['Java Full Stack', 'Python Full Stack']
        };
        recommendations = streamRecommendations[value] || [];
    }

    recommendationTitle.textContent = title;
    recommendationList.innerHTML = '';
    recommendations.forEach(course => {
        const li = document.createElement('li');
        li.textContent = course;
        recommendationList.appendChild(li);
    });

    recommendationPanel.style.display = 'block';
}

// ========================================
// COURSE SEARCH FILTER (COURSES PAGE)
// ========================================

const courseSearchInput = document.getElementById('courseSearch');
const courseListCards = document.querySelectorAll('.course-list-card');

if (courseSearchInput) {
    courseSearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();

        courseListCards.forEach(card => {
            const courseName = card.getAttribute('data-course').toLowerCase();
            if (courseName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ========================================
// SCROLL TO COURSE FUNCTION
// ========================================

function scrollToCourse(courseId) {
    const element = document.getElementById(courseId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ========================================
// SCROLL TO CONTACT
// ========================================

function scrollToContact() {
    const contactSection = document.querySelector('.contact-form-section');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ========================================
// ACCORDION FUNCTIONALITY
// ======================================== 

document.addEventListener('DOMContentLoaded', function() {
    // Curriculum Accordion
    const curriculumHeaders = document.querySelectorAll('#curriculumAccordion .accordion-header');
    curriculumHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const moduleId = 'module-' + this.getAttribute('data-module');
            const body = document.getElementById(moduleId);
            const isActive = this.classList.contains('active');

            // Close all other accordion items
            curriculumHeaders.forEach(h => {
                h.classList.remove('active');
                const moduleNum = h.getAttribute('data-module');
                const b = document.getElementById('module-' + moduleNum);
                if (b) {
                    b.classList.remove('active');
                    b.style.display = 'none';
                }
            });

            // Toggle current item
            if (!isActive) {
                this.classList.add('active');
                if (body) {
                    body.classList.add('active');
                    body.style.display = 'block';
                }
            }
        });
    });

    // FAQ Accordion (both on courses and contact pages)
    const faqHeaders = document.querySelectorAll('#faqAccordion .accordion-header, #contactFaqAccordion .accordion-header');
    faqHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const faqId = this.getAttribute('data-faq');
            const faqNum = faqId.split('-')[faqId.split('-').length - 1];
            const bodyId = faqId.startsWith('contact-') ? `contact-faq-${faqNum}` : `faq-${faqNum}`;
            const body = document.getElementById(bodyId);
            const isActive = this.classList.contains('active');

            // Find parent accordion
            const accordion = this.closest('.accordion');
            const siblings = accordion ? accordion.querySelectorAll('.accordion-header') : [];

            // Close all other items in same accordion
            siblings.forEach(h => {
                if (h !== this) {
                    h.classList.remove('active');
                    const sibFaqId = h.getAttribute('data-faq');
                    const sibFaqNum = sibFaqId.split('-')[sibFaqId.split('-').length - 1];
                    const sibBodyId = sibFaqId.startsWith('contact-') ? `contact-faq-${sibFaqNum}` : `faq-${sibFaqNum}`;
                    const sibBody = document.getElementById(sibBodyId);
                    if (sibBody) {
                        sibBody.classList.remove('active');
                        sibBody.style.display = 'none';
                    }
                }
            });

            // Toggle current item
            if (!isActive) {
                this.classList.add('active');
                if (body) {
                    body.classList.add('active');
                    body.style.display = 'block';
                }
            } else {
                this.classList.remove('active');
                if (body) {
                    body.classList.remove('active');
                    body.style.display = 'none';
                }
            }
        });
    });
});

// ========================================
// ANIMATED COUNTERS (ABOUT PAGE)
// ========================================

function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(element => {
        const target = parseInt(element.getAttribute('data-target'));
        const increment = target / 50;
        let current = 0;

        const updateCount = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(updateCount);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    });
}

// Trigger animation when page loads
window.addEventListener('load', function() {
    if (document.querySelector('.stat-number')) {
        animateCounters();
    }
});

// ========================================
// TESTIMONIALS SLIDER
// ========================================

let currentTestimonialIndex = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');

function showTestimonial(index) {
    if (testimonialCards.length === 0) return;

    // Wrap around
    if (index >= testimonialCards.length) {
        currentTestimonialIndex = 0;
    } else if (index < 0) {
        currentTestimonialIndex = testimonialCards.length - 1;
    } else {
        currentTestimonialIndex = index;
    }

    // Hide all testimonials
    testimonialCards.forEach(card => {
        card.style.display = 'none';
    });

    // Show current testimonial and next 3 (for desktop grid)
    for (let i = 0; i < Math.min(4, testimonialCards.length); i++) {
        const idx = (currentTestimonialIndex + i) % testimonialCards.length;
        testimonialCards[idx].style.display = 'block';
    }
}

if (testimonialPrev) {
    testimonialPrev.addEventListener('click', () => {
        showTestimonial(currentTestimonialIndex - 1);
    });
}

if (testimonialNext) {
    testimonialNext.addEventListener('click', () => {
        showTestimonial(currentTestimonialIndex + 1);
    });
}

// Initialize testimonials
document.addEventListener('DOMContentLoaded', function() {
    if (testimonialCards.length > 0) {
        showTestimonial(0);
    }
});

// ========================================
// SHOW SUCCESS MESSAGE
// ========================================

function showSuccessMessage(message) {
    const messageDiv = document.getElementById('callbackMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = 'form-message success';
        messageDiv.style.display = 'block';
    }
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// KEYBOARD ACCESSIBILITY
// ========================================

document.addEventListener('keydown', function(event) {
    // Close modal on Escape key
    if (event.key === 'Escape') {
        const modal = document.querySelector('.modal.active');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// ========================================
// LOADING ANIMATIONS
// ========================================

window.addEventListener('load', function() {
    // Add animation to elements
    const cards = document.querySelectorAll('.course-card, .feature-card, .info-card, .trainer-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease-out ${index * 50}ms`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 10);
    });
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Add active class to current navigation item
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveNavigation);

// ========================================
// FORM INPUT FORMATTING
// ========================================

// Format phone input to allow only numbers
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^\d]/g, '').slice(0, 15);
        });
    });
});

// ========================================
// LAZY LOADING PLACEHOLDER
// ======================================== 

if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease-in-out';
        imageObserver.observe(img);
    });
}

console.log('Elevate Career - Website loaded successfully!');

/* ========================================
   SIMPLE CHATBOT WIDGET (client-side, no backend)
   - Injects a floating chat button and panel on all pages
   - Uses keyword matching for canned responses
   - Persists conversation in localStorage
   - Simulates typing for better UX
======================================== */

(function() {
    const STORAGE_KEY = 'techbridge_chat_history_v1';

    // Basic knowledge/responses
    const KB = [
        {keys: ['data science','data'], reply: "Our Data Science program covers Python, statistics, ML, and 4+ real projects. See details on the <a href='courses.html#data-science'>Data Science page</a>."},
        {keys: ['java','java full stack'], reply: "Java Full Stack covers core Java, Spring Boot and frontend essentials. Check <a href='courses.html#java-fullstack'>Java Full Stack</a>."},
        {keys: ['python full stack','python'], reply: "Python Full Stack includes Django/Flask, REST APIs and deployment. See course details on the Courses page."},
        {keys: ['testing','software testing','qa'], reply: "Our Software Testing course covers manual testing, Selenium automation and API testing. View details on the Courses page."},
        {keys: ['courses','course','programs'], reply: "We offer Data Science, Java Full Stack, Python Full Stack, Software Testing and more — browse the <a href='courses.html'>Courses page</a>."},
        {keys: ['placement','placements','job','career'], reply: "We provide placement assistance: resume reviews, mock interviews and company referrals. Our placement team will guide you through the process."},
        {keys: ['fees','price','fee'], reply: "Course fees vary by program. For example, Data Science currently shows a discounted fee on the Data Science course card. For exact pricing, click 'Request Call Back' or contact admissions."},
        {keys: ['contact','location','address'], reply: "You can reach us at info@techbridge.edu or +91-99999-00000. Our branches are listed on the Contact page."},
        {keys: ['brochure','download'], reply: "You can download course brochures from the course pages or request one via the callback form."}
    ];

    // Create UI
    function createChatUI() {
        const widget = document.createElement('div');
        widget.className = 'chat-widget';

        const button = document.createElement('button');
        button.className = 'chat-button';
        button.title = 'Chat with us';
        button.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

        const panel = document.createElement('div');
        panel.className = 'chat-panel';
        panel.style.display = 'none';

        panel.innerHTML = `
            <div class="chat-header">
                <div>
                    <div class="title">TechBridge Assistant</div>
                    <div class="subtitle">Ask about courses, fees or placements</div>
                </div>
                <div>
                    <button class="chat-close" aria-label="Close chat">✕</button>
                </div>
            </div>
            <div class="chat-messages" role="log" aria-live="polite"></div>
            <div class="chat-quick">
                <button data-quick="courses">View Courses</button>
                <button data-quick="data science">Data Science</button>
                <button data-quick="placement">Placement Support</button>
                <button data-quick="contact">Contact Us</button>
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Type a message..." aria-label="Type a message">
                <button class="send">Send</button>
            </div>
        `;

        widget.appendChild(panel);
        widget.appendChild(button);
        document.body.appendChild(widget);

        // Event listeners
        const closeBtn = panel.querySelector('.chat-close');
        const sendBtn = panel.querySelector('.send');
        const input = panel.querySelector('input[type="text"]');
        const messages = panel.querySelector('.chat-messages');

        button.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
            if (panel.style.display !== 'none') {
                // show welcome if first time
                setTimeout(() => { input.focus(); }, 200);
                if (getHistory().length === 0) {
                    botReply("Hi! I'm TechBridge Assistant. How can I help you today? You can ask about courses, fees, or placements.");
                }
            }
        });

        closeBtn.addEventListener('click', () => { panel.style.display = 'none'; });

        sendBtn.addEventListener('click', () => { handleUserInput(input, messages); });
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleUserInput(input, messages); });

        panel.querySelectorAll('.chat-quick button').forEach(btn => {
            btn.addEventListener('click', () => {
                const q = btn.getAttribute('data-quick');
                addMessage('user', q);
                processUserMessage(q);
            });
        });

        // Load history
        loadHistoryToUI(messages);
    }

    function handleUserInput(input, messages) {
        const text = input.value.trim();
        if (!text) return;
        addMessage('user', text);
        input.value = '';
        processUserMessage(text);
    }

    function addMessage(sender, text) {
        const panel = document.querySelector('.chat-panel');
        if (!panel) return;
        const messages = panel.querySelector('.chat-messages');
        const msg = document.createElement('div');
        msg.className = 'message ' + (sender === 'bot' ? 'bot' : 'user');
        msg.innerHTML = text;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
        saveToHistory({sender, text, ts: Date.now()});
    }

    function botReply(text) {
        const panel = document.querySelector('.chat-panel');
        if (!panel) return;
        const messages = panel.querySelector('.chat-messages');
        // typing indicator
        const typing = document.createElement('div');
        typing.className = 'message bot';
        typing.textContent = 'Typing...';
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;

        setTimeout(() => {
            messages.removeChild(typing);
            addMessage('bot', text);
        }, 700 + Math.min(1200, text.length * 20));
    }

    function processUserMessage(raw) {
        const text = raw.toLowerCase();
        // simple keyword matching
        for (const item of KB) {
            for (const k of item.keys) {
                if (text.includes(k)) {
                    return botReply(item.reply);
                }
            }
        }

        // fallback suggestions
        const fallback = `Sorry, I didn't catch that. You can try: <b>View Courses</b>, <b>Data Science</b>, <b>Placement</b>, or <b>Contact</b>.
            <div style="margin-top:8px;"><a href='contact.html'>Contact admissions</a> or click <button onclick="document.querySelector('.chat-quick button[data-quick=contact]').click()" style="margin-left:6px;padding:6px 8px;border-radius:6px;border:1px solid #ddd;background:#fff;">Request Call Back</button></div>`;
        botReply(fallback);
    }

    // LocalStorage persistence
    function saveToHistory(entry) {
        try {
            const h = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            h.push(entry);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(h.slice(-200))); // keep last 200 messages
        } catch (e) { /* ignore */ }
    }

    function getHistory() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (e) { return []; }
    }

    function loadHistoryToUI(messages) {
        const hist = getHistory();
        const panel = document.querySelector('.chat-panel');
        if (!panel) return;
        const msgs = panel.querySelector('.chat-messages');
        hist.forEach(h => {
            const div = document.createElement('div');
            div.className = 'message ' + (h.sender === 'bot' ? 'bot' : 'user');
            div.innerHTML = h.text;
            msgs.appendChild(div);
        });
        msgs.scrollTop = msgs.scrollHeight;
    }

    // Initialize widget on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        createChatUI();
    });

})();

