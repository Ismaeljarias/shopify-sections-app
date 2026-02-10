/**
 * faq-accordion.js
 * Keyboard-accessible accordion with smooth transitions
 * Minimal JS, ARIA-compliant
 * ~5KB target size
 */

(function() {
  'use strict';

  class FAQAccordion {
    constructor(element) {
      this.accordion = element;
      this.allowMultiple = this.accordion.dataset.multiple === 'true';
      this.buttons = Array.from(this.accordion.querySelectorAll('[data-faq-button]'));
      
      if (this.buttons.length === 0) return;
      
      this.init();
    }

    init() {
      this.setupButtons();
      this.handleEditorEvents();
    }

    setupButtons() {
      this.buttons.forEach(button => {
        // Click events
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleItem(button);
        });

        // Keyboard events
        button.addEventListener('keydown', (e) => {
          this.handleKeyboard(e, button);
        });
      });
    }

    toggleItem(button) {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      
      // If not allowing multiple, close all other items
      if (!this.allowMultiple && !isExpanded) {
        this.buttons.forEach(btn => {
          if (btn !== button) {
            this.closeItem(btn);
          }
        });
      }
      
      // Toggle current item
      if (isExpanded) {
        this.closeItem(button);
      } else {
        this.openItem(button);
      }
    }

    openItem(button) {
      button.setAttribute('aria-expanded', 'true');
      const answerId = button.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);
      
      if (answer) {
        // Calculate height for smooth transition
        const content = answer.querySelector('.app-faq__answer-content');
        if (content) {
          // Get natural height
          const height = content.scrollHeight;
          answer.style.setProperty('--content-height', `${height}px`);
        }
      }
    }

    closeItem(button) {
      button.setAttribute('aria-expanded', 'false');
    }

    handleKeyboard(e, button) {
      const key = e.key;
      
      // Enter or Space to toggle
      if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        this.toggleItem(button);
        return;
      }
      
      // Arrow navigation
      const currentIndex = this.buttons.indexOf(button);
      let targetButton = null;
      
      if (key === 'ArrowDown' || key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = currentIndex + 1;
        targetButton = this.buttons[nextIndex] || this.buttons[0];
      } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = currentIndex - 1;
        targetButton = this.buttons[prevIndex] || this.buttons[this.buttons.length - 1];
      } else if (key === 'Home') {
        e.preventDefault();
        targetButton = this.buttons[0];
      } else if (key === 'End') {
        e.preventDefault();
        targetButton = this.buttons[this.buttons.length - 1];
      }
      
      if (targetButton) {
        targetButton.focus();
      }
    }

    handleEditorEvents() {
      // Handle Shopify theme editor section load/unload
      if (typeof Shopify === 'undefined' || !Shopify.designMode) return;

      document.addEventListener('shopify:section:load', (e) => {
        if (e.target.contains(this.accordion)) {
          this.init();
        }
      });

      document.addEventListener('shopify:section:unload', (e) => {
        if (e.target.contains(this.accordion)) {
          this.destroy();
        }
      });

      document.addEventListener('shopify:block:select', (e) => {
        // Find the button within the selected block
        const button = e.target.querySelector('[data-faq-button]');
        if (button && this.buttons.includes(button)) {
          this.openItem(button);
          button.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });

      document.addEventListener('shopify:block:deselect', (e) => {
        const button = e.target.querySelector('[data-faq-button]');
        if (button && this.buttons.includes(button)) {
          this.closeItem(button);
        }
      });
    }

    destroy() {
      // Cleanup if needed
    }
  }

  // Initialize all accordions
  function initAccordions() {
    const accordions = document.querySelectorAll('[data-faq-accordion]');
    accordions.forEach(accordion => {
      new FAQAccordion(accordion);
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccordions);
  } else {
    initAccordions();
  }

  // Re-initialize on Shopify section render (for theme editor)
  document.addEventListener('shopify:section:load', (e) => {
    const accordions = e.target.querySelectorAll('[data-faq-accordion]');
    accordions.forEach(accordion => {
      new FAQAccordion(accordion);
    });
  });
})();
