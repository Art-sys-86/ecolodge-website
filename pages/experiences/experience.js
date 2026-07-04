document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.querySelector('.cards');
    const cards = document.querySelectorAll('.card');
    const cardInners = Array.from(cards).map(card => card.querySelector('.card__inner'));

    if (!cardsContainer || cards.length === 0) return;

    const cardCount = cards.length;
    const cardData = [];
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    function clearInlineStyles() {
        cards.forEach(card => { card.style.paddingTop = ''; });
        cardInners.forEach(cardInner => {
            if (!cardInner) return;
            cardInner.style.opacity = '';
            cardInner.style.transform = '';
            cardInner.style.filter = '';
        });
    }

    function updateLayoutMetrics() {
        if (mobileQuery.matches) return;

        cards.forEach((card, index) => {
            const offsetTop = 20 + index * 20;
            card.style.paddingTop = `${offsetTop}px`;
            const toScale = 1 - (cardCount - 1 - index) * 0.05;
            cardData[index] = { toScale };
        });
    }

    let ticking = false;

    function animateCards() {
        if (mobileQuery.matches) { ticking = false; return; }

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
                cardInner.style.opacity = '0';
                cardInner.style.transform = 'scale(1)';
                cardInner.style.filter = 'brightness(1)';
            } else if (progress >= -0.5 && progress < 0) {
                const entranceProgress = (progress + 0.5) * 2;
                cardInner.style.opacity = entranceProgress.toString();
                cardInner.style.transform = 'scale(1)';
                cardInner.style.filter = 'brightness(1)';
            } else if (progress >= 0 && progress < 0.5) {
                cardInner.style.opacity = '1';
                cardInner.style.transform = 'scale(1)';
                cardInner.style.filter = 'brightness(1)';
            } else {
                const exitProgress = (progress - 0.5) * 2;
                cardInner.style.opacity = (1 - exitProgress).toString();
                cardInner.style.transform = `scale(${1 - exitProgress * (1 - data.toScale)})`;
                cardInner.style.filter = `brightness(${1 - exitProgress * 0.25})`;
            }
        });

        ticking = false;
    }

    function handleBreakpointChange() {
        clearInlineStyles();
        updateLayoutMetrics();
        if (!mobileQuery.matches) animateCards();
    }

    updateLayoutMetrics();
    window.addEventListener('resize', updateLayoutMetrics);

    window.addEventListener('scroll', () => {
        if (mobileQuery.matches) return;
        if (!ticking) {
            window.requestAnimationFrame(animateCards);
            ticking = true;
        }
    }, { passive: true });

    mobileQuery.addEventListener('change', handleBreakpointChange);

    if (mobileQuery.matches) {
        clearInlineStyles();
    } else {
        animateCards();
    }
});