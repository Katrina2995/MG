// Mobile menu toggle
(function() {
  'use strict';
  
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInside = mobileMenuToggle.contains(event.target) || mainNav.contains(event.target);
      
      if (!isClickInside && mainNav.classList.contains('active')) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && mainNav.classList.contains('active')) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        mobileMenuToggle.focus();
      }
    });
  }
})();

// Expandable service cards
(function() {
  'use strict';
  
  const expandableCards = document.querySelectorAll('.card-expandable');
  
  expandableCards.forEach(function(card) {
    const cardImage = card.querySelector('.card-image[role="button"]');
    const cardDescription = card.querySelector('.card-description');
    
    if (!cardImage || !cardDescription) return;
    
    function toggleCard() {
      const isExpanded = card.getAttribute('data-expanded') === 'true';
      const newExpandedState = !isExpanded;
      
      card.setAttribute('data-expanded', newExpandedState);
      cardImage.setAttribute('aria-expanded', newExpandedState);
      
      // Toggle hidden attribute for accessibility
      if (newExpandedState) {
        cardDescription.removeAttribute('hidden');
      } else {
        cardDescription.setAttribute('hidden', '');
      }
    }
    
    // Handle click
    cardImage.addEventListener('click', toggleCard);
    
    // Handle keyboard (Enter and Space)
    cardImage.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleCard();
      }
    });
  });
})();
