document.addEventListener('DOMContentLoaded', () => {


// =============================
// ANNOUNCEMENT BANNER (CHANGE 1)
// =============================

const announcementBanner = document.getElementById('announcement-banner');
const announcementClose = document.getElementById('announcement-close');
const siteHeader = document.getElementById('site-header');

if (announcementBanner && announcementClose) {
  // Check if banner was previously dismissed
  if (sessionStorage.getItem('announcementDismissed') === 'true') {
    announcementBanner.style.display = 'none';
    if (siteHeader) siteHeader.classList.remove('banner-visible');
  } else {
    announcementBanner.style.display = 'flex';
    if (siteHeader) siteHeader.classList.add('banner-visible');
  }

  announcementClose.addEventListener('click', () => {
    announcementBanner.style.display = 'none';
    sessionStorage.setItem('announcementDismissed', 'true');
    if (siteHeader) siteHeader.classList.remove('banner-visible');
  });
}


// =============================
// MODAL + FORM LOGIC
// =============================

const modal = document.getElementById('lead-modal');
const form = document.getElementById('lead-form');
const formSuccess = document.getElementById('form-success');

const createStoryBtns = [
document.getElementById('btn-create-story-hero'),
document.getElementById('btn-create-story-cta'),
document.getElementById('btn-create-story-mobile'),
document.getElementById('btn-create-story-first-chapter')
];

const btnModalClose = document.getElementById('btn-modal-close');

const openModal = (e) => {
if(e) e.preventDefault();
  if(typeof fbq !== "undefined"){
fbq('track', 'InitiateCheckout');
}
if(typeof gtag !== "undefined"){
gtag('event', 'create_story_click', {
event_category: 'Engagement',
event_label: 'Create Story Button'
});
}
if(modal) {
  // Reset to show form, hide success
  if(form) form.style.display = 'block';
  if(formSuccess) formSuccess.style.display = 'none';
  modal.classList.add('active');
}
};

const closeModal = () => {
if(modal) modal.classList.remove('active');
};

createStoryBtns.forEach(btn => {
if(btn){
btn.addEventListener('click', openModal);
}
});

if (btnModalClose) {
btnModalClose.addEventListener('click', closeModal);
}

if(modal){
modal.addEventListener('click', (e) => {
if (e.target === modal) {
closeModal();
}
});
}


// =============================
// SAMPLE PREVIEW MODAL (CHANGE 4)
// =============================

const sampleModal = document.getElementById('sample-modal');
const btnSampleModalClose = document.getElementById('btn-sample-modal-close');
const sampleCards = document.querySelectorAll('.sample-card[data-sample]');

const openSampleModal = () => {
  if (sampleModal) sampleModal.classList.add('active');
};

const closeSampleModal = () => {
  if (sampleModal) sampleModal.classList.remove('active');
};

sampleCards.forEach(card => {
  card.addEventListener('click', openSampleModal);
});

if (btnSampleModalClose) {
  btnSampleModalClose.addEventListener('click', closeSampleModal);
}

if (sampleModal) {
  sampleModal.addEventListener('click', (e) => {
    if (e.target === sampleModal) {
      closeSampleModal();
    }
  });
}


// =============================
// FORM SUBMISSION (CHANGE 8)
// =============================

if(form){

form.addEventListener("submit", function(e){

e.preventDefault();

// Phone validation (CHANGE 8)
const phoneInput = document.getElementById("phone");
const phoneError = document.getElementById("phone-error");
const phoneValue = phoneInput.value.trim();
const phoneRegex = /^[6-9][0-9]{9}$/;

if (!phoneRegex.test(phoneValue)) {
  phoneInput.classList.add('input-error');
  if (phoneError) phoneError.style.display = 'block';
  phoneInput.focus();
  return;
} else {
  phoneInput.classList.remove('input-error');
  if (phoneError) phoneError.style.display = 'none';
}

// Honeypot check
const honeypot = document.getElementById("website_url");
if (honeypot && honeypot.value) return;

const submitBtn = form.querySelector("button[type='submit']");
submitBtn.disabled = true;
submitBtn.innerText = "Submitting...";

const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;
const occasion = document.getElementById("occasion").value;
const plan = document.getElementById("plan") ? document.getElementById("plan").value : '';
const story = document.getElementById("story").value;

const scriptURL =
"https://script.google.com/macros/s/AKfycbyqTZDjLmoreo1TcZmEcg2iWF18so9BPIHDi3SA83qJObDvjcY9K1JbVfcakhAxaAIy/exec";

const formData = new FormData();

formData.append("name", name);
formData.append("phone", phone);
formData.append("occasion", occasion);
formData.append("plan", plan);
formData.append("story", story);

  // META PIXEL LEAD TRACK
if(typeof fbq !== "undefined"){
fbq('track', 'Lead');
}

// SEND DATA IN BACKGROUND
fetch(scriptURL,{
method:"POST",
body:formData
})
.then(()=>{
if(typeof gtag !== "undefined"){
gtag('event', 'lead_form_submit', {
event_category: 'Lead',
event_label: 'DearStory Form'
});
}
})
.catch(error=>{
console.error(error);
});

// Show success message (CHANGE 8)
const successName = document.getElementById('success-name');
const successWaLink = document.getElementById('success-wa-link');

if (successName) successName.textContent = name;
if (successWaLink) {
  successWaLink.href = `https://wa.me/919046105790?text=Hi!%20I%20just%20submitted%20an%20order%20form%20on%20DearStory.%20My%20name%20is%20${encodeURIComponent(name)}.`;
}

// Hide form, show success
form.style.display = 'none';
if (formSuccess) formSuccess.style.display = 'block';

form.reset();
submitBtn.disabled = false;
submitBtn.innerText = "Submit Enquiry";

});
}

// Phone field live validation
const phoneInput = document.getElementById("phone");
if (phoneInput) {
  phoneInput.addEventListener('input', function() {
    // Only allow digits
    this.value = this.value.replace(/\D/g, '');
    const phoneError = document.getElementById("phone-error");
    if (this.classList.contains('input-error')) {
      this.classList.remove('input-error');
      if (phoneError) phoneError.style.display = 'none';
    }
  });
}


// =============================
// MOBILE MENU
// =============================

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navbarLinks = document.getElementById('navbar-links');

if (mobileMenuBtn && navbarLinks) {

mobileMenuBtn.addEventListener('click', () => {
navbarLinks.classList.toggle('active');
});

navbarLinks.querySelectorAll('a').forEach(link => {
link.addEventListener('click', () => {
navbarLinks.classList.remove('active');
});
});

}



// =============================
// HERO SLIDESHOW
// =============================

const slides = document.querySelectorAll('.hero-slideshow .slide');
const dots = document.querySelectorAll('.hero-slideshow .dot');
const prevBtn = document.querySelector('.slide-prev');
const nextBtn = document.querySelector('.slide-next');

let currentSlide = 0;
let slideInterval;

if (slides.length > 0) {

const updateCards = () => {

slides.forEach((slide, index) => {

slide.classList.remove('active');

let offset = index - currentSlide;

if (offset === -(slides.length - 1)) offset = 1;
if (offset === slides.length - 1) offset = -1;

if (offset === 0) {
slide.style.opacity = "1";
slide.style.zIndex = "10";
slide.classList.add("active");
}
else if (offset === 1 || offset === -1) {
slide.style.opacity = "0.6";
slide.style.zIndex = "5";
}
else {
slide.style.opacity = "0";
slide.style.zIndex = "1";
}

});

dots.forEach(d => d.classList.remove("active"));
dots[currentSlide].classList.add("active");

};

const goToSlide = (index) => {
currentSlide = (index + slides.length) % slides.length;
updateCards();
};

const nextSlide = () => goToSlide(currentSlide + 1);
const prevSlide = () => goToSlide(currentSlide - 1);

const startSlideshow = () => {
slideInterval = setInterval(nextSlide, 5000);
};

const stopSlideshow = () => {
clearInterval(slideInterval);
};

if(prevBtn){
prevBtn.addEventListener("click", ()=>{
prevSlide();
stopSlideshow();
startSlideshow();
});
}

if(nextBtn){
nextBtn.addEventListener("click", ()=>{
nextSlide();
stopSlideshow();
startSlideshow();
});
}

dots.forEach((dot,index)=>{
dot.addEventListener("click",()=>{
goToSlide(index);
stopSlideshow();
startSlideshow();
});
});

updateCards();
startSlideshow();

}



// =============================
// FAQ
// =============================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {

const question = item.querySelector('.faq-question');

if(question){

question.addEventListener('click', () => {

const isActive = item.classList.contains('active');

faqItems.forEach(i => i.classList.remove('active'));

if(!isActive){
item.classList.add('active');
}

});

}

});



// =============================
// SCROLL ANIMATION
// =============================

const observer = new IntersectionObserver((entries) => {

entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('is-visible');
}
});

});

document.querySelectorAll('.animate-on-scroll').forEach(el => {
observer.observe(el);
});


// =============================
// FLOATING WA TOOLTIP
// =============================

const floatingWa = document.getElementById('floating-wa');
if (floatingWa) {
  floatingWa.addEventListener('mouseenter', () => {
    const tooltip = floatingWa.querySelector('.wa-tooltip');
    if (tooltip) tooltip.classList.add('visible');
  });
  floatingWa.addEventListener('mouseleave', () => {
    const tooltip = floatingWa.querySelector('.wa-tooltip');
    if (tooltip) tooltip.classList.remove('visible');
  });
}

});
