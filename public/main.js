document.addEventListener('DOMContentLoaded', () => {
  // Modal logic
  const modal = document.getElementById('lead-modal');
  const form = document.getElementById('lead-form');

  // Multi-button selection for modal triggers
  const createStoryBtns = [
    document.getElementById('btn-create-story-hero'),
    document.getElementById('btn-create-story-cta'),
    document.getElementById('btn-create-story-mobile'),
    ...document.querySelectorAll('.pricing-card button')
  ];

  const btnModalClose = document.getElementById('btn-modal-close');

  const openModal = (e) => {
    if(e) e.preventDefault();
    modal.classList.add('active');
  };

  const closeModal = () => {
    modal.classList.remove('active');
  };

  // Mobile Menu Toggle Logic
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navbarLinks = document.getElementById('navbar-links');

  if (mobileMenuBtn && navbarLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navbarLinks.classList.toggle('active');
    });

    // Close mobile menu when a nav link is clicked
    navbarLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navbarLinks.classList.remove('active');
      });
    });
  }

  createStoryBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        // GTM Tracking
        window.dataLayer.push({ event: 'create_story_click' });
        openModal(e);
      });
    }
  });

  if (btnModalClose) {
    btnModalClose.addEventListener('click', closeModal);
  }

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Handle form submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const occasion = document.getElementById('occasion').value;
      const story = document.getElementById('story').value;
      const honeypot = document.getElementById('website_url').value;

      // Send to Backend database
      fetch('/.netlify/functions/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          phone: phone,
          occasion: occasion,
          story: story,
          honeypot: honeypot
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.status === "success"){
          // GTM Tracking Event
          window.dataLayer.push({
            event: 'lead_submit',
            name: name,
            phone: phone,
            occasion: occasion
          });
          
          const message = `Hi DearStory 👋

I just submitted a request on your website.

Here are my details:

Name: ${name}
Phone: ${phone}
Occasion: ${occasion}
Story Idea: ${story || "Not provided"}

Please share more details. Looking forward 😊`;

          const whatsappURL = `https://wa.me/919046105790?text=${encodeURIComponent(message)}`;
          window.location.href = whatsappURL;
        } else {
          alert("Submission failed: " + (data.message || "Unknown error"));
        }
      })
      .catch(error => {
        console.error('Fetch exception:', error);
        alert("Server error. Please try again.");
      });
    });
  }

  // WhatsApp Button handling
  const waButtons = document.querySelectorAll('.wa-button');
  waButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // GTM Tracking Event
      window.dataLayer.push({ event: 'whatsapp_click' });
      
      const message = `Hi DearStory 👋

I would like to know more about your personalized storybook services.

Can you please share details?`;

      const whatsappURL = `https://wa.me/919046105790?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, '_blank');
    });
  });

  // Hero Slideshow Logic (3D Card Stack)
  const slides = document.querySelectorAll('.hero-slideshow .slide');
  const dotsWrapper = document.querySelector('.hero-slideshow .slide-dots');
  const slideshowContainer = document.querySelector('.hero-slideshow');
  const prevBtn = document.querySelector('.slide-prev');
  const nextBtn = document.querySelector('.slide-next');
  let currentSlide = 0;
  let slideInterval;
  let renderVersion = 0;

  if (slides.length > 0) {
    if (dotsWrapper) {
      dotsWrapper.innerHTML = '';
      slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index.toString();
        dotsWrapper.appendChild(dot);
      });
    }

    const dots = document.querySelectorAll('.hero-slideshow .dot');

    const updateCards = () => {
      renderVersion += 1;
      const thisRender = renderVersion;
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const sideOffset = isMobile ? 24 : 50;
      const sideDepth = isMobile ? -35 : -60;

      slides.forEach((slide, index) => {
        // Reset base transition
        slide.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        slide.classList.remove('active');
        
        let offset = index - currentSlide;
        // Handle circular wraparound
        if (offset === - (slides.length - 1)) offset = 1;
        if (offset === slides.length - 1) offset = -1;
        
        if (offset === 0) {
          // Central active card
          slide.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
          slide.style.opacity = '1';
          slide.style.zIndex = '10';
          slide.classList.add('active');
          slide.style.visibility = 'visible';
        } else if (offset === 1) {
          // Card immediately to the right
          slide.style.transform = `translate3d(${sideOffset}px, 0, ${sideDepth}px) scale(0.9) rotate(3deg)`;
          slide.style.opacity = '0.7';
          slide.style.zIndex = '5';
          slide.style.visibility = 'visible';
        } else if (offset === -1) {
          // Card immediately to the left
          slide.style.transform = `translate3d(-${sideOffset}px, 0, ${sideDepth}px) scale(0.9) rotate(-3deg)`;
          slide.style.opacity = '0.7';
          slide.style.zIndex = '5';
          slide.style.visibility = 'visible';
        } else {
          // Hidden background cards
          slide.style.transform = 'translate3d(0, 0, -120px) scale(0.8) rotate(0deg)';
          slide.style.opacity = '0';
          slide.style.zIndex = '1';
          
          slide.style.visibility = 'visible';
          // Use setTimeout only to hide visibility after fade completes to preserve animation
          setTimeout(() => { 
            if (renderVersion === thisRender && slide.style.zIndex === '1') {
              slide.style.visibility = 'hidden';
            }
          }, 800);
        }
      });
      
      dots.forEach(d => d.classList.remove('active'));
      if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
      }
    };

    const goToSlide = (index) => {
      currentSlide = (index + slides.length) % slides.length;
      updateCards();
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    const startSlideshow = () => {
      slideInterval = setInterval(nextSlide, 5000); // 5 seconds per slide (slowed down)
    };

    const stopSlideshow = () => {
      clearInterval(slideInterval);
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        stopSlideshow();
        startSlideshow();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        stopSlideshow();
        startSlideshow();
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
        stopSlideshow();
        startSlideshow();
      });
    });

    // Optional: Pause on hover
    if (slideshowContainer) {
      slideshowContainer.addEventListener('mouseenter', stopSlideshow);
      slideshowContainer.addEventListener('mouseleave', startSlideshow);
    }

    window.addEventListener('resize', updateCards);

    // Render initial 3D card layout
    updateCards();
    startSlideshow();
  }

  // FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(i => i.classList.remove('active'));
      
      if(!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Scroll Animations Logic
  const autoAnimatedBlocks = document.querySelectorAll('.use-case-card, .step-card, .sample-card, .testimonial-card, .pricing-card, .feature-item, .faq-item');
  autoAnimatedBlocks.forEach((block, index) => {
    if (!block.classList.contains('animate-on-scroll')) {
      block.classList.add('animate-on-scroll');
      block.style.transitionDelay = `${Math.min((index % 6) * 0.08, 0.4)}s`;
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => observer.observe(el));
});
