const cards = document.querySelectorAll('.testimonial-card');
        const wrapper = document.getElementById('testimonial-wrapper');
        let startIndex = 0;
        const visibleCount = 5;

        function showCards() {
            cards.forEach((card, index) => {
                card.style.display = (index >= startIndex && index < startIndex + visibleCount) ? 'block' : 'none';
            });
        }

        function cycleCards() {
            startIndex = (startIndex + 1) % cards.length;
            if (startIndex + visibleCount > cards.length) {
                startIndex = 0;
            }
            showCards();
        }

        // Initial display
        showCards();

        // Cycle every 3 seconds
        setInterval(cycleCards, 3000);