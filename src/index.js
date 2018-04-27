import './styles.css';

import {config} from './data/config';
import {dictionary} from './data/dictionary';

// import {setSizes, setSizesStyles, updateSizes} from './lib/sizesHandlers';
import {addPatterns, setPatterns} from './lib/patternsHandlers';
import {changeSizeInput} from './lib/changeSizeInput';
import {HotSpot} from './lib/HotSpot';
import {createWalls} from './lib/Walls';

import {RequestUrl} from './lib/RequestUrl';
const requestUrl = new RequestUrl();

const images = require.context('./img/', true);

const configElem = document.querySelector('.config');
const rotatorRangeElem = document.querySelector('.rotator__range');
const wallsElem = document.querySelector('.walls');

const changeSizeInputElem = document.querySelector('.surface__size-input');

let currentSurfaceItem;

const chooserClasses = {
    listTitle: 'chooser__list-title',
    list: 'chooser__list',
    item: 'chooser__item',
    current: 'chooser__item--current'
};

// ------------------------------

// addPatterns();

createWalls();
addBlocks();

// setSizes();
// setSizesStyles();

showSizes();
showConfig();

rotatorRangeElem.addEventListener('input', function () {
    wallsElem.style.transform = `rotateY(${this.value}deg)`;
});

// ------------------------------

function addBlocks() {
    const blocks = [
        {
            name: 'top',
            block: document.querySelectorAll('.top__front'),
        },
        {
            name: 'bottom',
            block: document.querySelectorAll('.bottom__front')
        },
    ];


    console.log(config);

    blocks.forEach(item => {
        // const name = item.name;
        // let widthSet = config[name].width;
        // const block = item.block;
        // const parent = item.parent;

        // if (typeof widthSet === 'object') {
        //     widthSet.forEach((item, i) => {
        //         let newBlock = block.cloneNode(true);

        //         if (i === 0) {
        //             newBlock = block;
        //         }

        //         newBlock = new HotSpot(newBlock);

        //         newBlock.style.width = `${item}px`;
        //         newBlock.dataset.line = name;
        //         newBlock.dataset.pos = i;

        //         if (i > 0) {
        //             parent.appendChild(newBlock);
        //         }
        //     })
        // }
    });
}

// ------------------------------

function showSizes() {
    const surfaces = document.querySelectorAll('.surface[data-content]');
    let sizes;

    surfaces.forEach(surfaceItem => {
        const contentKey = surfaceItem.dataset.content;
        let size = getComputedStyle(surfaceItem)[contentKey];
        const sizeRaw = size.replace('px', '');
        size = `${sizeRaw}mm`;
        const sizeTextElem = surfaceItem.querySelector('.surface__size-text');
        sizeTextElem.innerHTML = size;

        const sizeElem = surfaceItem.querySelector('.surface__size');
        const inputParams = {
            container: 'surface',
            isClone: true,
            value: sizeRaw,
            surfaceItem: surfaceItem,
            line: surfaceItem.dataset.line,
            content: surfaceItem.dataset.content,
            pos: surfaceItem.dataset.pos
        };
        const itemSizeInput = new changeSizeInput(inputParams);
        sizeElem.appendChild(itemSizeInput);

        sizeElem.addEventListener('click', () => {
            if(surfaceItem.dataset.isEditing === 'true') {
                // Edit right now
                return;
            }
            if(currentSurfaceItem && currentSurfaceItem !== surfaceItem) {
                // Click on other element, stop editing current
                currentSurfaceItem.dataset.isEditing = 'false';
            }
            surfaceItem.dataset.isEditing = 'true';
            itemSizeInput.focus();
            currentSurfaceItem = surfaceItem;
        });
    });
}

// ------------------------------

function showConfig() {
    // configElem
    const parts = ['top','bottom'];

    // console.log(config);

    parts.forEach(part => {
        const propsItems = config[part];

        const listTitleElem = document.createElement('h3');
        listTitleElem.classList.add(chooserClasses.listTitle);
        listTitleElem.innerHTML = dictionary[part];

        const listElem = document.createElement('ul');
        listElem.classList.add(chooserClasses.list);

        for(var prop in propsItems) {
            let propValue = propsItems[prop];

            if (typeof propValue !== 'object') {
                propValue = [propValue];
            }

            const itemElem = document.createElement('li');
            itemElem.classList.add(chooserClasses.item);
            const itemTitleElem = document.createElement('div');
            itemTitleElem.innerHTML = dictionary[prop];
            itemElem.appendChild(itemTitleElem);

            propValue.forEach((value, i) => {
                const inputParams = {
                    container: 'config',
                    isClone: true,
                    value: value,
                    line: part,
                    content: prop
                };

                if (propValue.length > 1) {
                    inputParams.pos = i;
                }

                const itemContentInput = new changeSizeInput(inputParams);
                itemElem.appendChild(itemContentInput);
            });

            listElem.appendChild(itemElem);
        }

        configElem.appendChild(listTitleElem);
        configElem.appendChild(listElem);
    })
}
