/* =========================================
   MAIN.JS — Interactive Elements & Parallax
   ========================================= */

/**
 * Toggles the accordion state for case study cards.
 * @param {string} id - The ID of the card to toggle.
 */
function toggleCard(id) {
  const card = document.getElementById(id);
  const isOpen = card.classList.contains('open');
  
  // Close all open cards to keep UI clean
  document.querySelectorAll('.case-card').forEach(c => c.classList.remove('open'));
  
  if (!isOpen) {
    card.classList.add('open');
    // Smooth scroll to the newly opened card after a slight delay for layout repaint
    setTimeout(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }
}

/**
 * Initializes all dynamic DOM features once the document is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
  initHeroPerspective();
  initBackgroundParallax();
});

/**
 * Applies a 3D isometric tilt to the hero photography based on pointer position.
 */
function initHeroPerspective() {
  const photo = document.querySelector('.hero-photo img');
  if (!photo) return; // Exit if not on a page with the hero photo
  
  const container = photo.parentElement;
  
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    // Calculate cursor coordinates relative to container center
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate fractional rotation (max approx 15 degrees)
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;
    
    photo.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    photo.style.transition = 'transform 0.1s ease-out';
  });
  
  // Reset the 3D transform gracefully when the cursor leaves
  container.addEventListener('mouseleave', () => {
    photo.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    photo.style.transition = 'transform 0.5s ease-out';
  });
}

/**
 * Creates dynamic background scaling (parallax) mapped to scroll depth.
 */
function initBackgroundParallax() {
  // Inject the background graphic container into the DOM directly so it requires zero HTML repetitions.
  const bgGraphic = document.createElement('div');
  bgGraphic.classList.add('bg-graphic');
  document.body.appendChild(bgGraphic);

  let ticking = false;

  window.addEventListener('scroll', () => {
    // Utilize requestAnimationFrame to decouple heavy DOM repaints from scroll frequency (zero jank)
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        
        // Scale grows subtly on scroll to simulate delving "inside" the graphic over time.
        const scale = 1 + (scrollY * 0.0003);
        
        bgGraphic.style.transform = `translate(-50%, -50%) scale(${scale})`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true }); // Passive listener for scrolling performance
}
