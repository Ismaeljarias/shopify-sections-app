/**
 * faq-accordion.js
 * Keyboard-accessible accordion with smooth transitions.
 * Minimal JS, ARIA-compliant.
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
      this.buttons = Array.from(this.accordion.querySelectorAll('[data-faq-button]'));
      this.setupButtons();
      this.handleEditorEvents();
    }

    setupButtons() {
      this.buttons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleItem(button);
        });

        button.addEventListener('keydown', (e) => {
          this.handleKeyboard(e, button);
        });
      });
    }

    toggleItem(button) {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      if (!this.allowMultiple && !isExpanded) {
        this.buttons.forEach(btn => {
          if (btn !== button) this.closeItem(btn);
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
      const answerId = button.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);

      if (answer) {
        const content = answer.querySelector('.app-faq__answer-content');
        if (content) {
          answer.style.setProperty('--content-height', `${content.scrollHeight}px`);
        }
      }
    }

    closeItem(button) {
      button.setAttribute('aria-expanded', 'false');
    }

    handleKeyboard(e, button) {
      const key = e.key;

      if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        this.toggleItem(button);
        return;
      }

      const currentIndex = this.buttons.indexOf(button);
      let targetButton = null;

      if (key === 'ArrowDown' || key === 'ArrowRight') {
        e.preventDefault();
        targetButton = this.buttons[currentIndex + 1] || this.buttons[0];
      } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
        e.preventDefault();
        targetButton = this.buttons[currentIndex - 1] || this.buttons[this.buttons.length - 1];
      } else if (key === 'Home') {
        e.preventDefault();
        targetButton = this.buttons[0];
      } else if (key === 'End') {
        e.preventDefault();
        targetButton = this.buttons[this.buttons.length - 1];
      }

      if (targetButton) targetButton.focus();
    }

    /** Reinitialize after blocks are added/removed in the theme editor. */
    reinit() {
      this.buttons = Array.from(this.accordion.querySelectorAll('[data-faq-button]'));
      this.setupButtons();
    }

    handleEditorEvents() {
      if (typeof Shopify === 'undefined' || !Shopify.designMode) return;

      document.addEventListener('shopify:section:load', (e) => {
        if (e.target.contains(this.accordion)) this.init();
      });

      document.addEventListener('shopify:section:unload', (e) => {
        if (e.target.contains(this.accordion)) this.destroy();
      });

      // Reinitialize when blocks are added or removed
      document.addEventListener('shopify:section:rerender', (e) => {
        if (e.target.contains(this.accordion)) this.reinit();
      });

      // Open the selected block in the editor
      document.addEventListener('shopify:block:select', (e) => {
        const button = e.target.querySelector('[data-faq-button]');
        if (button && this.buttons.includes(button)) {
          this.openItem(button);
          button.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });

      // Close the deselected block in the editor
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

  function initAccordions() {
    const accordions = document.querySelectorAll('[data-faq-accordion]');
    accordions.forEach(accordion => {
      new FAQAccordion(accordion);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccordions);
  } else {
    initAccordions();
  }

  document.addEventListener('shopify:section:load', (e) => {
    const accordions = e.target.querySelectorAll('[data-faq-accordion]');
    accordions.forEach(accordion => {
      new FAQAccordion(accordion);
    });
  });
})();
