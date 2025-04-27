
   // Mobile menu toggle
    const btn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');

    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });

    // Set min date for preferredDate input to today
    const dateInput = document.getElementById('preferredDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Form validation and submission simulation
    const form = document.getElementById('consultationForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');

    // Error elements
    const fullNameError = document.getElementById('fullNameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const dateError = document.getElementById('dateError');
    const timeError = document.getElementById('timeError');
    const agreeError = document.getElementById('agreeError');

    function validateEmail(email) {
      // Simple email regex
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    function validatePhone(phone) {
      if (phone.trim() === '') return true; // optional
      const re = /^\+?[0-9\s\-\(\)]{7,15}$/;
      return re.test(phone);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Reset errors
      fullNameError.classList.add('hidden');
      emailError.classList.add('hidden');
      phoneError.classList.add('hidden');
      dateError.classList.add('hidden');
      timeError.classList.add('hidden');
      agreeError.classList.add('hidden');
      successMessage.classList.add('hidden');

      let valid = true;

      // Validate full name
      if (!form.fullName.value.trim()) {
        fullNameError.classList.remove('hidden');
        valid = false;
      }

      // Validate email
      if (!validateEmail(form.email.value.trim())) {
        emailError.classList.remove('hidden');
        valid = false;
      }

      // Validate phone (optional)
      if (!validatePhone(form.phone.value.trim())) {
        phoneError.classList.remove('hidden');
        valid = false;
      }

      // Validate date (today or later)
      if (!form.preferredDate.value || form.preferredDate.value < today) {
        dateError.classList.remove('hidden');
        valid = false;
      }

      // Validate time
      if (!form.preferredTime.value) {
        timeError.classList.remove('hidden');
        valid = false;
      }

      // Validate agree checkbox
      if (!form.agree.checked) {
        agreeError.classList.remove('hidden');
        valid = false;
      }

      if (!valid) {
        return;
      }

      // Disable submit button and show spinner
      submitBtn.disabled = true;
      submitBtn.querySelector('span').classList.add('opacity-50');
      submitBtn.querySelector('svg').classList.remove('hidden');

      // Simulate form submission delay
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').classList.remove('opacity-50');
        submitBtn.querySelector('svg').classList.add('hidden');
        form.reset();
        successMessage.classList.remove('hidden');
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth' });
      }, 2000);
    });

    // Coach cards keyboard accessibility and toggle aria-pressed
    const coachCards = document.querySelectorAll('[role="button"]');
    coachCards.forEach(card => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCoachCard(card);
        }
      });
      card.addEventListener('click', () => {
        toggleCoachCard(card);
      });
    });

    function toggleCoachCard(card) {
      const pressed = card.getAttribute('aria-pressed') === 'true';
      coachCards.forEach(c => c.setAttribute('aria-pressed', 'false'));
      if (!pressed) {
        card.setAttribute('aria-pressed', 'true');
        showCoachDetails(card);
      } else {
        card.setAttribute('aria-pressed', 'false');
        hideCoachDetails();
      }
    }

    // Create and manage coach detail modal
    let modal = null;

    function showCoachDetails(card) {
      const name = card.querySelector('h3').textContent;
      const description = card.querySelector('p').textContent;
      const imgSrc = card.querySelector('img').src;
      const imgAlt = card.querySelector('img').alt;
      const linkedinLink = card.querySelector('a[href*="linkedin"]')?.href || '#';
      const emailLink = card.querySelector('a[href^="mailto:"]')?.href || '#';

      if (!modal) {
        modal = document.createElement('div');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modalTitle');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
          <div class="bg-white rounded-lg max-w-md w-full p-6 relative shadow-lg">
            <button aria-label="Close modal" id="modalCloseBtn" class="absolute top-3 right-3 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded">
              <i class="fas fa-times fa-lg"></i>
            </button>
            <img id="modalImg" alt="" class="rounded-full w-32 h-32 mx-auto mb-4 object-cover" />
            <h3 id="modalTitle" class="text-2xl font-bold text-center mb-2"></h3>
            <p id="modalDesc" class="text-gray-700 mb-4 text-center"></p>
            <div class="flex justify-center space-x-6 text-blue-600 text-2xl">
              <a id="modalLinkedin" href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"><i class="fab fa-linkedin"></i></a>
              <a id="modalEmail" href="#" aria-label="Send email"><i class="fas fa-envelope"></i></a>
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        // Close modal button
        document.getElementById('modalCloseBtn').addEventListener('click', hideCoachDetails);

        // Close modal on outside click
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            hideCoachDetails();
          }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            hideCoachDetails();
          }
        });
      }

      document.getElementById('modalTitle').textContent = name;
      const modalImg = document.getElementById('modalImg');
      modalImg.src = imgSrc;
      modalImg.alt = imgAlt;
      document.getElementById('modalDesc').textContent = description;
      document.getElementById('modalLinkedin').href = linkedinLink;
      document.getElementById('modalEmail').href = emailLink;

      modal.classList.remove('hidden');
      modal.focus();
    }

    function hideCoachDetails() {
      if (modal) {
        modal.classList.add('hidden');
      }
      coachCards.forEach(c => c.setAttribute('aria-pressed', 'false'));
    }
  