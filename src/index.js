import './styles.css';

import {config} from './data/config';
import {patterns} from './data/patterns';
import {walls} from './data/walls';
import {elementsMap, setSizes} from './elementsMap';

const images = require.context('./img/', true);

const patternsElem = document.querySelector('.patterns');
const wallsElem = document.querySelector('.walls');
const rotatorRangeElem = document.querySelector('.rotator__range');
const sceneElem = document.querySelector('.scene');

const surfaceSizesCss = document.querySelector('.surface-sizes-css');
const surfacePatternsCss = document.querySelector('.surface-patterns-css');
const wallsCss = document.querySelector('.walls-css');

const changeSizeInput = document.querySelector('.surface__size-input');

let currentSurfaceItem;

const blocks = [
    {
        name: 'top',
        parent: document.querySelector('.block--top'),
        block: document.querySelector('.top__front'),
    },
    {
        name: 'bottom',
        parent: document.querySelector('.block--bottom'),
        block: document.querySelector('.bottom__front')
    },
];

// ------------------------------

addBlocks();
setSizes();
setSizesStyles();
showSizes();

setPatterns({
    name: 'patterns',
    elem: patternsElem,
    list: patterns,
    target: '.surface',
    styles: surfacePatternsCss
});
setPatterns({
    name: 'walls',
    elem: wallsElem,
    list: walls,
    target: '.wall',
    styles: wallsCss
});

rotatorRangeElem.addEventListener('input', function () {
    sceneElem.style.transform = `rotateY(${this.value}deg)`;
});

// ------------------------------

function setSizesStyles() {
    const stylesList = [];
    for([key, values] of elementsMap) {
        const valuesList = [];

        for(var prop in values) {
            const value = values[prop];
            const units = typeof value === 'number' ? 'px' : '';
            const styleItem = `${prop}: ${value}${units}`
            valuesList.push(styleItem);
        }
        stylesList.push(`${key}{${valuesList.join(';\n')}}`);
    }

    surfaceSizesCss.innerHTML = stylesList.join('\n');
}

// ------------------------------

function setPatterns(params) {
    const elem = params.elem
    const list = params.list;
    const name = params.name;
    const target = params.target;
    const styles = params.styles;

    const listElem = document.createElement('ul');
    listElem.classList.add(`chooser__list`);
    let current;

    const classes = {
        item: `chooser__item`,
        current: `chooser__item--current`
    };

    list.forEach((item, i) => {
        const itemElem = document.createElement('li');
        itemElem.classList.add(classes.item);
        const imgPath = `./img/${item}`;
        itemElem.style.background = `url(${imgPath})`;
        listElem.appendChild(itemElem);

        if(i === 0) {
            itemElem.classList.add('chooser__item--current');
            itemElem.classList.add(classes.current);
            current = itemElem;
            setPattern(target, imgPath, styles);
        }

        itemElem.addEventListener('click', () => {
            setPattern(target, imgPath, styles);
            current.classList.remove(classes.current);
            itemElem.classList.add(classes.current);
            current = itemElem;
        });
    });

    elem.appendChild(listElem);
}

// ------------------------------

function setPattern(target, imgPath, styles) {
    styles.innerHTML = `${target} {
        background-image: url(${imgPath});
    }`;
}

// ------------------------------

function addBlocks() {
    blocks.forEach(item => {
        const name = item.name;
        let widthSet = config[name].width;
        const block = item.block;
        const parent = item.parent;

        if (typeof widthSet === 'object') {
            widthSet.forEach((item, i) => {
                let currentBlock = block.cloneNode(true);

                if (i === 0) {
                    currentBlock = block;
                }

                currentBlock.style.width = `${item}px`;
                currentBlock.dataset.line = name;
                currentBlock.dataset.pos = i;

                if (i > 0) {
                    parent.appendChild(currentBlock);
                }

            })
        }
    });
}

// ------------------------------

function showSizes() {
    const surfaces = document.querySelectorAll('.surface[data-content]');
    let sizes;

    surfaces.forEach(surfaceItem => {
        const contentKey = surfaceItem.dataset.content;
        let size = getComputedStyle(surfaceItem)[contentKey];
        size = size.replace('px', 'mm');
        const sizeTextElem = surfaceItem.querySelector('.surface__size-text');
        sizeTextElem.innerHTML = size;

        const sizeElem = surfaceItem.querySelector('.surface__size');

        sizeElem.addEventListener('click', () => {
            if(surfaceItem.dataset.isEditing === 'true') {
                return;
            }
            if(currentSurfaceItem && currentSurfaceItem !== sizeElem) {
                const currentSizeTextElem = currentSurfaceItem.querySelector('.surface__size-input');
                removeSizeInput(currentSurfaceItem, currentSizeTextElem.value);
            }

            currentSurfaceItem = surfaceItem;
            addSizeInput(surfaceItem);
        });
    });
}

// ------------------------------

function addSizeInput(surfaceItem) {
    if(surfaceItem.dataset.isEditing === 'true') {
        return;
    }

    surfaceItem.dataset.isEditing = true;

    const sizeTextElem = surfaceItem.querySelector('.surface__size-text');
    const oldValue = sizeTextElem.innerText.replace('mm', '');
    surfaceItem.dataset.oldValue = oldValue;
    changeSizeInput.value = oldValue;
    sizeTextElem.innerHTML = '';
    sizeTextElem.appendChild(changeSizeInput);

    changeSizeInput.addEventListener('input', changeSizeForItem);

    // Handle one event at the time
    changeSizeInput.onkeyup = function (ev) {
        ev.stopPropagation();

        // Enter or escape
        if (ev.keyCode !== 13 && ev.keyCode !== 27) {
            return;
        }

        let value = changeSizeInput.value;
        // If escape, set old value
        if (ev.keyCode === 27) {
            value = oldValue;
        }

        changeSizeInput.removeEventListener('input', changeSizeForItem);
        removeSizeInput(surfaceItem, value);
    };

    function changeSizeForItem(ev) {
        if (surfaceItem.dataset.isEditing === 'false') {
            return;
        }
        ev.stopPropagation();
        changeSize(changeSizeInput.value, surfaceItem);
    }
}

// ------------------------------

function changeSize(size, surfaceItem) {
    const line = surfaceItem.dataset.line;
    const content = surfaceItem.dataset.content;
    const pos = surfaceItem.dataset.pos;
    surfaceItem.style[content] = `${size}px`;

    if (pos) {
        config[line][content][pos] = +size;
    }
    else {
        config[line][content] = +size;
    }


    updateSizes();
}

// ------------------------------

function updateSizes() {
    setSizes();
    setSizesStyles();
}

// ------------------------------

function removeSizeInput(surfaceItem, value) {
    if (!!surfaceItem.dataset.isEditing === true) {
        surfaceItem.dataset.isEditing = false;
        const sizeTextElem = surfaceItem.querySelector('.surface__size-text');
        sizeTextElem.innerHTML = `${value}mm`;
        currentSurfaceItem = null;

        changeSize(+value, surfaceItem);
        updateSizes();
    }
}

// ------------------------------
