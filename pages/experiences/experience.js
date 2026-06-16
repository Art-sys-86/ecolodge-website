document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.querySelector('.cards');
    const cards = document.querySelectorAll('.card');
    const cardInners = Array.from(cards).map(card => card.querySelector('.card__inner'));

    if (!cardsContainer || cards.length === 0) return;

    const cardCount = cards.length;
    const cardData = [];

    function updateLayoutMetrics() {
        cards.forEach((card, index) => {
            const offsetTop = 20 + index * 20;
            card.style.paddingTop = `${offsetTop}px`;
            const toScale = 1 - (cardCount - 1 - index) * 0.05;
            cardData[index] = { toScale };
        });
    }

    updateLayoutMetrics();
    window.addEventListener('resize', updateLayoutMetrics);

    let ticking = false;

    function animateCards() {
        cards.forEach((card, i) => {
            const cardInner = cardInners[i];
            if (!cardInner) return;

            const rect = card.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const cardCenter = rect.top + rect.height / 2;
            const distanceFromCenter = cardCenter - viewportCenter;
            const progress = -distanceFromCenter / rect.height;

            const data = cardData[i];

            if (i === cardCount - 1) {
                // Last card never fades out
                if (progress < -0.5) {
                    cardInner.style.opacity = '0';
                    cardInner.style.transform = 'scale(1)';
                    cardInner.style.filter = 'brightness(1)';
                } else {
                    const entranceProgress = Math.min(1, (progress + 0.5) * 2);
                    cardInner.style.opacity = entranceProgress.toString();
                    cardInner.style.transform = 'scale(1)';
                    cardInner.style.filter = 'brightness(1)';
                }
                return;
            }

            if (progress < -0.5) {
                // Card hasn't entered yet
                cardInner.style.opacity = '0';
                cardInner.style.transform = 'scale(1)';
                cardInner.style.filter = 'brightness(1)';
            } else if (progress >= -0.5 && progress < 0) {
                // Entering — fading in
                const entranceProgress = (progress + 0.5) * 2;
                cardInner.style.opacity = entranceProgress.toString();
                cardInner.style.transform = 'scale(1)';
                cardInner.style.filter = 'brightness(1)';
            } else if (progress >= 0 && progress < 0.5) {
                // Centered — fully visible, hold here
                cardInner.style.opacity = '1';
                cardInner.style.transform = 'scale(1)';
                cardInner.style.filter = 'brightness(1)';
            } else {
                // Exiting — fading out and scaling down
                const exitProgress = (progress - 0.5) * 2;
                cardInner.style.opacity = (1 - exitProgress).toString();
                cardInner.style.transform = `scale(${1 - exitProgress * (1 - data.toScale)})`;
                cardInner.style.filter = `brightness(${1 - exitProgress * 0.25})`;
            }
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(animateCards);
            ticking = true;
        }
    }, { passive: true });

    // Run once on load so first card isn't invisible
    animateCards();
});