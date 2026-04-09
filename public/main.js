document.addEventListener('DOMContentLoaded', () => {


// =============================
// MODAL + FORM LOGIC
// =============================

const modal = document.getElementById('lead-modal');
const form = document.getElementById('lead-form');

const createStoryBtns = [
document.getElementById('btn-create-story-hero'),
document.getElementById('btn-create-story-cta'),
document.getElementById('btn-create-story-mobile'),
...document.querySelectorAll('.pricing-card button')
];

const btnModalClose = document.getElementById('btn-modal-close');

const openModal = (e) => {
if(e) e.preventDefault();
if(modal) modal.classList.add('active');
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
// FORM SUBMISSION
// =============================

if(form){

form.addEventListener("submit", function(e){

e.preventDefault();

const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;
const occasion = document.getElementById("occasion").value;
const story = document.getElementById("story").value;

const scriptURL =
"https://script.google.com/macros/s/AKfycbyqTZDjLmoreo1TcZmEcg2iWF18so9BPIHDi3SA83qJObDvjcY9K1JbVfcakhAxaAIy/exec";

const formData = new FormData();

formData.append("name", name);
formData.append("phone", phone);
formData.append("occasion", occasion);
formData.append("story", story);

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

const message = `Hi DearStory 👋

Name: ${name}
Phone: ${phone}
Occasion: ${occasion}
Story: ${story || "Not provided"}`;

window.open(
`https://wa.me/919046105790?text=${encodeURIComponent(message)}`,
"_blank"
);

closeModal();
form.reset();

})
.catch(error=>{
console.error(error);
alert("Submission failed");
});

});

}



// =============================
// WHATSAPP BUTTONS
// =============================

document.querySelectorAll(".wa-button").forEach(btn => {

btn.addEventListener("click", function(e){

e.preventDefault();

if(typeof gtag !== "undefined"){
gtag('event', 'whatsapp_click', {
event_category: 'Engagement',
event_label: 'WhatsApp Button'
});
}

const message = `Hi DearStory 👋

I would like to know more about your personalized storybook services.

Can you please share details?`;

window.open(
`https://wa.me/919046105790?text=${encodeURIComponent(message)}`,
"_blank"
);

});

});


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

} else if (offset === 1 || offset === -1) {

slide.style.opacity = "0.6";
slide.style.zIndex = "5";

} else {

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


});
