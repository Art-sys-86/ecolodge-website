document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.querySelector('.cards');
    const cards = document.querySelectorAll('.card');
    const cardInners = Array.from(cards).map(card => card.querySelector('.card__inner'));
    
    if (!cardsContainer || cards.length === 0) return;

    const cardCount = cards.length;
    cardsContainer.style.setProperty('--cards-count', cardCount);

    let containerTop = 0;
    let cardHeight = 0;
    const cardData = [];

        function updateLayoutMetrics() {
        cardHeight = cards[0].clientHeight;
        cardsContainer.style.setProperty('--card-height', `${cardHeight}px`);
        
        const rect = cardsContainer.getBoundingClientRect();
        containerTop = rect.top + window.scrollY;

        cardData.length = 0;
        cards.forEach((card, index) => {
            const offsetTop = 20 + index * 20;
            card.style.paddingTop = `${offsetTop}px`;
            const toScale = 1 - (cardCount - 1 - index) * 0.05;
            cardData.push({ toScale });
        });
    }

    updateLayoutMetrics();
    window.addEventListener('resize', updateLayoutMetrics);

    let ticking = false;

    function animateCards() {
        const scrolledInside = window.scrollY - containerTop;
        const progress = scrolledInside / cardHeight;

        for (let i = 0; i < cardCount; i++) {
            const cardInner = cardInners[i];
            if (!cardInner) continue;

            const data = cardData[i];

            if (i === 0) {
                if (progress <= 0) {
                    cardInner.style.opacity = '1';
                    cardInner.style.transform = 'scale(1)';
                    cardInner.style.filter = 'brightness(1)';
                } else if (progress > 0 && progress <= 1) {
                    cardInner.style.opacity = (1 - progress).toString();
                    cardInner.style.transform = `scale(${1 - progress * (1 - data.toScale)})`;
                    cardInner.style.filter = `brightness(${1 - progress * 0.25})`;
                } else {
                    cardInner.style.opacity = '0';
                    cardInner.style.transform = `scale(${data.toScale})`;
                    cardInner.style.filter = 'brightness(0.75)';
                }
                continue;
            }

            if (i === cardCount - 1) {
                if (progress < i - 1) {
                    cardInner.style.opacity = '0';
                    cardInner.style.transform = 'scale(1)';
                    cardInner.style.filter = 'brightness(1)';
                } else if (progress >= i - 1 && progress < i) {
                    const entranceProgress = progress - (i - 1);
                    cardInner.style.opacity = entranceProgress.toString();
                    cardInner.style.transform = 'scale(1)';
                    cardInner.style.filter = 'brightness(1)';
                } else {
                    cardInner.style.opacity = '1';
                    cardInner.style.transform = 'scale(1)';
                    cardInner.style.filter = 'brightness(1)';
                }
                continue;
            }

            if (progress < i - 1) {
                cardInner.style.opacity = '0';
                cardInner.style.transform = 'scale(1)';
                cardInner.style.filter = 'brightness(1)';
            } 
            else if (progress >= i - 1 && progress < i) {
                const entranceProgress = progress - (i - 1);
                cardInner.style.opacity = entranceProgress.toString();
                cardInner.style.transform = 'scale(1)';
                cardInner.style.filter = 'brightness(1)';
            } 
            else if (progress >= i && progress < i + 1) {
                const exitProgress = progress - i;
                cardInner.style.opacity = (1 - exitProgress).toString();
                cardInner.style.transform = `scale(${1 - exitProgress * (1 - data.toScale)})`;
                cardInner.style.filter = `brightness(${1 - exitProgress * 0.25})`;
            } 
            else {
                cardInner.style.opacity = '0';
                cardInner.style.transform = `scale(${data.toScale})`;
                cardInner.style.filter = 'brightness(0.75)';
            }
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(animateCards);
            ticking = true;
        }
    }, { passive: true });

    animateCards();
});