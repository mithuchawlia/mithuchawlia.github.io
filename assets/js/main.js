/* ── PORTFOLIO: Owl Carousel + Custom Popup ── */
$(document).ready(function(){

  /* Init Owl Carousel */
  $('#lgPortfolio').owlCarousel({
    loop: true,
    margin: 14,
    nav: false,
    dots: false,
    items: 2,
    autoplay: true,
    responsive:{ 0:{items:1}, 600:{items:2} }
  });

  $('#owlNext').click(function(){ $('#lgPortfolio').trigger('next.owl.carousel'); });
  $('#owlPrev').click(function(){ $('#lgPortfolio').trigger('prev.owl.carousel'); });

  /* ── Custom Popup ── */
  const overlay    = document.getElementById('portfolioPopup');
  const popupImg   = document.getElementById('popupImg');
  const popupTitle = document.getElementById('popupTitle');
  const popupTags  = document.getElementById('popupTags');
  const popupVisit = document.getElementById('popupVisit');
  const popupClose = document.getElementById('popupClose');
  const popupPrev  = document.getElementById('popupPrev');
  const popupNext  = document.getElementById('popupNext');
  const popupCounter = document.getElementById('popupCounter');

  let allProjects = [];
  let currentIndex = 0;

  // Collect all gallery items into array (once carousel is ready)
  function collectProjects(){
    allProjects = [];
    // Get unique items by src (owl clones duplicates — filter them)
    const seen = new Set();
    document.querySelectorAll('.gallery-item').forEach(el => {
      const src = el.dataset.src;
      if(src && !seen.has(src)){
        seen.add(src);
        allProjects.push({
          src:   src,
          title: el.dataset.title || '',
          tags:  el.dataset.tags  || '',
          url:   el.dataset.url   || '#'
        });
      }
    });
  }

  function showProject(index){
    // Scroll popup back to top on each navigation
    overlay.scrollTop = 0;
    const p = allProjects[index];
    popupImg.src = p.src;
    popupImg.alt = p.title;
    popupTitle.textContent = p.title;
    popupTags.textContent  = p.tags;
    popupVisit.href = p.url;
    popupCounter.textContent = (index + 1) + ' / ' + allProjects.length;
    if(p.url === '#' || p.url === ''){
      popupVisit.style.display = 'none';
    } else {
      popupVisit.style.display = 'inline-flex';
    }
  }

  // Open popup on gallery item click
  $(document).on('click', '.gallery-item', function(e){
    e.preventDefault();
    collectProjects();
    const src = $(this).data('src');
    currentIndex = allProjects.findIndex(p => p.src === src);
    if(currentIndex < 0) currentIndex = 0;
    showProject(currentIndex);
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    popupPrev.style.display = 'flex';
    popupNext.style.display = 'flex';
  });

  // Prev
  popupPrev.addEventListener('click', function(e){
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + allProjects.length) % allProjects.length;
    showProject(currentIndex);
  });

  // Next
  popupNext.addEventListener('click', function(e){
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % allProjects.length;
    showProject(currentIndex);
  });

  // Close on X button
  popupClose.addEventListener('click', closePopup);

  // Close on overlay click (outside popup box — but not on nav buttons)
  overlay.addEventListener('click', function(e){
    if(e.target === overlay) closePopup();
  });

  // Keyboard: ESC = close, Left/Right = navigate
  document.addEventListener('keydown', function(e){
    if(!overlay.classList.contains('active')) return;
    if(e.key === 'Escape')      closePopup();
    if(e.key === 'ArrowLeft')  { currentIndex = (currentIndex - 1 + allProjects.length) % allProjects.length; showProject(currentIndex); }
    if(e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % allProjects.length; showProject(currentIndex); }
  });

  function closePopup(){
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    popupPrev.style.display = 'none';
    popupNext.style.display = 'none';
    setTimeout(()=>{ popupImg.src = ''; }, 350);
  }

});

/* ── Nav ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 40));
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => { hamburger.classList.toggle('active'); mobileMenu.classList.toggle('open'); });
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('active'); mobileMenu.classList.remove('open');
}));

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return; e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
  });
});

/* ── Scroll reveal ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .tl-item').forEach(el => obs.observe(el));

/* ── Fun-fact Counter Animation ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const stepTime = 16;
  const steps = Math.round(duration / stepTime);
  let current = 0;
  el.textContent = '0' + suffix;
  const timer = setInterval(() => {
    current++;
    const progress = current / steps;
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = value + suffix;
    if (current >= steps) {
      el.textContent = target + suffix;
      clearInterval(timer);
    }
  }, stepTime);
}

const counterObs = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-num').forEach(el => counterObs.observe(el));


//=====back====to====top===start=====//

$(document).ready(function () {

    var progressWrap = $('.progress-wrap');
    var progressPath = document.querySelector('.progress-wrap path');
    var pathLength = progressPath.getTotalLength();

    // Initial setup
    progressPath.style.transition = 'none';
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();

    progressPath.style.transition = 'stroke-dashoffset 200ms linear';

    // Update progress
    function updateProgress() {
        var scroll = $(window).scrollTop();
        var height = $(document).height() - $(window).height();
        var progress = pathLength - (scroll * pathLength / height);
        progressPath.style.strokeDashoffset = progress;
    }

    // On scroll
    $(window).on('scroll', function () {
        updateProgress();

        if ($(window).scrollTop() > 100) {
            progressWrap.addClass('active-progress');
        } else {
            progressWrap.removeClass('active-progress');
        }
    });

    // Click to scroll top
    progressWrap.on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

});
