

    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Modal elements
    const modal = document.getElementById('course-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalDuration = document.getElementById('modal-duration');
    const modalImage = document.getElementById('modal-image');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalEnrollBtn = document.getElementById('modal-enroll-btn');

    // Open modal with course details
    function openModal(course) {
        modalTitle.textContent = course.dataset.title;
        modalDesc.textContent = course.dataset.description;
        modalDuration.textContent = `Duration: ${course.dataset.duration}`;
        modalImage.src = course.dataset.image;
        modalImage.alt = course.dataset.alt;
        modalEnrollBtn.onclick = () => {
            alert(`You have enrolled in the "${course.dataset.title}"!`);
            closeModal();
        };
        modal.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden';
        modal.focus();
    }

    // Close modal
    function closeModal() {
        modal.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    }

    // Event listeners for course cards
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(card);
            }
        });
    });

    // Close modal on close button click
    modalCloseBtn.addEventListener('click', closeModal);

    // Close modal on outside click
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !modal.classList.contains('opacity-0')) {
            closeModal();
        }
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const coursesGrid = document.getElementById('courses-grid');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        courseCards.forEach(card => {
            const title = card.dataset.title.toLowerCase();
            const description = card.dataset.description.toLowerCase();
            if (title.includes(query) || description.includes(query)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
