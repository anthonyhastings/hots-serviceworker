'use strict';

export default class Randomiser {

    /**
     * Setting up internal references for elements, scoped listeners,
     * default values and so on. Also binds necessary DOM events.
     *
     * @param {Object} options
     */
    constructor(options) {
        this.stack = options.heroStack;

        this.elements = {
            cta: options.ctaElement,
            grid: options.gridElement
        };

        this.classes = {
            active: options.activeClass,
            disabled: options.disabledClass,
            randomising: options.randomisingClass,
            selection: options.selectionClass
        };

        this._resetInternals();

        this.scopedListeners = {};
        this.scopedListeners.onClick = this.onClick.bind(this);
        this.scopedListeners.onTick = this.onTick.bind(this);

        this.elements.cta.addEventListener('click', this.scopedListeners.onClick, false);
    }

    /**
     * Cancels any impending animation frame the triggers for
     * clean-up logic to take place.
     */
    cancel() {
        window.cancelAnimationFrame(this.rafData.id);
        this._resetInternals();
    }

    /**
     * Disables the CTA, de-selects any active heroes, applies
     * necessary classes then schedules the animation to begin.
     *
     * @param {Object} event - DOM Event.
     */
    onClick(event) {
        event.preventDefault();

        if (this.elements.cta.classList.contains(this.classes.disabled)) {
            return false;
        }

        let currentlyActiveHero = this.elements.grid.querySelector(`.${this.classes.active}`);
        if (currentlyActiveHero) {
            currentlyActiveHero.classList.remove(this.classes.active);
        }

        this.elements.grid.classList.add(this.classes.randomising);
        this.elements.cta.classList.add(this.classes.disabled);

        this.rafData.id = window.requestAnimationFrame(this.scopedListeners.onTick);
    }

    /**
     * Sets initial variables if required, calculates duration values
     * and contains logic for rapidly selecting heroes then settling
     * on one final hero to highlight.
     *
     * @param {Number} timestamp - Timestamp of when the function was called.
     */
    onTick(timestamp) {
        // Record the time that the entire animation started.
        if (!this.rafData.started) {
            this.rafData.started = timestamp;
            this.rafData.lastSelection = timestamp;
        }

        // Determine the current duration the animation has occurred for.
        let currentDuration = timestamp - this.rafData.started;

        // Determine how long it has been since the last selection.
        let timeSinceLastSelection = timestamp - this.rafData.lastSelection;

        // If the animation has reached its climax, choose a random hero and stop.
        if (currentDuration >= this.animationData.maxDuration) {
            this._cancelSelection();
            this._resetInternals();

            this._getRandomHero()
                .querySelector('.hero-grid__avatar')
                .dispatchEvent(new MouseEvent('click'));

            return;
        }

        // Cycle through selection rates to find the right data based on the current time period.
        let selectionRate;
        for (let i = 0, length = this.animationData.selectionRates.length; i < length; i++) {
            let currentObject = this.animationData.selectionRates[i];

            if (currentDuration <= currentObject.maxDuration) {
                selectionRate = currentObject;
                break;
            }
        }

        // If enough time has passed then perform a selection by cancelling the previous one and choosing another.
        if (timeSinceLastSelection >= selectionRate.frequency) {
            let previouslySelected = this._cancelSelection();
            let newSelection = this._getRandomHero(previouslySelected);

            newSelection.classList.add(this.classes.selection);
            this.rafData.lastSelection = timestamp;
        }

        // Schedule the next call of our animation.
        this.rafData.id = window.requestAnimationFrame(this.scopedListeners.onTick);

        console.group('rAF Data');
        console.log('ID:', this.rafData.id);
        console.log('Time since last selection:', timeSinceLastSelection);
        console.log('Total Duration:', currentDuration);
        console.log('Selection Rate:', selectionRate);
        console.groupEnd('rAF Data');
    }

    /**
     * Finds an animation selection in the grid and resets it
     * to normal by removing a selection class.
     *
     * @return {Object} - The element found to have been selected (if any, else null).
     */
    _cancelSelection() {
        let currentlySelected = this.elements.grid.querySelector(`.${this.classes.selection}`);

        if (currentlySelected) {
            currentlySelected.classList.remove(this.classes.selection);
        }

        return currentlySelected;
    }

    /**
     * Chooses a random hero from the stack. Also has logic to
     * ensure a hero is banned from the choice.
     *
     * @param {Object} excludedHero - DOM element of hero to exclude.
     * @return {Object} - DOM Element.
     */
    _getRandomHero(excludedHero) {
        let maxIndex = this.stack.length - 1;
        let uniqueHeroChosen = false;
        let chosenHero;

        while (!uniqueHeroChosen) {
            let randomIndex = this._getRandomNumber(0, maxIndex);
            chosenHero = this.stack[randomIndex];

            if (chosenHero !== excludedHero) {
                uniqueHeroChosen = true;
            }
        }

        return chosenHero;
    }

    /**
     * Returns a random number between min and max (inclusive).
     *
     * @param {Number} min
     * @param {Number} max
     * @return {Number}
     */
    _getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Removes any classes set during the animation and resets
     * internal data structures ready for another animation.
     */
    _resetInternals() {
        this.elements.grid.classList.remove(this.classes.randomising);
        this.elements.cta.classList.remove(this.classes.disabled);

        this.rafData = {
            id: null,
            started: null,
            lastSelection: null
        };

        this.animationData = {
            maxDuration: 10000,
            selectionRates: [
                {
                    maxDuration: 2500,
                    frequency: (1000 / 8)
                },
                {
                    maxDuration: 5000,
                    frequency: (1000 / 6)
                },
                {
                    maxDuration: 7500,
                    frequency: (1000 / 4)
                },
                {
                    maxDuration: 10000,
                    frequency: (1000 / 2)
                }
            ]
        };
    }

}
