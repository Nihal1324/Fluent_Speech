
   // Mobile menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('hidden');
    });

    // Filter therapists by specialty
    const filterSelect = document.getElementById('filter-specialty');
    const therapistCards = Array.from(document.querySelectorAll('.therapist-card'));

    filterSelect.addEventListener('change', () => {
      const selected = filterSelect.value;
      therapistCards.forEach(card => {
        if (selected === 'all' || card.dataset.specialty === selected) {
          card.classList.remove('hidden');
          card.setAttribute('tabindex', '0');
          card.querySelector('.book-btn').classList.add('pulse');
        } else {
          card.classList.add('hidden');
          card.setAttribute('tabindex', '-1');
          card.querySelector('.book-btn').classList.remove('pulse');
        }
      });
    });

    // Modal elements
    const modal = document.getElementById('modal-booking');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const therapistInfo = document.getElementById('modal-desc');
    const bookingForm = document.getElementById('booking-form');
    const bookButtons = document.querySelectorAll('.book-btn');
    let activeButton = null;

    // Toast elements
    const toast = document.getElementById('toast-success');
    const toastCloseBtn = document.getElementById('toast-close-btn');

    // Open modal and populate therapist info
    bookButtons.forEach(button => {
      button.addEventListener('click', () => {
        activeButton = button;
        const name = button.dataset.name;
        const specialty = button.dataset.specialty;
        therapistInfo.textContent = `Booking a consultation with ${name} (${specialty}). Please fill in your details below.`;
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        button.setAttribute('aria-expanded', 'true');
        // Reset form
        bookingForm.reset();
        clearErrors();
        // Set min date to today
        const dateInput = bookingForm.querySelector('#date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        // Focus first input
        bookingForm.querySelector('#name').focus();
        trapFocus(modal);
      });
    });

    // Close modal function
    function closeModal() {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      if (activeButton) {
        activeButton.setAttribute('aria-expanded', 'false');
        activeButton.focus();
        activeButton = null;
      }
      releaseFocus();
    }

    modalCloseBtn.addEventListener('click', closeModal);
    modalCancelBtn.addEventListener('click', closeModal);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        e.preventDefault();
        closeModal();
      }
    });

    // Form validation helpers
    function showError(input, errorId) {
      const errorEl = document.getElementById(errorId);
      errorEl.classList.remove('hidden');
      input.setAttribute('aria-invalid', 'true');
    }
    function hideError(input, errorId) {
      const errorEl = document.getElementById(errorId);
      errorEl.classList.add('hidden');
      input.removeAttribute('aria-invalid');
    }
    function clearErrors() {
      ['name', 'email', 'date', 'time'].forEach(field => {
        hideError(bookingForm.querySelector(`#${field}`), `${field}-error`);
      });
    }

    // Email validation regex
    function isValidEmail(email) {
      // Simple email regex
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Form submission
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();
      let valid = true;

      const nameInput = bookingForm.querySelector('#name');
      const emailInput = bookingForm.querySelector('#email');
      const dateInput = bookingForm.querySelector('#date');
      const timeInput = bookingForm.querySelector('#time');

      if (!nameInput.value.trim()) {
        showError(nameInput, 'name-error');
        valid = false;
      }
      if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
        showError(emailInput, 'email-error');
        valid = false;
      }
      if (!dateInput.value) {
        showError(dateInput, 'date-error');
        valid = false;
      } else {
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (selectedDate < today) {
          showError(dateInput, 'date-error');
          valid = false;
        }
      }
      if (!timeInput.value) {
        showError(timeInput, 'time-error');
        valid = false;
      }

      if (!valid) {
        return;
      }

      // Simulate booking process with loading spinner on button
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<svg class="animate-spin h-5 w-5 mr-2 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>Booking...`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm Booking';
        closeModal();
        showToast();
      }, 2000);
    });

    // Toast functions
    function showToast() {
      toast.classList.remove('hidden');
      toast.style.opacity = '1';
      toast.focus();
      setTimeout(() => {
        fadeOutToast();
      }, 5000);
    }
    function fadeOutToast() {
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 500);
    }
    toastCloseBtn.addEventListener('click', () => {
      fadeOutToast();
    });

    // Focus trap for modal
    let focusableElementsString = 'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    let firstTabStop = null;
    let lastTabStop = null;

    function trapFocus(element) {
      const focusableElements = element.querySelectorAll(focusableElementsString);
      if (focusableElements.length === 0) return;
      firstTabStop = focusableElements[0];
      lastTabStop = focusableElements[focusableElements.length - 1];
      element.addEventListener('keydown', trapTabKey);
    }

    function trapTabKey(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstTabStop) {
            e.preventDefault();
            lastTabStop.focus();
          }
        } else {
          if (document.activeElement === lastTabStop) {
            e.preventDefault();
            firstTabStop.focus();
          }
        }
      }
    }

    function releaseFocus() {
      modal.removeEventListener('keydown', trapTabKey);
    }

