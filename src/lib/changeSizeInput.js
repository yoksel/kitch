import {config} from '../data/config';
// import {updateSizes} from './sizesHandlers';

const changeSizeInputElem = document.querySelector('.size-input');
let currentSizeInput;

class changeSizeInput {
    constructor(params) {
        this.params = params;
        this.container = params.container;

        this.input = changeSizeInputElem;
        this.surfaceItem = params.surfaceItem;

        if (params.isClone) {
            this.input = changeSizeInputElem.cloneNode(true);
        }

        this.input.classList.add(`${this.container}__size-input`)

        this.input.value = params.value;
        this.input.dataset.line = params.line;
        this.input.dataset.content = params.content;

        if (params.pos !== undefined) {
            this.input.dataset.pos = params.pos;
        }

        this.addActions();

        return this.input;
    }

    getElements() {
        if (!this.configSizeInput) {
            this.configSizeInput = this.getConfigSizeInput();
        }
        if (!this.surfaceItem) {
            this.surfaceItem = this.getSurfaceItem();
        }
        if (this.surfaceItem) {
            this.surfaceText = this.surfaceItem.querySelector('.surface__size-text');
            this.surfaceSizeInput = this.surfaceItem.querySelector('.surface__size-input');
        }
    }

    addActions() {
        this.input.addEventListener('input', () => {
            this.changeSizeForItem();
        });

        this.input.addEventListener('focus', (ev) => {
            // Wait for full rendered page
            this.getElements();
            this.oldValue = this.input.value;
            currentSizeInput = this;
        });

        this.input.addEventListener('blur', (ev) => {
            if (this.surfaceItem) {
                this.surfaceItem.dataset.isEditing = 'false';
                currentSizeInput = null;
            }
        });
    }

    // ------------------------------

    changeSizeForItem() {
        const size = this.input.value;
        const line = this.params.line;
        const content = this.params.content;
        const pos = this.params.pos;

        this.surfaceItem.style[content] = `${size}px`;
        this.surfaceText.innerHTML = `${size}mm`;
        this.surfaceSizeInput.value = size;
        this.configSizeInput.value = size;

        if (pos !== undefined) {
            config[line][content][pos] = +size;
        }
        else {
            config[line][content] = +size;
        }

        updateSizes();
    }

    // ------------------------------

    getSurfaceItem() {
        const line = this.params.line;
        const pos = this.params.pos;
        let elem = null;

        if (pos !== undefined) {
            const selector = `.block--${line} .${line}__front[data-pos='${pos}']`;
            elem = document.querySelector(selector);
        }

        return elem;
    }

    // ------------------------------

    getConfigSizeInput() {
        const line = this.params.line;
        const content = this.params.content;
        const pos = this.params.pos;
        let elem = null;

        if (pos !== undefined) {
            const selector = `.config__size-input[data-line='${line}'][data-pos='${pos}']`;
            elem = document.querySelector(selector);
        }

        return elem;
    }
}

document.addEventListener('keyup', (ev) => {
    ev.stopPropagation();

    // Escape
    if (ev.keyCode === 27 && currentSizeInput) {
        const input = currentSizeInput.input;
        input.value = currentSizeInput.oldValue;
        currentSizeInput.changeSizeForItem();

        if (currentSizeInput.surfaceItem) {
            currentSizeInput.surfaceItem.dataset.isEditing = 'false';
        }
    }
});

export {changeSizeInput};
