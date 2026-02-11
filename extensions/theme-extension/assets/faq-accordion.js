/**
 * faq-accordion.js
 * Keyboard-accessible accordion with smooth transitions.
 * Uses Event Delegation for dynamic content support.
 */

(function() {
  'use strict';

  class FAQAccordion {
    constructor(element) {
      if (!element) return;
      this.accordion = element;
      this.allowMultiple = this.accordion.getAttribute('data-multiple') === 'true';
      this.init();
    }

    init() {
      // Use event delegation on the container
      this.accordion.addEventListener('click', this.handleClick.bind(this));
      this.accordion.addEventListener('keydown', this.handleKeyboard.bind(this));
      
      this.handleEditorEvents();
    }

    handleClick(e) {
      const button = e.target.closest('[data-faq-button]');
      if (!button || !this.accordion.contains(button)) return;

      e.preventDefault();
      this.toggleItem(button);
    }
    
    getButtons() {
      return Array.from(this.accordion.querySelectorAll('[data-faq-button]'));
    }

    toggleItem(button) {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      if (!this.allowMultiple && !isExpanded) {
        // Close others if single mode
        const allButtons = this.getButtons();
        allButtons.forEach(btn => {
          if (btn !== button && btn.getAttribute('aria-expanded') === 'true') {
            this.closeItem(btn);
          }
        });
      }

      if (isExpanded) {
        this.closeItem(button);
      } else {
        this.openItem(button);
      }
    }

    openItem(button) {
      button.setAttribute('aria-expanded', 'true');
      // The CSS transition handles the height based on grid-template-rows
    }

    closeItem(button) {
      button.setAttribute('aria-expanded', 'false');
    }

    handleKeyboard(e) {
      const button = e.target.closest('[data-faq-button]');
      if (!button || !this.accordion.contains(button)) return;

      const key = e.key;

      if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        this.toggleItem(button);
        return;
      }

      const buttons = this.getButtons();
      const currentIndex = buttons.indexOf(button);
      let targetButton = null;

      if (key === 'ArrowDown' || key === 'ArrowRight') {
        e.preventDefault();
        targetButton = buttons[(currentIndex + 1) % buttons.length];
      } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
        e.preventDefault();
        targetButton = buttons[(currentIndex - 1 + buttons.length) % buttons.length];
      } else if (key === 'Home') {
        e.preventDefault();
        targetButton = buttons[0];
      } else if (key === 'End') {
        e.preventDefault();
        targetButton = buttons[buttons.length - 1];
      }

      if (targetButton) {
        targetButton.focus();
      }
    }

    handleEditorEvents() {
      if (typeof Shopify === 'undefined' || !Shopify.designMode) return;

      // When blocks are selected/deselected in the Theme Editor
      document.addEventListener('shopify:block:select', (e) => {
        const button = e.target.querySelector('[data-faq-button]');
        if (button && this.accordion.contains(button)) {
          this.openItem(button);
          button.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });

      document.addEventListener('shopify:block:deselect', (e) => {
        const button = e.target.querySelector('[data-faq-button]');
        if (button && this.accordion.contains(button)) {
          this.closeItem(button);
        }
      });
    }

    destroy() {
      // Cleanup if needed
    }
  }

  // Global init function exposed for manual calls
  window.initAccordions = function() {
    const accordions = document.querySelectorAll('[data-faq-accordion]');
    accordions.forEach(accordion => {
      // Prevent multiple initializations on the same element
      if (accordion.classList.contains('app-accordion-initialized')) return;
      
      new FAQAccordion(accordion);
      accordion.classList.add('app-accordion-initialized');
    });
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initAccordions);
  } else {
    window.initAccordions();
  }

  // Shopify Events
  document.addEventListener('shopify:section:load', window.initAccordions);
  
  // Custom Event for dynamic loading
  window.addEventListener('app:faq:update', window.initAccordions);

})();
