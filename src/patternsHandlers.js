import {patterns} from './data/patterns';
import {walls} from './data/walls';

const patternsElem = document.querySelector('.patterns');
const wallsElem = document.querySelector('.walls');

const surfacePatternsCss = document.querySelector('.surface-patterns-css');
const wallsCss = document.querySelector('.walls-css');

const chooserClasses = {
    list: 'chooser__list',
    item: 'chooser__item',
    current: 'chooser__item--current'
};

// ------------------------------

function addPatterns() {
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
}

// ------------------------------

function setPatterns(params) {
    const elem = params.elem
    const list = params.list;
    const name = params.name;
    const target = params.target;
    const styles = params.styles;

    const listElem = document.createElement('ul');
    listElem.classList.add(chooserClasses.list);
    let current;

    list.forEach((item, i) => {
        const itemElem = document.createElement('li');
        itemElem.classList.add(chooserClasses.item);
        const imgPath = `./img/${item}`;
        itemElem.style.background = `url(${imgPath})`;
        listElem.appendChild(itemElem);

        if(i === 0) {
            itemElem.classList.add('chooser__item--current');
            itemElem.classList.add(chooserClasses.current);
            current = itemElem;
            setPattern(target, imgPath, styles);
        }

        itemElem.addEventListener('click', () => {
            setPattern(target, imgPath, styles);
            current.classList.remove(chooserClasses.current);
            itemElem.classList.add(chooserClasses.current);
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

export {addPatterns, setPatterns};
