(function() {

    'use strict';

    /**
     * Finds sibling elements to the one specified.
     *
     * @param {Object} targetElement - DOM Element.
     * @return {Array}
     */
    function getSiblings(targetElement) {
        let parentElement = targetElement.parentNode;
        let firstChildElement = parentElement.firstChild;
        let siblings = [];

        for (let currentNode = firstChildElement; currentNode; currentNode = currentNode.nextSibling) {
            if (currentNode.nodeType === 1 && currentNode !== targetElement) {
                siblings.push(currentNode);
            }
        }

        return siblings;
    }

    /**
     * Pauses audio from sibling heroes and also removes
     * any of their active classes before triggering
     * logic for activating the clicked hero.
     *
     * @param {Object} event - DOM Event.
     */
    function onHeroClick(event) {
        var targetHero = event.srcElement.parentNode;
        var siblingHeroes = getSiblings(targetHero);

        siblingHeroes.forEach(function(siblingHero) {
            let siblingHeroAudioElement = siblingHero.querySelector('audio');
            siblingHero.classList.remove('hero-grid__hero--active');
            siblingHeroAudioElement.pause();
            siblingHeroAudioElement.currentTime = 0;
        });

        setCurrentHero(targetHero);
    }

    /**
     * Plays the corresponding audio file for the
     * current hero and adds a selected class.
     *
     * Also stores the selection in localstorage
     * for use at a later point.
     *
     * @param {Object} heroElement - DOM Element.
     */
    function setCurrentHero(heroElement) {
        let audioElement = heroElement.querySelector('audio');

        heroElement.classList.add('hero-grid__hero--active');
        audioElement.play();

        window.localStorage.setItem('currentHero', heroElement.getAttribute('data-hero-key'));
    }

    // Caching selectors.
    var heroes = Array.prototype.slice.call(document.querySelectorAll('.hero-grid__avatar'));

    // Binding an event listener to each hero.
    heroes.forEach((hero) => {
        hero.addEventListener('click', onHeroClick);
    });

    // Check localstorage for an existing key and highlight appropriate hero.
    var existingHeroSelection = window.localStorage.getItem('currentHero');
    if (typeof(existingHeroSelection) === 'string' && existingHeroSelection.length > 0) {
        let storedHero = document.querySelector(`.hero-grid__hero[data-hero-key="${existingHeroSelection}"]`);
        setCurrentHero(storedHero);
    }

    // Registering our service worker for offline capabilities.
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/serviceworker.js', {scope: '/'})
            .then(function(reg) {
                console.info('ServiceWorker::registered', reg);
            })
            .catch(function(err) {
                console.error('ServiceWorker::error', err);
            });
    }

}());
