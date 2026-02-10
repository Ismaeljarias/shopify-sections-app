/**
 * testimonials-slider.js
 * Horizontal scroll-snap slider with navigation
 * Vanilla JS, respects prefers-reduced-motion
 * ~5KB target size
 */

(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class TestimonialsSlider {
    constructor(element) {
      this.slider = element;
      this.track = this.slider.querySelector('[data-slider] .app-testimonials__track');
      this.dotsContainer = this.slider.querySelector('[data-dots-container]');
      this.slides = Array.from(this.slider.querySelectorAll('[data-slide]'));
      this.prevButton = this.slider.querySelector('[data-prev]');
      this.nextButton = this.slider.querySelector('[data-next]');
      
      this.autoplayEnabled = this.slider.querySelector('[data-slider]').dataset.autoplay === 'true';
      this.autoplayInterval = null;
      this.isScrolling = false;
      this.scrollTimeout = null;

      // State
      this.itemsPerView = 1;
      this.pageCount = 1;
      this.currentPage = 0;

      if (!this.track || this.slides.length === 0) return;
      
      this.init();
    }

    init() {
      this.updateMetrics();
      this.createDots();
      this.setupNavigation();
      this.setupAutoplay();
      this.updateControls();
      
      // Handle Resize
      window.addEventListener('resize', this.handleResize.bind(this));
      
      // Handle Shopify theme editor
      this.handleEditorEvents();
    }

    handleResize() {
      // Debounce resize
      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(() => {
        this.updateMetrics();
        this.createDots();
        this.updateControls();
      }, 200);
    }

    updateMetrics() {
      const trackWidth = this.track.clientWidth;
      const itemWidth = this.slides[0].offsetWidth;
      
      // Calculate how many items are fully visible (approx)
      // allow some tolerance for gaps
      this.itemsPerView = Math.round(trackWidth / itemWidth) || 1;
      
      this.pageCount = Math.ceil(this.slides.length / this.itemsPerView);
      
      // Ensure current page is valid
      if (this.currentPage >= this.pageCount) {
        this.currentPage = Math.max(0, this.pageCount - 1);
      }
    }

    createDots() {
      if (!this.dotsContainer) return;
      this.dotsContainer.innerHTML = ''; // Clear existing
      
      // If only 1 page, hide dots (optional, but cleaner)
      // User requested "we add the new dot" implies seeing at least one if relevant
      // Typically if pageCount <= 1, no navigation needed
      if (this.pageCount <= 1) {
        this.dots = [];
        return;
      }

      const dots = [];
      for (let i = 0; i < this.pageCount; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'app-testimonials__dot';
        btn.setAttribute('aria-label', `Go to page ${i + 1}`);
        
        btn.addEventListener('click', () => {
          this.stopAutoplay();
          this.goToPage(i);
        });
        
        this.dotsContainer.appendChild(btn);
        dots.push(btn);
      }
      this.dots = dots;
    }

    setupNavigation() {
      if (this.prevButton) {
        this.prevButton.addEventListener('click', () => {
          this.stopAutoplay();
          this.goToPrevious();
        });
      }

      if (this.nextButton) {
        this.nextButton.addEventListener('click', () => {
          this.stopAutoplay();
          this.goToNext();
        });
      }

      // Handle scroll events with debounce
      this.track.addEventListener('scroll', () => {
        if (this.isScrolling) return;
        
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
          this.handleScroll();
        }, 100);
      }, { passive: true });
    }

    setupAutoplay() {
      if (!this.autoplayEnabled || prefersReducedMotion) return;

      this.startAutoplay();

      this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
      this.slider.addEventListener('mouseleave', () => {
        if (this.autoplayEnabled) this.startAutoplay();
      });
      this.slider.addEventListener('focusin', () => this.stopAutoplay());
    }

    startAutoplay() {
      if (this.autoplayInterval) return;
      this.autoplayInterval = setInterval(() => this.goToNext(), 5000);
    }

    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    }

    goToPrevious() {
      const newPage = this.currentPage > 0 ? this.currentPage - 1 : this.pageCount - 1;
      this.goToPage(newPage);
    }

    goToNext() {
      const newPage = this.currentPage < this.pageCount - 1 ? this.currentPage + 1 : 0;
      this.goToPage(newPage);
    }

    goToPage(pageIndex) {
      if (pageIndex < 0 || pageIndex >= this.pageCount) return;

      this.currentPage = pageIndex;
      // Index of the first item on that page
      const slideIndex = pageIndex * this.itemsPerView;
      const slide = this.slides[slideIndex];
      
      if (!slide) return;

      this.isScrolling = true;
      slide.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'start'
      });

      // Unlock scrolling flag after animation approx
      setTimeout(() => {
        this.isScrolling = false;
      }, 500);

      this.updateControls();
    }

    handleScroll() {
      // Determine which page we are mostly on
      const scrollLeft = this.track.scrollLeft;
      const trackWidth = this.track.clientWidth;
      
      const newPage = Math.round(scrollLeft / trackWidth);
      
      if (newPage !== this.currentPage && newPage >= 0 && newPage < this.pageCount) {
        this.currentPage = newPage;
        this.updateControls();
      }
    }

    updateControls() {
      // Update dots
      if (this.dots) {
        this.dots.forEach((dot, index) => {
          const isActive = index === this.currentPage;
          dot.classList.toggle('app-testimonials__dot--active', isActive);
          dot.setAttribute('aria-selected', isActive);
        });
      }

      // Update buttons
      if (this.prevButton) this.prevButton.disabled = false;
      if (this.nextButton) this.nextButton.disabled = false;
    }

    handleEditorEvents() {
      if (typeof Shopify === 'undefined' || !Shopify.designMode) return;

      document.addEventListener('shopify:section:load', (e) => {
        if (e.target.contains(this.slider)) this.init();
      });

      document.addEventListener('shopify:section:unload', (e) => {
        if (e.target.contains(this.slider)) this.destroy();
      });

      document.addEventListener('shopify:block:select', (e) => {
        if (!e.target.hasAttribute('data-slide')) return;
        const index = this.slides.indexOf(e.target);
        if (index !== -1) {
          this.stopAutoplay();
          // Find which page this slide belongs to
          const page = Math.floor(index / this.itemsPerView);
          this.goToPage(page);
        }
      });
    }

    destroy() {
      this.stopAutoplay();
      window.removeEventListener('resize', this.handleResize);
    }
  }

  // Initialize
  function initSliders() {
    const sliders = document.querySelectorAll('[data-slider]');
    sliders.forEach(slider => {
      new TestimonialsSlider(slider.closest('.app-testimonials'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSliders);
  } else {
    initSliders();
  }

  document.addEventListener('shopify:section:load', (e) => {
    const sliders = e.target.querySelectorAll('[data-slider]');
    sliders.forEach(slider => {
      new TestimonialsSlider(slider.closest('.app-testimonials'));
    });
  });
})();
