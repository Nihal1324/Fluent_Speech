  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
  });

  // User menu toggle
  const userMenuButton = document.getElementById('user-menu-button');
  const userDropdown = document.getElementById('user-dropdown');
  const userMenuIcon = document.getElementById('user-menu-icon');

  userMenuButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = userDropdown.classList.contains('hidden');
      if (isHidden) {
          userDropdown.classList.remove('hidden');
          userMenuButton.setAttribute('aria-expanded', 'true');
          userMenuIcon.classList.add('rotate-180');
      } else {
          userDropdown.classList.add('hidden');
          userMenuButton.setAttribute('aria-expanded', 'false');
          userMenuIcon.classList.remove('rotate-180');
      }
  });

  // Close user menu on outside click
  document.addEventListener('click', () => {
      if (!userDropdown.classList.contains('hidden')) {
          userDropdown.classList.add('hidden');
          userMenuButton.setAttribute('aria-expanded', 'false');
          userMenuIcon.classList.remove('rotate-180');
      }
  });

  // Logout button interaction
  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn.addEventListener('click', () => {
      alert('You have been logged out.');
      // Here you would add actual logout logic
  });

  // Edit Profile button opens modal to update profile picture
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const profilePicModal = document.getElementById('profile-pic-modal');
  const profilePicInput = document.getElementById('profile-pic-input');
  const profilePicSaveBtn = document.getElementById('profile-pic-save-btn');
  const profilePicCancelBtn = document.getElementById('profile-pic-cancel-btn');
  const profilePicImg = document.getElementById('profile-pic');

  editProfileBtn.addEventListener('click', () => {
      profilePicInput.value = '';
      profilePicSaveBtn.disabled = true;
      profilePicModal.classList.remove('hidden');
      profilePicInput.focus();
  });

  profilePicCancelBtn.addEventListener('click', () => {
      profilePicModal.classList.add('hidden');
  });

  profilePicInput.addEventListener('change', () => {
      profilePicSaveBtn.disabled = !profilePicInput.files.length;
  });

  profilePicSaveBtn.addEventListener('click', () => {
      if (profilePicInput.files.length) {
          const file = profilePicInput.files[0];
          const reader = new FileReader();
          reader.onload = function (e) {
              profilePicImg.src = e.target.result;
              profilePicModal.classList.add('hidden');
              alert('Profile picture updated!');
          };
          reader.readAsDataURL(file);
      }
  });

  // Progress bars interaction
  const progressModal = document.getElementById('progress-modal');
  const progressRange = document.getElementById('progress-range');
  const progressValue = document.getElementById('progress-value');
  const progressSaveBtn = document.getElementById('progress-save-btn');
  const progressCancelBtn = document.getElementById('progress-cancel-btn');
  let currentProgressBar = null;

  function openProgressModal(bar) {
      currentProgressBar = bar;
      const currentWidth = bar.querySelector('div').style.width;
      const currentPercent = parseInt(currentWidth);
      progressRange.value = currentPercent;
      progressValue.textContent = currentPercent;
      progressModal.classList.remove('hidden');
      progressRange.focus();
  }

  document.querySelectorAll('[id^="progress-"]').forEach(bar => {
      bar.addEventListener('click', () => openProgressModal(bar));
      bar.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openProgressModal(bar);
          }
      });
  });

  progressRange.addEventListener('input', () => {
      progressValue.textContent = progressRange.value;
  });

  progressCancelBtn.addEventListener('click', () => {
      progressModal.classList.add('hidden');
      currentProgressBar = null;
  });

  progressSaveBtn.addEventListener('click', () => {
      if (currentProgressBar) {
          const newVal = progressRange.value;
          currentProgressBar.querySelector('div').style.width = newVal + '%';
          currentProgressBar.setAttribute('aria-valuenow', newVal);
          currentProgressBar.nextElementSibling?.textContent = newVal + '%';
          // Also update the sibling span with percentage text
          const labelSpan = currentProgressBar.previousElementSibling.querySelector('span.text-gray-600');
          if (labelSpan) labelSpan.textContent = newVal + '%';
          progressModal.classList.add('hidden');
          currentProgressBar = null;
          alert('Progress updated to ' + newVal + '%');
      }
  });

  // Recent activity items open modal with details
  const activityModal = document.getElementById('activity-modal');
  const activityModalContent = document.getElementById('activity-modal-content');
  const activityCloseBtn = document.getElementById('activity-close-btn');

  document.querySelectorAll('ul > li[role="button"]').forEach(item => {
      item.addEventListener('click', () => {
          activityModalContent.textContent = item.getAttribute('data-activity');
          activityModal.classList.remove('hidden');
          activityCloseBtn.focus();
      });
      item.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              activityModalContent.textContent = item.getAttribute('data-activity');
              activityModal.classList.remove('hidden');
              activityCloseBtn.focus();
          }
      });
  });

  activityCloseBtn.addEventListener('click', () => {
      activityModal.classList.add('hidden');
  });

  // Settings form validation and submission
  const settingsForm = document.getElementById('settings-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const saveSuccessMsg = document.getElementById('save-success-msg');

  settingsForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      // Email validation
      if (!emailInput.value || !emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          emailError.classList.remove('hidden');
          valid = false;
      } else {
          emailError.classList.add('hidden');
      }

      // Password validation (optional)
      if (passwordInput.value && passwordInput.value.length < 6) {
          passwordError.classList.remove('hidden');
          valid = false;
      } else {
          passwordError.classList.add('hidden');
      }

      if (valid) {
          // Simulate saving settings
          saveSuccessMsg.classList.remove('hidden');
          setTimeout(() => {
              saveSuccessMsg.classList.add('hidden');
          }, 3000);
      }
  });

  // Logo click scrolls to top
  const logo = document.getElementById('logo');
  logo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  });
