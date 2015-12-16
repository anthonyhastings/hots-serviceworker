'use strict';

// Loading dependencies.
import Randomiser from './randomiser';

// Caching selectors.
let heroes = Array.prototype.slice.call(document.querySelectorAll('.hero-grid__avatar'));

// Instantiating the randomiser and its logic.
let randomiser = new Randomiser({
    activeClass: 'hero-grid__hero--active',
    disabledClass: 'hero-footer__button--disabled',
    randomisingClass: 'hero-grid__container--randomising',
    selectionClass: 'hero-grid__hero--selection',
    ctaElement: document.querySelector('.hero-footer__button'),
    gridElement: document.querySelector('.hero-grid__container'),
    heroStack: Array.prototype.slice.call(document.querySelectorAll('.hero-grid__hero'))
});

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
    randomiser.cancel();
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

// Binding an event listener to each hero.
heroes.forEach((hero) => {
    hero.addEventListener('click', onHeroClick);
});

// Check localstorage for an existing key and highlight appropriate hero.
let existingHeroSelection = window.localStorage.getItem('currentHero');
if (typeof(existingHeroSelection) === 'string' && existingHeroSelection.length > 0) {
    let storedHero = document.querySelector(`.hero-grid__hero[data-hero-key="${existingHeroSelection}"]`);
    setCurrentHero(storedHero);
}

// Registering our service worker for offline capabilities.
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    navigator.serviceWorker.register('/serviceworker.js', {scope: '/'})
        .then((reg) => {
            console.info('ServiceWorker::registered', reg);
        })
        .catch((err) => {
            console.error('ServiceWorker::error', err);
        });
}
