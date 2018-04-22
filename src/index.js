import './styles.css';

import {config} from './data/config';
import {patterns} from './data/patterns';
import {walls} from './data/walls';

const images = require.context('./img/', true);

const patternsElem = document.querySelector('.patterns');
const wallsElem = document.querySelector('.walls');
const rotatorRangeElem = document.querySelector('.rotator__range');
const sceneElem = document.querySelector('.scene');
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

const surfaceSizesCss = document.querySelector('.surface-sizes-css');
const surfacePatternsCss = document.querySelector('.surface-patterns-css');
const wallsCss = document.querySelector('.walls-css');

const commonWidth = getWidth();

// ------------------------------

const elementsMap = new Map();
elementsMap.set('.wrapper', {
    width: commonWidth.max,
});
elementsMap.set('.scene', {
    width: commonWidth.max,
    height: config.verticalGap + config.top.height + config.bottom.height
});

elementsMap.set('.block--top', {
    width: commonWidth.top,
    height: config.top.height,
    transform: `translateZ(${config.top.deep}px)`,
});
elementsMap.set('.top__top', {
    width: commonWidth.top,
    height: config.top.deep,
});
elementsMap.set('.top__bottom', {
    width: commonWidth.top,
    height: config.top.deep,
});
elementsMap.set('.top__side', {
    width: config.top.deep,
    height: config.top.height,
});
elementsMap.set('.top__front', {
    width: config.top.width,
    height: config.top.height,
});

elementsMap.set('.block--bottom', {
    width: commonWidth.bottom,
    height: config.bottom.height,
    transform: `translateZ(${config.bottom.deep}px)`,
});
elementsMap.set('.bottom__top', {
    width: commonWidth.bottom,
    height: config.bottom.deep,
});
elementsMap.set('.bottom__bottom', {
    width: commonWidth.bottom,
    height: config.bottom.deep,
});
elementsMap.set( '.bottom__side', {
    width: config.bottom.deep,
    height: config.bottom.height,
});
elementsMap.set('.bottom__front', {
    width: config.bottom.width,
    height: config.bottom.height,
});

// ------------------------------

addBlocks();
setSizes();
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

function setSizes() {
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
        background-size: auto 100%;
    }`;
}

// ------------------------------

function getWidth() {
    let widthSets = [
        config.top.width,
        config.bottom.width
    ];

    widthSets = widthSets.map(widthSet => {

        if (typeof widthSet === 'object') {

            widthSet = widthSet.reduce((result, item) => {
                result += item;
                return result;
            }, 0)
        }

        return widthSet;
    });

    return {
        top: widthSets[0],
        bottom: widthSets[1],
        max: Math.max(...widthSets)
    };
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

    surfaces.forEach(item => {
        const contentKey = item.dataset.content;
        let size = getComputedStyle(item)[contentKey];
        size = size.replace('px', 'mm');
        const sizeElem = item.querySelector('.surface__size-text');
        sizeElem.innerHTML = size;
    });
}
